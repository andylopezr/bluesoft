import React from "react"

interface ModalProps {
  show: boolean
  message: string
  onClose: () => void
}

const AccountCreationModal: React.FC<ModalProps> = ({ show, message, onClose }) => {
  if (!show) return null

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center'>
      <div className='bg-white p-4 rounded-lg shadow-lg justify-center items-center'>
        <p className='text-black'>{message}</p>
        <button
          onClick={onClose}
          className='mt-4 bg-yellow-400 text-black font-bold px-4 py-2 rounded-md shadow-sm hover:bg-yellow-300'
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default AccountCreationModal
