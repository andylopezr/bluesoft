import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import { ITransaction } from "../src/models/Transaction"
import Transaction from "../src/models/Transaction"

describe("Transaction Model Test", () => {
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

  afterEach(async () => {
    await Transaction.deleteMany({})
  })

  it("should create & save a transaction successfully", async () => {
    const validTransaction: ITransaction = new Transaction({
      accountId: new mongoose.Types.ObjectId(),
      amount: 100,
      type: "deposit",
      transactionCity: "New York",
    })
    const savedTransaction = await validTransaction.save()

    expect(savedTransaction._id).toBeDefined()
    expect(savedTransaction.accountId).toEqual(validTransaction.accountId)
    expect(savedTransaction.amount).toBe(validTransaction.amount)
    expect(savedTransaction.type).toBe(validTransaction.type)
    expect(savedTransaction.transactionCity).toBe(validTransaction.transactionCity)
  })

  it("should fail to create a transaction without required fields", async () => {
    const transactionWithoutRequiredFields = new Transaction({})

    await expect(transactionWithoutRequiredFields.save()).rejects.toThrow(mongoose.Error.ValidationError)
  })

  it("should fail to create a transaction with invalid type", async () => {
    const invalidTypeTransaction = new Transaction({
      accountId: new mongoose.Types.ObjectId(),
      amount: 100,
      type: "invalidtype",
      transactionCity: "New York",
    })

    await expect(invalidTypeTransaction.save()).rejects.toThrow(mongoose.Error.ValidationError)
  })

  it("should fail to create a transaction with negative amount", async () => {
    const negativeAmountTransaction = new Transaction({
      accountId: new mongoose.Types.ObjectId(),
      amount: -100,
      type: "deposit",
      transactionCity: "New York",
    })

    await expect(negativeAmountTransaction.save()).rejects.toThrow(mongoose.Error.ValidationError)
  })

  it("should fail to create a transaction with zero amount", async () => {
    const zeroAmountTransaction = new Transaction({
      accountId: new mongoose.Types.ObjectId(),
      amount: 0,
      type: "deposit",
      transactionCity: "New York",
    })

    await expect(zeroAmountTransaction.save()).rejects.toThrow(mongoose.Error.ValidationError)
  })
})
