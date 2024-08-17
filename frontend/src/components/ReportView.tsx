import { formatCurrency } from "@/utils/formatCurrency"
import React from "react"

interface ReportViewProps {
  report: any
}

const ReportView: React.FC<ReportViewProps> = ({ report }) => {
  return (
    <div className='bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-black'>
      <h2 className='text-2xl font-bold mb-4 text-black'>Monthly Statement</h2>
      <p>Account Number: {report.accountNumber}</p>
      <p>Month: {report.month}</p>
      <p>Year: {report.year}</p>
      <p>Opening Balance: ${report.openingBalance.toFixed(2)}</p>
      <p>Closing Balance: ${report.closingBalance.toFixed(2)}</p>
      <h3 className='text-lg font-semibold'>Transactions</h3>
      <ul>
        {report.transactions.map((transaction: any) => (
          <li key={transaction._id}>
            {transaction.type === "deposit" ? "+" : "-"}
            {formatCurrency(Math.abs(transaction.amount))} on{" "}
            {new Date(transaction.createdAt).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ReportView
