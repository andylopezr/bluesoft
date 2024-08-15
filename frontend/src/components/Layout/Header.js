import Link from "next/link"

export default function Header() {
  return (
    <header className='bg-blue-600 text-white'>
      <div className='container mx-auto px-6 py-3 flex justify-between items-center'>
        <Link href='/' className='text-2xl font-bold'>
          SoftBlue Bank
        </Link>
        <nav>
          <ul className='flex space-x-4'>
            <li>
              <Link href='/accounts'>Accounts</Link>
            </li>
            <li>
              <Link href='/transactions'>Transactions</Link>
            </li>
            <li>
              <Link href='/reports'>Reports</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
