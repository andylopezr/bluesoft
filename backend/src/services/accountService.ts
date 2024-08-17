import { Types } from "mongoose"
import Account, { IAccount } from "../models/Account"
import Customer from "../models/Customer"
import Transaction, { ITransaction } from "../models/Transaction"
import { createTransaction } from "./transactionService"

interface IAccountDocument extends IAccount, Document {
  _id: Types.ObjectId
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
): Promise<IAccount> => {
  try {
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
      balance: 0,
      originCity,
      customerId,
      accountType,
    })

    const savedAccount = await account.save()

    await Customer.findByIdAndUpdate(customerId, { $push: { accounts: savedAccount._id } })

    if (initialBalance > 0) {
      await createTransaction(savedAccount._id.toString(), initialBalance, "deposit", originCity)
    }

    return savedAccount
  } catch (error) {
    console.error("Error in createAccount:", error)
    throw error
  }
}

export const deleteAccount = async (accountId: string): Promise<void> => {
  try {
    const account = await Account.findById(accountId)
    if (!account) {
      throw new Error("Account not found")
    }
    await Transaction.deleteMany({ accountId })
    await account.deleteOne({ _id: accountId })
  } catch (error) {
    console.error("Error in deleteAccount:", error)
    throw error
  }
}

export const getAccountBalance = async (accountId: string): Promise<number> => {
  const account = await Account.findById(accountId)
  if (!account) {
    throw new Error("Account not found")
  }
  return account.balance
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
