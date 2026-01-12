import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setUser, setLoading, setError } from '../redux/authSlice'
import { authAPI } from '../services/api'

export default function AuthPage({ isLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoadingLocal] = useState(false)
  const [error, setErrorLocal] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoadingLocal(true)
    setErrorLocal('')
    try {
      const payload = isLogin ? { email, password } : { name, email, password }
      const res = await (isLogin ? authAPI.login(payload) : authAPI.register(payload))
      dispatch(setUser(res.data))
      navigate('/gigs')
    } catch (err) {
      setErrorLocal(err.response?.data?.message || 'An error occurred')
    } finally {
      setLoadingLocal(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Card */}
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-8 max-w-md w-full backdrop-blur-xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl mb-4 shadow-lg shadow-blue-500/50">
            <span className="text-white text-2xl">⚡</span>
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">GigFlow</h1>
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? '🔓 Welcome Back' : '✨ Create Account'}
          </h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-slate-300 text-sm font-semibold mb-2 block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="text-slate-300 text-sm font-semibold mb-2 block">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm font-semibold mb-2 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </span>
            ) : isLogin ? '🔓 Login' : '✨ Create Account'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-8 pt-8 border-t border-slate-700">
          <p className="text-slate-400 text-sm">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <a
              href={isLogin ? '/register' : '/login'}
              className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
            >
              {isLogin ? 'Create one' : 'Sign in'}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
