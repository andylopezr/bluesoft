import Transaction, { ITransaction } from "../models/Transaction"
import Account from "../models/Account"
import mongoose from "mongoose"
import { sendMessage } from "../kafka/producer"

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

    await transaction.save({ session })

    await session.commitTransaction()

    await sendMessage("transactions", {
      accountId,
      amount,
      type,
      transactionCity,
      timestamp: new Date(),
    })

    return transaction
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
