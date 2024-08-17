"use client"

import React, { useState, useEffect } from "react"
import AccountCreationModal from "./AccountCreationModal"

interface CustomerFormProps {
  onCustomerCreated: () => void
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onCustomerCreated }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [customerType, setCustomerType] = useState("persona_natural")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [isPasswordValid, setIsPasswordValid] = useState(true)
  const [passwordsMatch, setPasswordsMatch] = useState(true)

  useEffect(() => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const emailValid = email === "" || emailPattern.test(email)
    setIsEmailValid(emailValid)

    const passwordValid = password.length >= 3
    setIsPasswordValid(passwordValid)

    const passwordsMatch = password === confirmPassword
    setPasswordsMatch(passwordsMatch)

    setIsButtonDisabled(!(name.length >= 2 && emailValid && passwordValid && passwordsMatch))
  }, [name, email, password, confirmPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!isEmailValid || !passwordsMatch) {
      setError("Please fix the errors before submitting")
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

      setSuccess(true)
      onCustomerCreated()
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
    <div className='min-h-fit flex flex-col justify-start py-12 sm:px-6 lg:px-8'>
      <AccountCreationModal
        show={error !== "" || success}
        message={error || "Customer created successfully!"}
        onClose={() => {
          setError("")
          setSuccess(false)
        }}
      />
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='text-center text-3xl font-extrabold text-white'>Create a Customer Account</h2>
      </div>
      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {error && <div className='text-red-600 text-sm'>{error}</div>}
            <div>
              <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                Name
              </label>
              <div className='mt-1'>
                <input
                  type='text'
                  id='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='appearance-none text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  required
                />
                {name.length > 0 && name.length < 2 && (
                  <div className='text-red-600 text-sm mt-1'>Name must be at least 2 characters long</div>
                )}
              </div>
            </div>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                Email
              </label>
              <div className='mt-1'>
                <input
                  type='email'
                  id='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='appearance-none text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  required
                />
                {!isEmailValid && email !== "" && (
                  <div className='text-red-600 text-sm mt-1'>Invalid email address</div>
                )}
              </div>
            </div>
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                Password
              </label>
              <div className='mt-1'>
                <input
                  type='password'
                  id='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='appearance-none text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  required
                />
                {password.length > 0 && password.length < 3 && (
                  <div className='text-red-600 text-sm mt-1'>Password must be at least 3 characters long</div>
                )}
              </div>
            </div>
            <div>
              <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700'>
                Confirm Password
              </label>
              <div className='mt-1'>
                <input
                  type='password'
                  id='confirmPassword'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className='appearance-none text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  required
                />
                {!passwordsMatch && confirmPassword.length > 0 && (
                  <div className='text-red-600 text-sm mt-1'>Passwords do not match</div>
                )}
              </div>
            </div>
            <div>
              <label htmlFor='customerType' className='block text-sm font-medium text-gray-700'>
                Customer Type
              </label>
              <div className='mt-1'>
                <select
                  id='customerType'
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value)}
                  className='appearance-none text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                >
                  <option value='persona_natural'>Persona Natural</option>
                  <option value='empresa'>Empresa</option>
                </select>
              </div>
            </div>
            <div>
              <button
                type='submit'
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm text-black font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isButtonDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-400 hover:bg-yellow-300 focus:ring-yellow-500"
                }`}
                disabled={isButtonDisabled}
              >
                Create Customer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CustomerForm
