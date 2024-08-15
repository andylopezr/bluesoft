import TransactionList from "@/components/Transaction/TransactionList"
import TransactionForm from "@/components/Transaction/TransactionForm"

export default function TransactionsPage() {
  return (
    <div>
      <h1 className='text-3xl font-bold mb-6'>Transactions</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <h2 className='text-2xl font-semibold mb-4'>Recent Transactions</h2>
          <TransactionList />
        </div>
        <div>
          <h2 className='text-2xl font-semibold mb-4'>New Transaction</h2>
          <TransactionForm />
        </div>
      </div>
    </div>
  )
}
