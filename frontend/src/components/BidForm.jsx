import React, { useState } from 'react'

export default function BidForm({ gigId, onSubmit, loading }) {
  const [message, setMessage] = useState('')
  const [price, setPrice] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    if (!message.trim()) {
      setError('Please enter a message')
      return
    }
    
    if (!price || price <= 0) {
      setError('Please enter a valid price')
      return
    }

    onSubmit({ gigId, message, price: Number(price) })
    setMessage('')
    setPrice('')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">💼 Submit Your Bid</h3>
      
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-xs sm:text-sm">{error}</div>}
      
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Tell the client why you're a good fit for this job..."
        className="w-full p-2 sm:p-3 border border-gray-300 rounded mb-3 sm:mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
        rows="4"
        required
      />
      
      <div className="mb-4">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Your Price ($)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter your bid amount"
          className="w-full p-2 sm:p-3 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          step="0.01"
          min="0"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded font-semibold text-sm sm:text-base hover:bg-blue-700 disabled:bg-gray-400 transition"
      >
        {loading ? '⏳ Submitting...' : '✅ Submit Bid'}
      </button>
    </form>
  )
}
