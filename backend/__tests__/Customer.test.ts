import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import Customer, { ICustomer } from "../src/models/Customer"
import bcrypt from "bcrypt"

describe("Customer Model Test", () => {
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

  it("create & save customer successfully", async () => {
    const validCustomer = new Customer({
      name: "John Doe",
      email: "john@example.com",
      customerType: "persona_natural",
      password: "password123",
    })
    const savedCustomer = await validCustomer.save()

    expect(savedCustomer._id).toBeDefined()
    expect(savedCustomer.name).toBe(validCustomer.name)
    expect(savedCustomer.email).toBe(validCustomer.email)
    expect(savedCustomer.customerType).toBe(validCustomer.customerType)
    expect(savedCustomer.password).not.toBe("password123")
    expect(await bcrypt.compare("password123", savedCustomer.password)).toBe(true)

    const foundCustomer = await Customer.findOne({ email: "john@example.com" })
    expect(foundCustomer).toBeDefined()
    expect(foundCustomer?.password).not.toBe("password123")
    expect(await bcrypt.compare("password123", foundCustomer!.password)).toBe(true)
  })

  it("create customer with invalid email should fail", async () => {
    const customerWithInvalidEmail = new Customer({
      name: "Jane Doe",
      email: "invalid-email",
      customerType: "empresa",
      password: "password123",
    })
    let err
    try {
      await customerWithInvalidEmail.save()
    } catch (error) {
      err = error
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
  })

  it("create customer with invalid customer type should fail", async () => {
    const customerWithInvalidType = new Customer({
      name: "Bob Smith",
      email: "bob@example.com",
      customerType: "invalid",
      password: "password123",
    })
    let err
    try {
      await customerWithInvalidType.save()
    } catch (error) {
      err = error
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
  })

  it("password should be hashed before saving", async () => {
    const customer = new Customer({
      name: "Alice Johnson",
      email: "alice@example.com",
      customerType: "persona_natural",
      password: "password123",
    })
    await customer.save()
    expect(customer.password).not.toBe("password123")
    expect(await bcrypt.compare("password123", customer.password)).toBe(true)
  })

  it("comparePassword method should work correctly", async () => {
    const customer = new Customer({
      name: "Charlie Brown",
      email: "charlie@example.com",
      customerType: "empresa",
      password: "password123",
    })
    await customer.save()
    expect(await customer.comparePassword("password123")).toBe(true)
    expect(await customer.comparePassword("wrongpassword")).toBe(false)
  })

  it("findByEmail static method should work correctly", async () => {
    const customer = new Customer({
      name: "David Wilson",
      email: "david@example.com",
      customerType: "persona_natural",
      password: "password123",
    })
    await customer.save()
    const foundCustomer = await Customer.findByEmail("david@example.com")
    expect(foundCustomer).toBeDefined()
    expect(foundCustomer?.name).toBe(customer.name)
  })
})
