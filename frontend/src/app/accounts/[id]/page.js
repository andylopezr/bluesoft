import AccountDetails from "@/components/Account/AccountDetails"

export default function AccountPage({ params }) {
  return (
    <div>
      <h1 className='text-3xl font-bold mb-6'>Account Details</h1>
      <AccountDetails accountId={params.id} />
    </div>
  )
}
