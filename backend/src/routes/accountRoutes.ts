import express, { Request, Response } from "express"
import { Types } from "mongoose"
import * as accountService from "../services/accountService"

const router = express.Router()

router.post("/", async (req: Request, res: Response) => {
  try {
    const { customerId, accountType, initialBalance, originCity } = req.body
    const account = await accountService.createAccount(customerId, accountType, initialBalance, originCity)
    res.status(201).json(account)
  } catch (error) {
    handleError(res, error)
  }
})

router.get("/:id/balance", async (req: Request, res: Response) => {
  try {
    const balance = await accountService.getAccountBalance(req.params.id)
    res.json({ balance })
  } catch (error) {
    handleError(res, error)
  }
})

router.post("/:id/transactions", async (req: Request, res: Response) => {
  try {
    const { amount, type, transactionCity } = req.body
    const accountId = new Types.ObjectId(req.params.id)
    const transaction = await accountService.createTransaction(accountId, amount, type, transactionCity)
    res.status(201).json(transaction)
  } catch (error) {
    handleError(res, error)
  }
})

router.get("/:id/transactions", async (req: Request, res: Response) => {
  try {
    const transactions = await accountService.getRecentTransactions(req.params.id)
    res.json(transactions)
  } catch (error) {
    handleError(res, error)
  }
})

router.get("/:id/statement", async (req: Request, res: Response) => {
  try {
    const { month, year } = req.query
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

function handleError(res: Response, error: unknown) {
  if (error instanceof Error) {
    res.status(400).json({ message: error.message })
  } else {
    res.status(500).json({ message: "An unexpected error occurred" })
  }
}

export default router
