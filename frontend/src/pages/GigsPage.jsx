import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setGigs, setLoading, setError } from '../redux/gigsSlice'
import { logout } from '../redux/authSlice'
import { gigsAPI } from '../services/api'
import GigCard from '../components/GigCard'
import NotificationBell from '../components/NotificationBell'

export default function GigsPage() {
  const { gigs, loading } = useSelector((state) => state.gigs)
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  useEffect(() => {
    const fetchGigs = async () => {
      dispatch(setLoading(true))
      try {
        const res = await gigsAPI.getAll(search)
        dispatch(setGigs(res.data))
      } catch (err) {
        dispatch(setError(err.message))
      } finally {
        dispatch(setLoading(false))
      }
    }
    const timer = setTimeout(fetchGigs, 300)
    return () => clearTimeout(timer)
  }, [search, dispatch])

  if (!user) return null

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-slate-800 to-slate-900 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-5">
          {/* Mobile Layout */}
          <div className="flex md:hidden justify-between items-center gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm sm:text-lg">⚡</span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent truncate">GigFlow</h1>
            </div>
            <div className="flex gap-1 sm:gap-2 items-center">
              <NotificationBell />
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-slate-700 rounded-lg transition-all duration-200"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-slate-700 pt-4 space-y-2">
              {user && (
                <div className="px-4 py-2 bg-slate-700/50 rounded-lg mb-3">
                  <p className="text-xs text-slate-400">Logged in as</p>
                  <p className="text-sm font-semibold text-white">👤 {user.name}</p>
                </div>
              )}
              <button
                onClick={() => {
                  navigate('/create-gig')
                  setMobileMenuOpen(false)
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200"
              >
                ✨ Post Gig
              </button>
              <button
                onClick={() => {
                  navigate('/history')
                  setMobileMenuOpen(false)
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-200"
              >
                📋 History
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          )}

          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center">
            <div className="flex items-center gap-12">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">⚡</span>
                </div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">GigFlow</h1>
              </div>
              {user && (
                <p className="text-sm text-slate-300">
                  👤 <span className="font-semibold text-white">{user.name}</span>
                </p>
              )}
            </div>
            <div className="flex gap-3 items-center">
              <NotificationBell />
              <button
                onClick={() => navigate('/create-gig')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-200"
              >
                ✨ Post Gig
              </button>
              <button
                onClick={() => navigate('/history')}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-200"
              >
                📋 History
              </button>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transform hover:scale-105 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Search */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 py-6 sm:py-12 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-3 sm:px-6">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">Find Your Perfect Gig</h2>
          <p className="text-sm sm:text-base text-slate-400 mb-4 sm:mb-8">Browse amazing freelance opportunities</p>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search gigs..."
              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Gigs Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <div className="animate-spin mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-slate-600 border-t-blue-400 rounded-full"></div>
            </div>
            <p className="text-slate-400 font-semibold text-sm sm:text-base">Loading amazing gigs...</p>
          </div>
        )}

        {!loading && gigs.length > 0 && (
          <>
            <h3 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-8">Available Gigs ({gigs.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {gigs.map((gig) => (
                <GigCard
                  key={gig._id}
                  gig={gig}
                  onClick={() => navigate(`/gigs/${gig._id}`)}
                />
              ))}
            </div>
          </>
        )}

        {!loading && gigs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center">
            <div className="text-4xl sm:text-6xl mb-4">🔍</div>
            <p className="text-base sm:text-xl text-slate-400 font-semibold">No gigs found</p>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  )
}
