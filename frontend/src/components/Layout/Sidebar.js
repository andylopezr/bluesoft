import Link from "next/link"

export default function Sidebar() {
  return (
    <aside className='bg-gray-800 text-white w-64 min-h-screen p-4'>
      <nav>
        <ul className='space-y-2'>
          <li>
            <Link href='/dashboard' className='block p-2 hover:bg-gray-700 rounded'>
              Dashboard
            </Link>
          </li>
          <li>
            <Link href='/accounts' className='block p-2 hover:bg-gray-700 rounded'>
              Accounts
            </Link>
          </li>
          <li>
            <Link href='/transactions' className='block p-2 hover:bg-gray-700 rounded'>
              Transactions
            </Link>
          </li>
          <li>
            <Link href='/reports' className='block p-2 hover:bg-gray-700 rounded'>
              Reports
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
