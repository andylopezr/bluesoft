import mongoose, { Types } from "mongoose"
import Account, { IAccount } from "../models/Account"
import Customer from "../models/Customer"
import Transaction, { ITransaction } from "../models/Transaction"

interface IAccountDocument extends IAccount, Document {
  _id: Types.ObjectId
}

export const createAccount = async (
  customerId: string,
  accountType: "savings" | "checking",
  initialBalance: number,
  originCity: string
): Promise<IAccountDocument> => {
  const customer = await Customer.findById(customerId)
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
    await createTransaction(savedAccount._id, initialBalance, "deposit", originCity)
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
  accountId: Types.ObjectId,
  amount: number,
  type: "deposit" | "withdrawal",
  transactionCity: string
): Promise<ITransaction> => {
  const account = await Account.findById(accountId)
  if (!account) {
    throw new Error("Account not found")
  }

  if (type === "withdrawal" && account.balance < amount) {
    throw new Error("Insufficient funds")
  }

  const newBalance = type === "deposit" ? account.balance + amount : account.balance - amount

  const transaction = new Transaction({
    accountId,
    amount,
    type,
    transactionCity,
  })

  await transaction.save()
  account.balance = newBalance
  await account.save()

  return transaction
}

export const getRecentTransactions = async (
  accountId: string,
  limit: number = 10
): Promise<ITransaction[]> => {
  const transactions = await Transaction.find({ accountId }).sort({ createdAt: -1 }).limit(limit)
  return transactions
}

export const generateMonthlyStatement = async (accountId: string, month: number, year: number) => {
  const account = await Account.findById(accountId)
  if (!account) {
    throw new Error("Account not found")
  }

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  const transactions = await Transaction.find({
    accountId,
    createdAt: { $gte: startDate, $lte: endDate },
  }).sort({ createdAt: 1 })

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
