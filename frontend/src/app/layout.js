import { Inter } from "next/font/google"
import Header from "@/components/Layout/Header"
import Footer from "@/components/Layout/Footer"
import Sidebar from "@/components/Layout/Sidebar"
import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SoftBlue Bank",
  description: "Modern banking system",
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='flex h-screen bg-gray-100'>
          <Sidebar />
          <div className='flex-1 flex flex-col overflow-hidden'>
            <Header />
            <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-200'>
              <div className='container mx-auto px-6 py-8'>{children}</div>
            </main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  )
}
