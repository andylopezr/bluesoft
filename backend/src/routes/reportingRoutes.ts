import express, { Response } from "express"
import Transaction from "../models/Transaction"
import Customer from "../models/Customer"

const router = express.Router()

router.get("/clients-by-transactions", async (req: express.Request, res: Response) => {
  try {
    const { month, year } = req.query

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" })
    }

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

router.get("/clients-with-large-withdrawals", async (req: express.Request, res: Response) => {
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

function handleError(res: Response, error: unknown) {
  if (error instanceof Error) {
    res.status(400).json({ message: error.message })
  } else {
    res.status(500).json({ message: "An unexpected error occurred" })
  }
}

export default router
