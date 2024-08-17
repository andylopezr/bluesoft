import Layout from "@/components/Layout"
import CustomerForm from "../../components/CustomerForm"
import CustomerList from "../../components/CustomerList"

export default function Customers() {
  return (
    <Layout>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-4'>Manage Customers</h1>
        <CustomerForm />
        <CustomerList />
      </div>
    </Layout>
  )
}
