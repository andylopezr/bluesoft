import express from "express"
import Customer from "../models/Customer"
import jwt from "jsonwebtoken"

const router = express.Router()

router.post("/", async (req, res) => {
  try {
    const { name, email, customerType, password } = req.body
    if (!["persona_natural", "empresa"].includes(customerType)) {
      return res.status(400).json({ message: "Invalid customer type" })
    }
    const newCustomer = new Customer({ name, email, customerType, password })
    const savedCustomer = await newCustomer.save()
    res.status(201).json({
      _id: savedCustomer._id,
      name: savedCustomer.name,
      email: savedCustomer.email,
      customerType: savedCustomer.customerType,
    })
  } catch (error) {
    res.status(400).json({ message: "Error creating customer", error })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const customer = await Customer.findOne({ email })
    if (!customer) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const isMatch = await customer.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const token = jwt.sign({ id: customer._id, email: customer.email }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    })

    res.json({ token })
  } catch (error) {
    res.status(500).json({ message: "Error during login", error })
  }
})

router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().select("-password")
    res.json(customers)
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error })
  }
})

export default router
