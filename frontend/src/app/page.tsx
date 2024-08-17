import Image from "next/image"
import Layout from "../components/Layout"

export default function Home() {
  return (
    <Layout>
      <div>
        <div className='inset-0 flex flex-col justify-center items-center text-center z-10'>
          <h1 className='text-4xl font-bold text-white mb-4'>Welcome to Bluesoft Bank</h1>
          <p className='text-xl text-white'>Manage your customers, accounts, and transactions with ease.</p>
        </div>
        <Image
          src='/hero.png'
          alt='Hero Image'
          layout='responsive'
          width={1920}
          height={1080}
          className='object-cover'
        />
      </div>
    </Layout>
  )
}
