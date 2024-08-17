import React, { useState, useEffect } from "react"

interface ReportGenerationProps {
  accountId: string
}

const ReportGeneration: React.FC<ReportGenerationProps> = ({ accountId }) => {
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

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

  useEffect(() => {
    setIsButtonDisabled(!(selectedYear && selectedMonth))
  }, [selectedYear, selectedMonth])

  const handleGenerateReport = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/accounts/${accountId}/statement?month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      if (response.ok) {
        const statement = await response.json()
        console.log("Generated statement:", statement)
        // Handle the statement data (e.g., display it or download as PDF)
      } else {
        throw new Error("Failed to generate report")
      }
    } catch (error) {
      console.error("Error generating report:", error)
    }
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-lg max-w-md w-full'>
      <h2 className='text-2xl font-bold mb-4 text-black'>Generate Report</h2>
      <form
        className='space-y-4'
        onSubmit={(e) => {
          e.preventDefault()
          handleGenerateReport()
        }}
      >
        <div>
          <label htmlFor='year' className='block text-sm font-medium text-gray-700'>
            Year
          </label>
          <select
            id='year'
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className='mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          >
            <option value=''>Select Year</option>
            {years.map((year) => (
              <option key={year} value={year.toString()}>
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
            className='mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          >
            <option value=''>Select Month</option>
            {months.map((month) => (
              <option
                key={month.value}
                value={month.value}
                disabled={parseInt(selectedYear) === currentYear && parseInt(month.value) > currentMonth}
              >
                {month.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type='submit'
          className={`w-full text-black flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold ${
            isButtonDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-400 hover:bg-yellow-300 focus:ring-yellow-500"
          } focus:outline-none focus:ring-2 focus:ring-offset-2`}
          disabled={isButtonDisabled}
        >
          Generate Report
        </button>
      </form>
    </div>
  )
}

export default ReportGeneration
