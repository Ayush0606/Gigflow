import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { gigsAPI, bidsAPI } from '../services/api'

export default function HistoryPage() {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [gigs, setGigs] = useState([])
  const [gigsWithBids, setGigsWithBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)
        setError('')
        // Get user ID (could be _id or id)
        const userId = user._id || user.id
        if (!userId) {
          setError('User not authenticated')
          setLoading(false)
          return
        }
        
        // Fetch all gigs posted by current user
        const gigsRes = await gigsAPI.getUserHistory(userId)
        setGigs(gigsRes.data)

        // For each gig, find hired bids
        const gigsWithHiredData = await Promise.all(
          gigsRes.data.map(async (gig) => {
            try {
              const bidsRes = await bidsAPI.getByGigId(gig._id)
              const hiredBid = bidsRes.data.find((b) => b.status === 'hired')
              return {
                ...gig,
                hiredBid: hiredBid || null,
              }
            } catch {
              return { ...gig, hiredBid: null }
            }
          })
        )
        setGigsWithBids(gigsWithHiredData)
      } catch (err) {
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchHistory()
    }
  }, [user, navigate])

  React.useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-4 sm:gap-8 min-w-0 flex-1">
            <h1 className="text-xl sm:text-3xl font-bold text-blue-600 truncate">GigFlow</h1>
            {user && <p className="hidden sm:block text-lg text-gray-700">Welcome, <span className="font-semibold text-gray-900">{user.name}</span></p>}
          </div>
          <div className="flex gap-2 sm:gap-4 flex-shrink-0">
            <button
              onClick={() => navigate('/gigs')}
              className="bg-gray-600 text-white px-2 sm:px-4 py-2 rounded hover:bg-gray-700 transition text-xs sm:text-base"
            >
              Browse
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-red-600 text-white px-2 sm:px-4 py-2 rounded hover:bg-red-700 transition text-xs sm:text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">📋 Your Gig History</h2>
          <p className="text-gray-600 text-sm sm:text-base">Posted gigs and hired candidates</p>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 sm:p-4 rounded mb-4 text-sm">{error}</div>}
        {loading && <p className="text-center py-8 text-gray-500 text-sm">Loading history...</p>}

        {!loading && gigsWithBids.length === 0 && (
          <div className="bg-white rounded-lg shadow p-6 sm:p-8 text-center">
            <p className="text-gray-500 text-base sm:text-lg mb-4">No gigs posted yet</p>
            <button
              onClick={() => navigate('/create-gig')}
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded hover:bg-blue-700 transition text-sm sm:text-base"
            >
              Post Your First Gig
            </button>
          </div>
        )}

        {!loading && gigsWithBids.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {gigsWithBids.map((gig) => (
              <div key={gig._id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                <div className="p-4 sm:p-6">
                  {/* Gig Header */}
                  <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{gig.title}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2">{gig.description}</p>
                    </div>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex-shrink-0 ${
                      gig.status === 'open' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {gig.status === 'open' ? '🟢 Open' : '🔒 Assigned'}
                    </span>
                  </div>

                  {/* Budget */}
                  <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b">
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">${gig.budget}</p>
                  </div>

                  {/* Hired Candidate Section */}
                  {gig.hiredBid ? (
                    <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-200 mb-3 sm:mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">✅ Hired Candidate</h4>
                      <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                        <p className="text-gray-700">
                          <span className="font-semibold">Name:</span> {gig.hiredBid.freelancerId.name}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Email:</span> <span className="break-all">{gig.hiredBid.freelancerId.email}</span>
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Price:</span> ${gig.hiredBid.price}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Message:</span> 
                          <br/>
                          <span className="text-gray-600 italic line-clamp-2">{gig.hiredBid.message}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Hired: {new Date(gig.hiredBid.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 border border-yellow-200 mb-3 sm:mb-4">
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm">⏳ No Candidate Hired Yet</h4>
                      <p className="text-gray-600 text-xs">Share this gig to receive bids</p>
                    </div>
                  )}

                  {/* View Gig Button */}
                  <button
                    onClick={() => navigate(`/gigs/${gig._id}`)}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold text-sm sm:text-base"
                  >
                    View Gig Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
