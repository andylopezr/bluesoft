import express, { Request, Response } from "express"
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware"
import * as accountService from "../services/accountService"
import { createTransaction } from "../services/transactionService"
import Transaction from "../models/Transaction"
import Customer from "../models/Customer"

const router = express.Router()

router.get("/clients-by-transactions", async (req: Request, res: Response) => {
  try {
    const { month, year } = req.query

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" })
    }

    const transactions = await Transaction.find({
      createdAt: {
        $gte: new Date(Number(year), Number(month) - 1, 1),
        $lte: new Date(Number(year), Number(month), 0),
      },
    })

    const clients = await Customer.aggregate([
      {
        $lookup: {
          from: "accounts",
          localField: "_id",
          foreignField: "customerId",
          as: "accounts",
        },
      },
      {
        $unwind: "$accounts",
      },
      {
        $lookup: {
          from: "transactions",
          localField: "accounts._id",
          foreignField: "accountId",
          as: "transactions",
        },
      },
      {
        $unwind: "$transactions",
      },
      {
        $match: {
          "transactions.createdAt": {
            $gte: new Date(Number(year), Number(month) - 1, 1),
            $lte: new Date(Number(year), Number(month), 0),
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          email: { $first: "$email" },
          accountNumber: { $first: "$accounts.accountNumber" },
          totalTransactions: {
            $sum: {
              $cond: [{ $eq: ["$transactions.type", "deposit"] }, "$transactions.amount", 0],
            },
          },
        },
      },
      { $sort: { totalTransactions: -1 } },
    ])

    res.json(clients)
  } catch (error) {
    handleError(res, error)
  }
})

router.get("/clients-with-large-withdrawals", async (req: Request, res: Response) => {
  try {
    const { month, year } = req.query

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" })
    }

    const transactions = await Transaction.aggregate([
      {
        $match: {
          type: "withdrawal",
          createdAt: {
            $gte: new Date(Number(year), Number(month) - 1, 1),
            $lte: new Date(Number(year), Number(month), 0),
          },
        },
      },
      {
        $group: {
          _id: "$accountId",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $match: {
          totalAmount: { $gt: 1000000 },
        },
      },
      {
        $lookup: {
          from: "accounts",
          localField: "_id",
          foreignField: "_id",
          as: "account",
        },
      },
      {
        $unwind: "$account",
      },
      {
        $lookup: {
          from: "customers",
          localField: "account.customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $unwind: "$customer",
      },
      {
        $lookup: {
          from: "transactions",
          localField: "account._id",
          foreignField: "accountId",
          as: "transactions",
        },
      },
      {
        $unwind: "$transactions",
      },
      {
        $match: {
          "transactions.transactionCity": { $ne: "$account.originCity" },
        },
      },
      {
        $group: {
          _id: "$customer._id",
          name: { $first: "$customer.name" },
          email: { $first: "$customer.email" },
          totalWithdrawals: { $sum: "$totalAmount" },
        },
      },
    ])

    res.json(transactions)
  } catch (error) {
    handleError(res, error)
  }
})

router.use(authMiddleware)

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

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const accountId = req.params.id
    await accountService.deleteAccount(accountId)
    res.status(204).end()
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
