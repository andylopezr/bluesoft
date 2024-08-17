"use client"

import React, { useState } from "react"

const CustomerForm: React.FC = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [customerType, setCustomerType] = useState("persona_natural")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    try {
      const response = await fetch("http://localhost:5000/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, customerType, password }),
      })

      if (!response.ok) {
        throw new Error("Failed to create customer")
      }

      const data = await response.json()
      console.log("Customer created:", data)
      // Reset form
      setName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setCustomerType("persona_natural")
    } catch (error) {
      setError("Error creating customer")
      console.error("Error:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {error && <div className='text-red-500'>{error}</div>}
      <div>
        <label htmlFor='name' className='block mb-1'>
          Name
        </label>
        <input
          type='text'
          id='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='w-full px-3 py-2 border rounded bg-gray-200 text-black'
          required
        />
      </div>
      <div>
        <label htmlFor='email' className='block mb-1'>
          Email
        </label>
        <input
          type='email'
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full px-3 py-2 border rounded bg-gray-200 text-black'
          required
        />
      </div>
      <div>
        <label htmlFor='password' className='block mb-1'>
          Password
        </label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full px-3 py-2 border rounded bg-gray-200 text-black'
          required
        />
      </div>
      <div>
        <label htmlFor='confirmPassword' className='block mb-1'>
          Confirm Password
        </label>
        <input
          type='password'
          id='confirmPassword'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className='w-full px-3 py-2 border rounded bg-gray-200 text-black'
          required
        />
      </div>
      <div>
        <label htmlFor='customerType' className='block mb-1'>
          Customer Type
        </label>
        <select
          id='customerType'
          value={customerType}
          onChange={(e) => setCustomerType(e.target.value)}
          className='w-full px-3 py-2 border rounded bg-gray-200 text-black'
        >
          <option value='persona_natural'>Persona Natural</option>
          <option value='empresa'>Empresa</option>
        </select>
      </div>
      <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
        Create Customer
      </button>
    </form>
  )
}

export default CustomerForm
