import React, { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"

interface CreateAccountButtonProps {
  onAccountCreated: () => void
  customerType: string
}

interface CustomJwtPayload {
  id: string
  email: string
  customerType: string
}

export default function CreateAccountButton({ onAccountCreated, customerType }: CreateAccountButtonProps) {
  const [loading, setLoading] = useState(false)
  const [city, setCity] = useState("")
  const [isEditingCity, setIsEditingCity] = useState(false)
  const [initialBalance, setInitialBalance] = useState("0")

  useEffect(() => {
    fetchUserCity()
  }, [])

  const fetchUserCity = async () => {
    // Placeholder function to fetch user's city
    setCity("New York") // Example default city
  }

  const getAccountType = (): string => {
    return customerType === "empresa" ? "checking" : "savings"
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No token found")
      }

      const decodedToken = jwtDecode<CustomJwtPayload>(token)

      const response = await fetch("http://localhost:5000/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId: decodedToken.id,
          accountType: getAccountType(),
          initialBalance: parseFloat(initialBalance),
          originCity: city,
        }),
      })

      if (response.ok) {
        onAccountCreated()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create account")
      }
    } catch (error) {
      console.error("Error creating account:", error)
      alert(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
      <form onSubmit={handleCreateAccount} className='space-y-6'>
        <div>
          <label htmlFor='accountType' className='block text-sm font-medium text-gray-700'>
            Account Type
          </label>
          <div className='mt-1'>
            <input
              type='text'
              id='accountType'
              value={getAccountType()}
              readOnly
              className='appearance-none text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            />
          </div>
        </div>
        <div>
          <label htmlFor='initialBalance' className='block text-sm font-medium text-gray-700'>
            Initial Balance
          </label>
          <div className='mt-1'>
            <input
              type='number'
              id='initialBalance'
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              min='0'
              step='0.01'
              className='appearance-none text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            />
          </div>
        </div>
        <div>
          <label htmlFor='city' className='block text-sm font-medium text-gray-700'>
            City
          </label>
          <div className='mt-1 flex rounded-md shadow-sm'>
            <input
              type='text'
              id='city'
              value={city}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
              readOnly={!isEditingCity}
              className='appearance-none text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            />
            <button
              type='button'
              onClick={() => setIsEditingCity(!isEditingCity)}
              className='ml-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              {isEditingCity ? "Save" : "Edit"}
            </button>
          </div>
        </div>
        <div>
          <button
            type='submit'
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              loading
                ? "bg-gray-400 cursor-not-allowed text-gray-700"
                : "bg-yellow-400 hover:bg-yellow-300 focus:ring-yellow-500 text-black"
            }`}
          >
            {loading ? "Creating..." : `Create ${getAccountType()} Account`}
          </button>
        </div>
      </form>
    </div>
  )
}
