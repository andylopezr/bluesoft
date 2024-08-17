import express, { Request, Response } from "express"
import * as transactionService from "../services/transactionService"

const router = express.Router()

interface TransactionRequest extends Request {
  body: {
    accountId: string
    amount: number
    type: "deposit" | "withdrawal"
    transactionCity: string
  }
}

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountId
 *               - amount
 *               - type
 *               - transactionCity
 *             properties:
 *               accountId:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [deposit, withdrawal]
 *               transactionCity:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created transaction
 *       400:
 *         description: Invalid input or missing required fields
 */
router.post("/", async (req: TransactionRequest, res: Response) => {
  try {
    const { accountId, amount, type, transactionCity } = req.body

    if (!accountId || !amount || !type || !transactionCity) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" })
    }

    if (type !== "deposit" && type !== "withdrawal") {
      return res.status(400).json({ message: "Invalid transaction type" })
    }

    const transaction = await transactionService.createTransaction(accountId, amount, type, transactionCity)
    res.status(201).json(transaction)
  } catch (error) {
    handleError(res, error)
  }
})

function handleError(res: Response, error: unknown) {
  if (error instanceof Error) {
    res.status(400).json({ message: error.message })
  } else {
    res.status(500).json({ message: "An unexpected error occurred" })
  }
}

export default router
