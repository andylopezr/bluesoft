import { formatCurrency } from "@/utils/formatCurrency"
import React, { useState, useEffect } from "react"

interface TransactionProps {
  accountId: string
  onTransactionComplete: () => void
}

type TransactionType = "deposit" | "withdrawal"

const Transaction: React.FC<TransactionProps> = ({ accountId, onTransactionComplete }) => {
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [transactionType, setTransactionType] = useState<TransactionType>("deposit")
  const [amount, setAmount] = useState<string>("")
  const [rawAmount, setRawAmount] = useState<number>(0)
  const [transactionCity, setTransactionCity] = useState("")
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setIsButtonDisabled(!(rawAmount > 0 && transactionCity))
  }, [rawAmount, transactionCity])

  const handleTransaction = (type: TransactionType) => {
    setTransactionType(type)
    setShowTransactionForm(true)
    setError("")
  }

  const handleBack = () => {
    setShowTransactionForm(false)
    setAmount("")
    setRawAmount(0)
    setTransactionCity("")
    setError("")
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "")
    const numericValue = parseFloat(value) || 0
    setRawAmount(numericValue)
    setAmount(formatCurrency(numericValue))
  }

  const submitTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    try {
      const response = await fetch(`http://localhost:5000/api/accounts/${accountId}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          amount: rawAmount,
          type: transactionType,
          transactionCity,
        }),
      })

      if (response.ok) {
        console.log(`${transactionType} successful`)
        setShowTransactionForm(false)
        setAmount("")
        setRawAmount(0)
        setTransactionCity("")
        onTransactionComplete()
      } else {
        const data = await response.json()
        throw new Error(data.message || "Transaction failed")
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unknown error occurred during the transaction")
      }
    }
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-lg max-w-md w-full'>
      <h2 className='text-2xl font-bold mb-4 text-black'>Transactions</h2>
      {!showTransactionForm ? (
        <div className='flex space-x-4'>
          <button
            onClick={() => handleTransaction("deposit")}
            className='w-full text-black flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold bg-green-400 hover:bg-green-300 focus:ring-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2'
          >
            Deposit
          </button>
          <button
            onClick={() => handleTransaction("withdrawal")}
            className='w-full text-black flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold bg-red-400 hover:bg-red-300 focus:ring-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2'
          >
            Withdraw
          </button>
        </div>
      ) : (
        <form className='space-y-4' onSubmit={submitTransaction}>
          <div>
            <label htmlFor='amount' className='block text-sm font-medium text-gray-700'>
              Amount
            </label>
            <input
              id='amount'
              type='text'
              value={amount}
              onChange={handleAmountChange}
              className='mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              required
            />
          </div>
          <div>
            <label htmlFor='city' className='block text-sm font-medium text-gray-700'>
              Transaction City
            </label>
            <input
              id='city'
              type='text'
              value={transactionCity}
              onChange={(e) => setTransactionCity(e.target.value)}
              className='mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              required
            />
          </div>
          {error && <div className='text-red-600 text-sm'>{error}</div>}
          <div className='flex space-x-4'>
            <button
              type='button'
              onClick={handleBack}
              className='w-1/2 text-black flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-bold bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              Back
            </button>
            <button
              type='submit'
              className={`w-1/2 text-black flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold ${
                isButtonDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-300 focus:ring-yellow-500"
              } focus:outline-none focus:ring-2 focus:ring-offset-2`}
              disabled={isButtonDisabled}
            >
              Submit {transactionType}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default Transaction
