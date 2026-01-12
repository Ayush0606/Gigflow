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

  if (!user) return navigate('/login')

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-slate-800 to-slate-900 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
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
      </nav>

      {/* Hero Section with Search */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 py-12 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white mb-2">Find Your Perfect Gig</h2>
          <p className="text-slate-400 mb-8">Browse amazing freelance opportunities</p>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search gigs by title..."
              className="w-full px-6 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Gigs Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin mb-4">
              <div className="w-16 h-16 border-4 border-slate-600 border-t-blue-400 rounded-full"></div>
            </div>
            <p className="text-slate-400 font-semibold">Loading amazing gigs...</p>
          </div>
        )}

        {!loading && gigs.length > 0 && (
          <>
            <h3 className="text-2xl font-bold text-white mb-8">Available Gigs ({gigs.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-slate-400 font-semibold">No gigs found</p>
            <p className="text-slate-500 mt-2">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  )
}
