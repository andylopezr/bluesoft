"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Layout from "@/components/Layout"
import CreateAccountButton from "@/components/CreateAccountButton"
import ReportGeneration from "@/components/ReportGeneration"
import Transaction from "@/components/Transaction"
import { jwtDecode } from "jwt-decode"
import ReportView from "@/components/ReportView"
import { formatCurrency } from "@/utils/formatCurrency"

interface CustomJwtPayload {
  id: string
  email: string
  customerType: string
  iat: number
  exp: number
}

interface Transaction {
  _id: string
  type: "deposit" | "withdrawal"
  amount: number
  createdAt: string
}

interface Account {
  _id: string
  accountNumber: string
  balance: number
  recentTransactions: Transaction[]
}

export default function Dashboard() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [customerType, setCustomerType] = useState("")
  const [showReportGeneration, setShowReportGeneration] = useState(false)
  const [report, setReport] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    } else {
      try {
        const decodedToken = jwtDecode<CustomJwtPayload>(token)
        setCustomerType(decodedToken.customerType)
        fetchAccounts()
      } catch (error) {
        console.error("Error decoding token:", error)
        localStorage.removeItem("token")
        router.push("/login")
      }
    }
  }, [router])

  const fetchAccounts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/accounts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        const data: Account[] = await response.json()
        const accountsWithTransactions = await Promise.all(
          data.map(async (account) => {
            const transactionsResponse = await fetch(
              `http://localhost:5000/api/accounts/${account._id}/transactions`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
            if (transactionsResponse.ok) {
              const transactions: Transaction[] = await transactionsResponse.json()
              return { ...account, recentTransactions: transactions }
            }
            return account
          })
        )
        setAccounts(accountsWithTransactions)
      } else {
        console.error("Failed to fetch accounts")
      }
    } catch (error) {
      console.error("Error fetching accounts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReportGeneration = async (data: any) => {
    setReport(data)
  }

  const handleDeleteAccount = async (accountId: string) => {
    if (accounts.length === 1) {
      alert("You cannot delete your only account.")
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/accounts/${accountId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        fetchAccounts()
      } else {
        throw new Error("Failed to delete account")
      }
    } catch (error) {
      console.error("Error deleting account:", error)
    }
  }

  const maskAccountNumber = (accountNumber: string) => {
    return "****" + accountNumber.slice(-4)
  }

  const toggleReportGeneration = () => {
    setShowReportGeneration(!showReportGeneration)
  }

  if (loading) {
    return (
      <Layout>
        <div className='flex justify-center items-center h-screen'>
          <p className='text-lg font-semibold'>Loading...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-6 text-white'>Dashboard</h1>
        <p className='mb-6 text-lg text-gray-600'>
          Customer Type:{" "}
          <span className='font-semibold'>{customerType === "empresa" ? "Business" : "Personal"}</span>
        </p>

        {accounts.length === 0 ? (
          <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
            <p className='mb-6 text-lg text-gray-700'>{"You don't have any accounts yet. Create one now:"}</p>
            <CreateAccountButton onAccountCreated={fetchAccounts} customerType={customerType} />
          </div>
        ) : (
          <div className='space-y-6'>
            {accounts.map((account) => (
              <div key={account._id} className='bg-white py-6 px-4 shadow sm:rounded-lg sm:px-6'>
                <div className='flex justify-between items-center mb-4'>
                  <p className='text-xl font-semibold text-gray-800'>
                    Account: {maskAccountNumber(account.accountNumber)}
                  </p>
                  <p className='text-2xl font-bold text-yellow-500'>{formatCurrency(account.balance)}</p>
                </div>
                <Transaction accountId={account._id} onTransactionComplete={fetchAccounts} />
                <h2 className='text-lg font-semibold text-gray-700 mt-6 mb-4'>Recent Transactions</h2>
                {account.recentTransactions && account.recentTransactions.length > 0 ? (
                  <ul className='space-y-3'>
                    {account.recentTransactions.map((transaction) => (
                      <li
                        key={transaction._id}
                        className='flex justify-between items-center py-2 border-b border-gray-200'
                      >
                        <span
                          className={`font-medium ${
                            transaction.type === "deposit" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {transaction.type === "deposit" ? "+" : "-"}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </span>
                        <span className='text-sm text-gray-500'>
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='text-gray-500 italic'>No recent transactions</p>
                )}
                {accounts.length > 1 && (
                  <button
                    onClick={() => handleDeleteAccount(account._id)}
                    className='mt-4 w-full text-white flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold bg-red-500 hover:bg-red-400 focus:ring-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2'
                  >
                    Delete Account
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {accounts.length > 0 && (
          <div className='mt-8'>
            <button
              onClick={toggleReportGeneration}
              className='mb-4 w-full text-black flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold bg-yellow-400 hover:bg-yellow-300 focus:ring-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2'
            >
              {showReportGeneration ? "Hide Report Generation" : "Generate Report"}
            </button>
          </div>
        )}
        {showReportGeneration && (
          <div className='space-y-4 flex items-start justify-start space-x-4'>
            <ReportGeneration accountId={accounts[0]._id} onReportGenerated={handleReportGeneration} />
            {report && <ReportView report={report} />}
          </div>
        )}
      </div>
    </Layout>
  )
}
