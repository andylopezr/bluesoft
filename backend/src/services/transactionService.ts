import Transaction, { ITransaction } from "../models/Transaction"
import Account from "../models/Account"

export const createTransaction = async (
  accountId: string,
  amount: number,
  type: "deposit" | "withdrawal",
  transactionCity: string
): Promise<ITransaction> => {
  try {
    const account = await Account.findById(accountId)
    if (!account) {
      throw new Error("Account not found")
    }

    if (type === "withdrawal" && account.balance < amount) {
      throw new Error("Insufficient funds")
    }

    const newBalance = type === "deposit" ? account.balance + amount : account.balance - amount

    account.balance = newBalance
    await account.save()

    const transaction = new Transaction({
      accountId,
      amount,
      type,
      transactionCity,
    })

    const savedTransaction = await transaction.save()

    return savedTransaction
  } catch (error) {
    console.error("Error in createTransaction:", error)
    throw error
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
