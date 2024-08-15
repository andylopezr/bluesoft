import Account, { IAccount } from "../models/Account"
import SavingsAccount, { ISavingsAccount } from "../models/SavingsAccount"
import CheckingAccount, { ICheckingAccount } from "../models/CheckingAccount"
import Customer, { ICustomer } from "../models/Customer"
import mongoose, { ClientSession, Document } from "mongoose"

type AccountDocument = Document<mongoose.Types.ObjectId, {}, IAccount> & IAccount

export const createAccount = async (
  customerId: string,
  accountType: "savings" | "checking",
  initialBalance: number,
  originCity: string
): Promise<IAccount> => {
  const session: ClientSession = await mongoose.startSession()
  session.startTransaction()

  try {
    const customer = await Customer.findById(customerId).session(session)
    if (!customer) {
      throw new Error("Customer not found")
    }

    const accountNumber = Math.floor(100000 + Math.random() * 900000).toString()
    let account: AccountDocument

    const baseAccountData = {
      accountNumber,
      balance: initialBalance,
      originCity,
      customerId: new mongoose.Types.ObjectId(customerId),
    }

    if (accountType === "savings") {
      account = new SavingsAccount({
        ...baseAccountData,
        interestRate: 0.01,
      }) as AccountDocument
    } else {
      account = new CheckingAccount({
        ...baseAccountData,
        overdraftLimit: 100,
      }) as AccountDocument
    }

    await account.save({ session })

    if (!account._id) {
      throw new Error("Failed to generate account ID")
    }

    customer.accounts.push(account._id)

    await session.commitTransaction()
    return account
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

export const getAccountBalance = async (accountId: string): Promise<number> => {
  const account = await Account.findById(accountId)
  if (!account) {
    throw new Error("Account not found")
  }
  return account.balance
}

export const getRecentTransactions = async (accountId: string, limit: number = 10) => {
  const account = await Account.findById(accountId)
  if (!account) {
    throw new Error("Account not found")
  }
  // Implement logic to fetch recent transactions
  // This will be implemented when we create the Transaction model and service
}

export const generateMonthlyStatement = async (accountId: string, month: number, year: number) => {
  const account = await Account.findById(accountId)
  if (!account) {
    throw new Error("Account not found")
  }
  // Implement logic to generate monthly statement
  // This will involve fetching transactions for the specified month and year
}
