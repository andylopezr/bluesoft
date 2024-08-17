"use client"

import React, { useEffect, useState } from "react"

interface Customer {
  _id: string
  name: string
  email: string
  customerType: string
}

interface CustomerListProps {
  refresh: number
}

const CustomerList: React.FC<CustomerListProps> = ({ refresh }) => {
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
  }, [refresh])

  const handleRefresh = () => {
    fetchCustomers()
  }

  if (error) {
    return <div className='text-red-500'>{error}</div>
  }

  return (
    <div className='mt-8'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-3xl font-extrabold text-white'>Customer List</h2>
        <button
          onClick={handleRefresh}
          className='bg-yellow-400 text-black font-bold px-4 py-2 rounded-md shadow-sm hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-yellow-300'
          disabled={isLoading}
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      {isLoading ? (
        <p className='text-white'>Loading customers...</p>
      ) : (
        <div className='bg-white p-4 rounded-md shadow-sm'>
          {customers.map((customer) => (
            <div key={customer._id} className='py-2'>
              <h3 className='font-bold text-gray-800'>{customer.name}</h3>
              <p className='text-gray-600'>Email: {customer.email}</p>
              <p className='text-gray-600'>Type: {customer.customerType}</p>
              <hr className='my-2 border-gray-300' />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomerList
