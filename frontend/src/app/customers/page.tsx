"use client"

import Layout from "@/components/Layout"
import CustomerForm from "../../components/CustomerForm"
import CustomerList from "../../components/CustomerList"
import { useState } from "react"

export default function Customers() {
  const [refresh, setRefresh] = useState(0)

  const handleCustomerCreated = () => {
    setRefresh((prev) => prev + 1)
  }

  return (
    <Layout>
      <div className='container mx-auto px-4 py-8'>
        <CustomerForm onCustomerCreated={handleCustomerCreated} />
        <CustomerList refresh={refresh} />
      </div>
    </Layout>
  )
}
