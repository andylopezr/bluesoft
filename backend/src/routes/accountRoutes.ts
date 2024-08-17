import express, { Request, Response } from "express"
import { Types } from "mongoose"
import * as accountService from "../services/accountService"
import { AuthRequest } from "../middleware/authMiddleware"
import { createTransaction } from "../services/transactionService"

const router = express.Router()

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" })
    }
    const customerId = req.user.id
    const accounts = await accountService.getAccountsByCustomerId(customerId)
    res.json(accounts)
  } catch (error) {
    handleError(res, error)
  }
})

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" })
    }
    const { accountType, initialBalance, originCity } = req.body
    const customerId = req.user.id
    const account = await accountService.createAccount(customerId, accountType, initialBalance, originCity)
    res.status(201).json(account)
  } catch (error) {
    handleError(res, error)
  }
})

router.get("/:id/balance", async (req: AuthRequest, res: Response) => {
  try {
    const balance = await accountService.getAccountBalance(req.params.id)
    res.json({ balance })
  } catch (error) {
    handleError(res, error)
  }
})

router.post("/:id/transactions", async (req: AuthRequest, res: Response) => {
  try {
    const { amount, type, transactionCity } = req.body
    const accountId = req.params.id
    const transaction = await createTransaction(accountId, amount, type, transactionCity)
    res.status(201).json(transaction)
  } catch (error) {
    handleError(res, error)
  }
})

router.get("/:id/transactions", async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await accountService.getTransactionsByAccount(req.params.id)
    res.json(transactions)
  } catch (error) {
    handleError(res, error)
  }
})

router.get("/:id/statement", async (req: AuthRequest, res: Response) => {
  try {
    const { month, year } = req.query
    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" })
    }
    const statement = await accountService.generateMonthlyStatement(
      req.params.id,
      parseInt(month as string),
      parseInt(year as string)
    )
    res.json(statement)
  } catch (error) {
    handleError(res, error)
  }
})

router.get("/:id/transactions/all", async (req: AuthRequest, res: Response) => {
  try {
    const accountId = req.params.id
    const transactions = await accountService.getAllTransactions(accountId)
    res.json(transactions)
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
