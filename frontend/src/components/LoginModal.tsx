"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useState, FormEvent, useEffect as useReactEffect } from "react"

interface LoginModalProps {
  closeModal: () => void
  onLoginSuccess: (email: string) => void
}

const LoginModal: React.FC<LoginModalProps> = ({ closeModal, onLoginSuccess }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [isEmailValid, setIsEmailValid] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    setIsEmailValid(email === "" || emailValid)
    setIsButtonDisabled(!(email && password && isEmailValid))
  }, [email, password, isEmailValid])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!isEmailValid) {
      setError("Invalid email address")
      return
    }

    try {
      const response = await fetch("http://localhost:5000/api/customers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const { token } = await response.json()
        localStorage.setItem("token", token)
        localStorage.setItem("userEmail", email)
        onLoginSuccess(email)
        router.push("/dashboard")
      } else {
        const data = await response.json()
        setError(data.message || "Login failed")
      }
    } catch (error) {
      setError("Invalid email or password")
    }
  }

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-60 flex justify-end items-start pt-20 pr-4'
      onClick={handleOutsideClick}
    >
      <div className='bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative'>
        <button
          onClick={closeModal}
          className='absolute top-1 right-2 text-gray-600 hover:text-gray-800 text-2xl p-1'
        >
          &times;
        </button>
        <h2 className='text-2xl font-bold mb-4 text-black'>Log in to your account</h2>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
              Email address
            </label>
            <input
              id='email'
              name='email'
              type='email'
              autoComplete='email'
              required
              className='mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {!isEmailValid && email !== "" && (
              <div className='text-red-600 text-sm mt-1'>Invalid email address</div>
            )}
          </div>
          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
              Password
            </label>
            <input
              id='password'
              name='password'
              type='password'
              autoComplete='current-password'
              required
              className='mt-1 block w-full text-black px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className='text-red-600 text-sm'>{error}</div>}
          <button
            type='submit'
            className={`w-full text-black flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold ${
              isButtonDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-300 focus:ring-yellow-500"
            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
            disabled={isButtonDisabled}
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginModal
