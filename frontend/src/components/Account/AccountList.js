import Link from "next/link"
import { useState, useEffect } from "react"
import { getAccounts } from "@/services/accountService"

export default function AccountList() {
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    async function fetchAccounts() {
      const fetchedAccounts = await getAccounts()
      setAccounts(fetchedAccounts)
    }
    fetchAccounts()
  }, [])

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {accounts.map((account) => (
        <Link href={`/accounts/${account.id}`} key={account.id} className='block'>
          <div className='bg-white p-4 rounded shadow hover:shadow-md transition-shadow'>
            <h3 className='text-lg font-semibold'>{account.accountNumber}</h3>
            <p>Balance: ${account.balance.toFixed(2)}</p>
            <p>Type: {account.type}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
