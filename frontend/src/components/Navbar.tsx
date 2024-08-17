import Link from "next/link"

const Navbar: React.FC = () => {
  return (
    <nav className='bg-blue-500 p-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link href='/' className='text-white text-2xl font-bold'>
          Bluesoft Bank
        </Link>
        <ul className='flex space-x-4'>
          <li>
            <Link href='/customers' className='text-white hover:text-blue-200'>
              Customers
            </Link>
          </li>
          <li>
            <Link href='/accounts' className='text-white hover:text-blue-200'>
              Accounts
            </Link>
          </li>
          <li>
            <Link href='/transactions' className='text-white hover:text-blue-200'>
              Transactions
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
