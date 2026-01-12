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
  }, [user])

  if (!user) return navigate('/login')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-3xl font-bold text-blue-600">GigFlow</h1>
            {user && <p className="text-lg text-gray-700">Welcome, <span className="font-semibold text-gray-900">{user.name}</span></p>}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/gigs')}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              Browse Gigs
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">📋 Your Gig History</h2>
          <p className="text-gray-600">Posted gigs and hired candidates</p>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}
        {loading && <p className="text-center py-8 text-gray-500">Loading history...</p>}

        {!loading && gigsWithBids.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">No gigs posted yet</p>
            <button
              onClick={() => navigate('/create-gig')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Post Your First Gig
            </button>
          </div>
        )}

        {!loading && gigsWithBids.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gigsWithBids.map((gig) => (
              <div key={gig._id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                <div className="p-6">
                  {/* Gig Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{gig.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{gig.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      gig.status === 'open' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {gig.status === 'open' ? '🟢 Open' : '🔒 Assigned'}
                    </span>
                  </div>

                  {/* Budget */}
                  <div className="mb-4 pb-4 border-b">
                    <p className="text-3xl font-bold text-blue-600">${gig.budget}</p>
                  </div>

                  {/* Hired Candidate Section */}
                  {gig.hiredBid ? (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h4 className="font-semibold text-gray-900 mb-3">✅ Hired Candidate</h4>
                      <div className="space-y-2">
                        <p className="text-gray-700">
                          <span className="font-semibold">Name:</span> {gig.hiredBid.freelancerId.name}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Email:</span> {gig.hiredBid.freelancerId.email}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Proposed Price:</span> ${gig.hiredBid.price}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Message:</span> 
                          <br/>
                          <span className="text-gray-600 italic">{gig.hiredBid.message}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Hired on: {new Date(gig.hiredBid.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <h4 className="font-semibold text-gray-900 mb-2">⏳ No Candidate Hired Yet</h4>
                      <p className="text-gray-600 text-sm">Share this gig to receive bids from freelancers</p>
                    </div>
                  )}

                  {/* View Gig Button */}
                  <button
                    onClick={() => navigate(`/gigs/${gig._id}`)}
                    className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
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
