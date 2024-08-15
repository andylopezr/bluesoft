export default function Footer() {
  return (
    <footer className='bg-gray-800 text-white'>
      <div className='container mx-auto px-6 py-3 flex justify-between items-center'>
        <p>&copy; 2024 SoftBlue Bank. All rights reserved.</p>
        <nav>
          <ul className='flex space-x-4'>
            <li>
              <a href='#'>Privacy Policy</a>
            </li>
            <li>
              <a href='#'>Terms of Service</a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
