import React from "react"
import Navbar from "./Navbar"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-black to-gray-900'>
      <Navbar />
      <main className='container mx-auto px-4 py-8'>{children}</main>
    </div>
  )
}

export default Layout
