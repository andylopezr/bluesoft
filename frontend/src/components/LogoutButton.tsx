import React from "react"

interface LogoutButtonProps {
  email: string
  onLogout: () => void
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ email, onLogout }) => {
  const handleLogout = () => {
    onLogout()
  }

  return (
    <button
      onClick={handleLogout}
      className='bg-yellow-400 text-black font-bold px-4 py-2 rounded-md hover:bg-yellow-300 transition duration-300 focus:ring-yellow-500'
    >
      Logout ({email})
    </button>
  )
}

export default LogoutButton
