import express, { Request, Response } from "express"
import * as transactionService from "../services/transactionService"

const router = express.Router()

router.post("/", async (req: Request, res: Response) => {
  try {
    const { accountId, amount, type, transactionCity } = req.body
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
