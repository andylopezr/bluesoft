import mongoose, { Types } from "mongoose"
import Account, { IAccount } from "../models/Account"
import Customer, { ICustomer } from "../models/Customer"
import Transaction, { ITransaction } from "../models/Transaction"
import { sendMessage } from "../kafka/producer"

interface IAccountDocument extends IAccount, Document {
  _id: Types.ObjectId
}

interface ICustomerDocument extends Omit<ICustomer, "accounts">, Document {
  _id: Types.ObjectId
  accounts: Types.ObjectId[]
}

export const getAccountsByCustomerId = async (customerId: string): Promise<IAccountDocument[]> => {
  const accounts = await Account.find({ customerId: new Types.ObjectId(customerId) }).lean()
  if (!accounts || accounts.length === 0) {
    throw new Error("No accounts found for this customer")
  }
  return accounts as IAccountDocument[]
}

export const createAccount = async (
  customerId: string,
  accountType: "savings" | "checking",
  initialBalance: number,
  originCity: string
): Promise<IAccountDocument> => {
  const customer = (await Customer.findById(customerId)) as ICustomerDocument | null
  if (!customer) {
    throw new Error("Customer not found")
  }

  if (customer.customerType === "persona_natural" && accountType !== "savings") {
    throw new Error("Persona natural can only open savings accounts")
  }
  if (customer.customerType === "empresa" && accountType !== "checking") {
    throw new Error("Empresa can only open checking accounts")
  }

  const accountNumber = Math.floor(100000 + Math.random() * 900000).toString()

  const account = new Account({
    accountNumber,
    balance: initialBalance,
    originCity,
    customerId: new Types.ObjectId(customerId),
    accountType,
  })

  const savedAccount = (await account.save()) as IAccountDocument

  customer.accounts.push(savedAccount._id)
  await customer.save()

  if (initialBalance > 0) {
    await createTransaction(savedAccount._id.toString(), initialBalance, "deposit", originCity)
  }

  return savedAccount
}

export const getAccountBalance = async (accountId: string): Promise<number> => {
  const account = await Account.findById(accountId)
  if (!account) {
    throw new Error("Account not found")
  }
  return account.balance
}

export const createTransaction = async (
  accountId: string,
  amount: number,
  type: "deposit" | "withdrawal",
  transactionCity: string
): Promise<ITransaction> => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const account = await Account.findById(accountId).session(session)
    if (!account) {
      throw new Error("Account not found")
    }

    if (type === "withdrawal" && account.balance < amount) {
      throw new Error("Insufficient funds")
    }

    const newBalance = type === "deposit" ? account.balance + amount : account.balance - amount

    await Account.findByIdAndUpdate(accountId, { balance: newBalance }, { session })

    const transaction = new Transaction({
      accountId,
      amount,
      type,
      transactionCity,
    })

    const savedTransaction = await transaction.save({ session })

    await session.commitTransaction()

    await sendMessage("transactions", {
      accountId,
      amount,
      type,
      transactionCity,
      timestamp: new Date(),
    })

    return savedTransaction
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

export const getTransactionsByAccount = async (
  accountId: string,
  limit: number = 10
): Promise<ITransaction[]> => {
  return Transaction.find({ accountId }).sort({ createdAt: -1 }).limit(limit)
}

export const getAllTransactions = async (accountId: string): Promise<ITransaction[]> => {
  return Transaction.find({ accountId }).sort({ createdAt: -1 })
}

export const getMonthlyTransactions = async (
  accountId: string,
  month: number,
  year: number
): Promise<ITransaction[]> => {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  return Transaction.find({
    accountId,
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ createdAt: -1 })
}

export const generateMonthlyStatement = async (accountId: string, month: number, year: number) => {
  const account = await Account.findById(accountId)
  if (!account) {
    throw new Error("Account not found")
  }

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  const transactions = await getMonthlyTransactions(accountId, month, year)

  const openingBalance = await calculateOpeningBalance(accountId, startDate)
  const closingBalance = account.balance

  return {
    accountNumber: account.accountNumber,
    month,
    year,
    openingBalance,
    closingBalance,
    transactions,
  }
}

const calculateOpeningBalance = async (accountId: string, date: Date): Promise<number> => {
  const account = await Account.findById(accountId)
  if (!account) {
    throw new Error("Account not found")
  }

  const transactionsBeforeDate = await Transaction.find({
    accountId,
    createdAt: { $lt: date },
  })

  const totalDeposits = transactionsBeforeDate
    .filter((t) => t.type === "deposit")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalWithdrawals = transactionsBeforeDate
    .filter((t) => t.type === "withdrawal")
    .reduce((sum, t) => sum + t.amount, 0)

  return totalDeposits - totalWithdrawals
}
