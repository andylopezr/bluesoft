"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import LoginModal from "./LoginModal"
import LogoutButton from "./LogoutButton"
import { useRouter } from "next/navigation"

const Navbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    const token = localStorage.getItem("token")
    const email = localStorage.getItem("userEmail")
    if (token && email) {
      setUserEmail(email)
    }
  }, [])

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email)
    closeModal()
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userEmail")
    setUserEmail(null)
    if (isClient) {
      router.push("/")
    }
  }

  return (
    <>
      <nav className='bg-black bg-opacity-50 p-4 border-b border-gray-500'>
        <div className='container mx-auto flex justify-between items-center'>
          <Link href='/' className='text-[#0f03ff] text-2xl font-bold'>
            Bluesoft Bank
          </Link>
          <ul className='flex items-center space-x-6'>
            {!userEmail && (
              <>
                <li>
                  <Link href='/customers' className='text-white hover:text-gray-300'>
                    Create User
                  </Link>
                </li>
                <li>
                  <Link href='/reports' className='text-white hover:text-gray-300'>
                    Reports
                  </Link>
                </li>
              </>
            )}
            <li>
              {userEmail ? (
                <LogoutButton email={userEmail} onLogout={handleLogout} />
              ) : (
                <button
                  onClick={openModal}
                  className='bg-yellow-400 text-black font-bold px-4 py-2 rounded-md hover:bg-yellow-300 transition duration-300 focus:ring-yellow-500'
                >
                  Login
                </button>
              )}
            </li>
          </ul>
        </div>
      </nav>
      {isModalOpen && <LoginModal closeModal={closeModal} onLoginSuccess={handleLoginSuccess} />}
    </>
  )
}

export default Navbar
