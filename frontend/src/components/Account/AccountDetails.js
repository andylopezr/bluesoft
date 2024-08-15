import { useState, useEffect } from "react"
import { getAccountDetails } from "@/services/accountService"

export default function AccountDetails({ accountId }) {
  const [account, setAccount] = useState(null)

  useEffect(() => {
    async function fetchAccountDetails() {
      const fetchedAccount = await getAccountDetails(accountId)
      setAccount(fetchedAccount)
    }
    fetchAccountDetails()
  }, [accountId])

  if (!account) return <div>Loading...</div>

  return (
    <div className='bg-white p-6 rounded shadow'>
      <h2 className='text-2xl font-semibold mb-4'>Account Details</h2>
      <p>
        <strong>Account Number:</strong> {account.accountNumber}
      </p>
      <p>
        <strong>Balance:</strong> ${account.balance.toFixed(2)}
      </p>
      <p>
        <strong>Type:</strong> {account.type}
      </p>
      <p>
        <strong>Origin City:</strong> {account.originCity}
      </p>
      <h3 className='text-xl font-semibold mt-6 mb-2'>Recent Transactions</h3>
      {/* Add a list of recent transactions here */}
    </div>
  )
}
