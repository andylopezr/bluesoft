import RootLayout from "./layout"

export default function Home() {
  return (
    <RootLayout>
      <div className='text-center'>
        <h1 className='text-4xl font-bold mb-4'>Welcome to Bluesoft Bank</h1>
        <p className='text-xl mb-8'>Your modern banking solution</p>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-2xl font-semibold mb-2'>Account Management</h2>
            <p>Easily manage your savings and checking accounts</p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-2xl font-semibold mb-2'>Real-time Transactions</h2>
            <p>Process transactions instantly and securely</p>
          </div>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-2xl font-semibold mb-2'>Comprehensive Reporting</h2>
            <p>Get detailed insights into your financial activities</p>
          </div>
        </div>
      </div>
    </RootLayout>
  )
}
