"use client"

import React, { useState } from "react"
import Layout from "@/components/Layout"
import { formatCurrency } from "@/utils/formatCurrency"

const Reports: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [clientsByTransactions, setClientsByTransactions] = useState<any[]>([])
  const [clientsWithLargeWithdrawals, setClientsWithLargeWithdrawals] = useState<any[]>([])

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ]

  const handleGenerateReports = async () => {
    try {
      const transactionsResponse = await fetch(
        `http://localhost:5000/api/reporting/clients-by-transactions?month=${selectedMonth}&year=${selectedYear}`
      )
      const transactionsData = await transactionsResponse.json()
      if (Array.isArray(transactionsData)) {
        setClientsByTransactions(transactionsData)
      } else {
        console.error("Unexpected format for clientsByTransactions:", transactionsData)
        setClientsByTransactions([])
      }

      const withdrawalsResponse = await fetch(
        `http://localhost:5000/api/reporting/clients-with-large-withdrawals?month=${selectedMonth}&year=${selectedYear}`
      )
      const withdrawalsData = await withdrawalsResponse.json()
      if (Array.isArray(withdrawalsData)) {
        setClientsWithLargeWithdrawals(withdrawalsData)
      } else {
        console.error("Unexpected format for clientsWithLargeWithdrawals:", withdrawalsData)
        setClientsWithLargeWithdrawals([])
      }
    } catch (error) {
      console.error("Error generating reports:", error)
    }
  }

  const isButtonDisabled = !(selectedYear && selectedMonth)

  return (
    <Layout>
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-6 text-white'>Reports</h1>
        <div className='space-y-6'>
          <div className='bg-white p-6 rounded-lg shadow-lg'>
            <form className='space-y-4'>
              <div>
                <label htmlFor='year' className='block text-sm font-medium text-gray-700'>
                  Year
                </label>
                <select
                  id='year'
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className='mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm'
                >
                  <option value=''>Select Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor='month' className='block text-sm font-medium text-gray-700'>
                  Month
                </label>
                <select
                  id='month'
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className='mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm'
                >
                  <option value=''>Select Month</option>
                  {months.map((month) => (
                    <option
                      key={month.value}
                      value={month.value}
                      disabled={
                        parseInt(selectedYear) === currentYear && parseInt(month.value) > currentMonth
                      }
                    >
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type='button'
                onClick={handleGenerateReports}
                className={`w-full text-black flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold ${
                  isButtonDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-400 hover:bg-yellow-300 focus:ring-yellow-500"
                } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                disabled={isButtonDisabled}
              >
                Generate Reports
              </button>
            </form>
          </div>
          <div className='space-y-6'>
            <div className='bg-white py-6 px-4 shadow sm:rounded-lg sm:px-6 text-black'>
              <h2 className='text-xl font-bold mb-4'>Clients by Transaction Volume</h2>
              {clientsByTransactions.length > 0 ? (
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Email
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Name
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Account No.
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {clientsByTransactions.map((client: any) => (
                      <tr key={client._id}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{client.email}</td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{client.name}</td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {client.accountNumber}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {formatCurrency(client.totalTransactions)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className='text-gray-600'>No results for the current criteria...</p>
              )}
            </div>
            <div className='bg-white py-6 px-4 shadow sm:rounded-lg sm:px-6 text-black'>
              <h2 className='text-xl font-bold mb-4'>Clients with Large Withdrawals</h2>
              {clientsWithLargeWithdrawals.length > 0 ? (
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Email
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Name
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {clientsWithLargeWithdrawals.map((client: any) => (
                      <tr key={client._id}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{client.email}</td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{client.name}</td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {formatCurrency(client.totalWithdrawals)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className='text-gray-600'>No results for the current criteria...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Reports
