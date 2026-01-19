import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addGig } from '../redux/gigsSlice'
import { gigsAPI } from '../services/api'

export default function CreateGigPage() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  React.useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !description.trim() || !budget) {
      setError('All fields are required')
      return
    }

    setLoading(true)
    setError('')
    try {
      const res = await gigsAPI.create({ title, description, budget: Number(budget) })
      dispatch(addGig(res.data))
      navigate('/gigs')
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-slate-800 to-slate-900 backdrop-blur-md border-b border-slate-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-5 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-12 min-w-0 flex-1">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm sm:text-lg">⚡</span>
              </div>
              <h1 className="text-lg sm:text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent truncate">GigFlow</h1>
            </div>
            {user && (
              <p className="hidden sm:block text-sm text-slate-300">
                👤 <span className="font-semibold text-white">{user.name}</span>
              </p>
            )}
          </div>
          <button
            onClick={() => navigate('/gigs')}
            className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg font-semibold text-sm sm:text-base hover:scale-105 transition-all flex-shrink-0"
          >
            ← Back
          </button>
        </div>
      </nav>

      {/* Form Container */}
      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-4 sm:p-8">
          
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">✨ Post a New Gig</h2>
            <p className="text-slate-400 text-sm sm:text-base">Share your project and find amazing freelancers</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 flex items-center gap-2 text-sm">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-200 mb-2 sm:mb-3">Project Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Build a React App"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-200 mb-2 sm:mb-3">Project Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project, requirements, and expectations in detail..."
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                rows="5"
                required
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-200 mb-2 sm:mb-3">Budget ($)</label>
              <div className="relative">
                <span className="absolute left-3 sm:left-4 top-2 sm:top-3 text-slate-400 text-lg">💰</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="0"
                  className="w-full pl-10 px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-200 mt-6 sm:mt-8 text-sm sm:text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Gig...
                </span>
              ) : '🚀 Post Gig'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
