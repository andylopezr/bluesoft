import express, { Request, Response } from "express"
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware"
import * as accountService from "../services/accountService"
import { createTransaction } from "../services/transactionService"
import Transaction from "../models/Transaction"
import Customer from "../models/Customer"

const router = express.Router()

router.use(authMiddleware)

/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: Get all accounts for the authenticated user
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of accounts
 *       401:
 *         description: User not authenticated
 */
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

/**
 * @swagger
 * /api/accounts:
 *   post:
 *     summary: Create a new account
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountType
 *               - initialBalance
 *               - originCity
 *             properties:
 *               accountType:
 *                 type: string
 *               initialBalance:
 *                 type: number
 *               originCity:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created account
 *       401:
 *         description: User not authenticated
 */
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

/**
 * @swagger
 * /api/accounts/{id}:
 *   delete:
 *     summary: Delete an account
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Account deleted
 *       401:
 *         description: User not authenticated
 */
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const accountId = req.params.id
    await accountService.deleteAccount(accountId)
    res.status(204).end()
  } catch (error) {
    handleError(res, error)
  }
})

/**
 * @swagger
 * /api/accounts/{id}/balance:
 *   get:
 *     summary: Get account balance
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account balance
 *       401:
 *         description: User not authenticated
 */
router.get("/:id/balance", async (req: AuthRequest, res: Response) => {
  try {
    const balance = await accountService.getAccountBalance(req.params.id)
    res.json({ balance })
  } catch (error) {
    handleError(res, error)
  }
})

/**
 * @swagger
 * /api/accounts/{id}/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - transactionCity
 *             properties:
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
 *       401:
 *         description: User not authenticated
 */
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

/**
 * @swagger
 * /api/accounts/{id}/transactions:
 *   get:
 *     summary: Get transactions for an account
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of transactions
 *       401:
 *         description: User not authenticated
 */
router.get("/:id/transactions", async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await accountService.getTransactionsByAccount(req.params.id)
    res.json(transactions)
  } catch (error) {
    handleError(res, error)
  }
})

/**
 * @swagger
 * /api/accounts/{id}/statement:
 *   get:
 *     summary: Generate monthly statement
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Monthly statement
 *       400:
 *         description: Month and year are required
 *       401:
 *         description: User not authenticated
 */
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

/**
 * @swagger
 * /api/accounts/{id}/transactions/all:
 *   get:
 *     summary: Get all transactions for an account
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of all transactions
 *       401:
 *         description: User not authenticated
 */
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
