import express from "express"
import Customer from "../models/Customer"
import jwt from "jsonwebtoken"

const router = express.Router()

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - customerType
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               customerType:
 *                 type: string
 *                 enum: [persona_natural, empresa]
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created customer
 *       400:
 *         description: Error creating customer
 */
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

/**
 * @swagger
 * /api/customers/login:
 *   post:
 *     summary: Customer login
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid email or password
 */
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

    const token = jwt.sign(
      {
        id: customer._id,
        email: customer.email,
        customerType: customer.customerType,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "8h",
      }
    )

    res.json({ token })
  } catch (error) {
    res.status(500).json({ message: "Error during login", error })
  }
})

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: List of all customers
 *       500:
 *         description: Error fetching customers
 */
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().select("-password")
    res.json(customers)
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error })
  }
})

export default router
