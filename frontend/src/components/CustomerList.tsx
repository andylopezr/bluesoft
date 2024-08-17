"use client"

import React, { useEffect, useState } from "react"

interface Customer {
  _id: string
  name: string
  email: string
  customerType: string
}

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const fetchCustomers = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch("http://localhost:5000/api/customers")
      if (!response.ok) {
        throw new Error("Failed to fetch customers")
      }
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      setError("Error fetching customers")
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const handleRefresh = () => {
    fetchCustomers()
  }

  if (error) {
    return <div className='text-red-500'>{error}</div>
  }

  return (
    <div className='mt-8'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-bold'>Customer List</h2>
        <button
          onClick={handleRefresh}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300'
          disabled={isLoading}
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      {isLoading ? (
        <p>Loading customers...</p>
      ) : (
        <ul className='space-y-4'>
          {customers.map((customer) => (
            <li key={customer._id} className='border p-4 rounded'>
              <h3 className='font-bold'>{customer.name}</h3>
              <p>Email: {customer.email}</p>
              <p>Type: {customer.customerType}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CustomerList
