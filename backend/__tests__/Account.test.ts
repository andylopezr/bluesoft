import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import Account, { IAccount } from "../src/models/Account"

describe("Account Model Test", () => {
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

  it("create & save account successfully", async () => {
    const validAccount = new Account({
      accountNumber: "1234567890",
      balance: 1000,
      originCity: "New York",
      customerId: new mongoose.Types.ObjectId(),
      accountType: "savings",
      owner: new mongoose.Types.ObjectId(),
    })
    const savedAccount = await validAccount.save()

    expect(savedAccount._id).toBeDefined()
    expect(savedAccount.accountNumber).toBe(validAccount.accountNumber)
    expect(savedAccount.balance).toBe(validAccount.balance)
    expect(savedAccount.originCity).toBe(validAccount.originCity)
    expect(savedAccount.customerId).toEqual(validAccount.customerId)
    expect(savedAccount.accountType).toBe(validAccount.accountType)
  })

  it("insert account successfully, but the field not defined in schema should be undefined", async () => {
    const accountWithInvalidField = new Account({
      accountNumber: "0987654321",
      balance: 2000,
      originCity: "Los Angeles",
      customerId: new mongoose.Types.ObjectId(),
      accountType: "checking",
      owner: new mongoose.Types.ObjectId(),
      invalidField: "test",
    })
    const savedAccountWithInvalidField = await accountWithInvalidField.save()
    expect(savedAccountWithInvalidField._id).toBeDefined()
  })

  it("create account without required fields should fail", async () => {
    const accountWithoutRequiredFields = new Account({ accountNumber: "1234567890" })
    let err
    try {
      await accountWithoutRequiredFields.save()
    } catch (error) {
      err = error
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError)

    if (err instanceof mongoose.Error.ValidationError) {
      expect(err.errors.accountNumber).toBeUndefined()
      expect(err.errors.originCity).toBeDefined()
      expect(err.errors.customerId).toBeDefined()
      expect(err.errors.accountType).toBeDefined()
    }
  })

  it("create account with invalid account type should fail", async () => {
    const accountWithInvalidType = new Account({
      accountNumber: "1234567890",
      balance: 1000,
      originCity: "New York",
      customerId: new mongoose.Types.ObjectId(),
      owner: new mongoose.Types.ObjectId(),
      accountType: "invalid",
    })
    let err
    try {
      await accountWithInvalidType.save()
    } catch (error) {
      err = error
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
    if (err instanceof mongoose.Error.ValidationError) {
      expect(err.errors.accountType).toBeDefined()
    }
  })
})
