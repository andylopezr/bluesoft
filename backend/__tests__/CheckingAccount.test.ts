import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import CheckingAccount, { ICheckingAccount } from "../src/models/CheckingAccount"

describe("CheckingAccount Model Test", () => {
  let mongoServer: MongoMemoryServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  it("create & save checking account successfully", async () => {
    const validCheckingAccount = new CheckingAccount({
      accountNumber: "1234567890",
      balance: 1000,
      originCity: "New York",
      customerId: new mongoose.Types.ObjectId(),
      accountType: "checking",
      overdraftLimit: 500,
    })
    const savedCheckingAccount = await validCheckingAccount.save()

    expect(savedCheckingAccount._id).toBeDefined()
    expect(savedCheckingAccount.accountNumber).toBe(validCheckingAccount.accountNumber)
    expect(savedCheckingAccount.balance).toBe(validCheckingAccount.balance)
    expect(savedCheckingAccount.originCity).toBe(validCheckingAccount.originCity)
    expect(savedCheckingAccount.customerId).toEqual(validCheckingAccount.customerId)
    expect(savedCheckingAccount.accountType).toBe(validCheckingAccount.accountType)
    expect(savedCheckingAccount.overdraftLimit).toBe(validCheckingAccount.overdraftLimit)
  })

  it("create checking account with default overdraft limit", async () => {
    const checkingAccountWithDefaultOverdraft = new CheckingAccount({
      accountNumber: "0987654321",
      balance: 2000,
      originCity: "Los Angeles",
      customerId: new mongoose.Types.ObjectId(),
      accountType: "checking",
    })
    const savedAccount = await checkingAccountWithDefaultOverdraft.save()
    expect(savedAccount.overdraftLimit).toBe(0)
  })

  it("create checking account with negative overdraft limit should fail", async () => {
    const checkingAccountWithNegativeOverdraft = new CheckingAccount({
      accountNumber: "1357924680",
      balance: 3000,
      originCity: "Chicago",
      customerId: new mongoose.Types.ObjectId(),
      accountType: "checking",
      overdraftLimit: -100,
    })

    await expect(checkingAccountWithNegativeOverdraft.save()).rejects.toThrow(mongoose.Error.ValidationError)
  })
})
