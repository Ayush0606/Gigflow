import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { gigsAPI, bidsAPI } from '../services/api'
import BidForm from '../components/BidForm'
import BidList from '../components/BidList'

export default function GigDetailPage() {
  const { gigId } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [gig, setGig] = useState(null)
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bidLoading, setBidLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')
        const gigRes = await gigsAPI.getAll()
        const foundGig = gigRes.data.find((g) => g._id === gigId)
        if (!foundGig) {
          setError('Gig not found')
          return
        }
        setGig(foundGig)

        // If user is the owner, fetch bids
        if (foundGig.ownerId && (foundGig.ownerId._id === user._id || foundGig.ownerId._id === user.id)) {
          const bidsRes = await bidsAPI.getByGigId(gigId)
          setBids(bidsRes.data)
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }
    
    if (user) {
      fetchData()
    }
  }, [gigId, user])

  const handleSubmitBid = async (bidData) => {
    setBidLoading(true)
    setError('')
    setSuccessMessage('')
    try {
      await bidsAPI.submit(bidData)
      setSuccessMessage('✅ Bid submitted successfully!')
      
      // Refresh bids if user is owner
      if (gig?.ownerId && (gig.ownerId._id === user._id || gig.ownerId._id === user.id)) {
        const bidsRes = await bidsAPI.getByGigId(gigId)
        setBids(bidsRes.data)
      }
      
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit bid')
    } finally {
      setBidLoading(false)
    }
  }

  const handleHire = async (bidId) => {
    if (!window.confirm('Are you sure you want to hire this freelancer?')) return
    
    setBidLoading(true)
    setError('')
    setSuccessMessage('')
    try {
      await bidsAPI.hire(bidId)
      setSuccessMessage('✅ Freelancer hired successfully!')
      
      // Refresh gig and bids
      const gigRes = await gigsAPI.getAll()
      const updatedGig = gigRes.data.find((g) => g._id === gigId)
      setGig(updatedGig)
      
      const bidsRes = await bidsAPI.getByGigId(gigId)
      setBids(bidsRes.data)
      
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to hire freelancer')
    } finally {
      setBidLoading(false)
    }
  }

  React.useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) return null
  if (loading) return <p className="text-center py-8 text-gray-500 text-sm sm:text-base">Loading gig details...</p>
  if (!gig) return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <button onClick={() => navigate('/gigs')} className="text-blue-600 hover:underline text-sm sm:text-base">← Back to Gigs</button>
        </div>
      </nav>
      <p className="text-center py-8 text-red-600 text-sm sm:text-base px-3">{error || 'Gig not found'}</p>
    </div>
  )

  const isOwner = gig?.ownerId && user && (gig.ownerId._id === user._id || gig.ownerId._id === user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-4 sm:gap-8 min-w-0 flex-1">
            <h1 className="text-xl sm:text-3xl font-bold text-blue-600 truncate">GigFlow</h1>
            {user && <p className="hidden sm:block text-lg text-gray-700">Welcome, <span className="font-semibold text-gray-900">{user.name}</span></p>}
          </div>
          <button
            onClick={() => navigate('/gigs')}
            className="bg-gray-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-gray-700 transition text-sm sm:text-base flex-shrink-0"
          >
            ← Back
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {error && <div className="bg-red-100 text-red-700 p-3 sm:p-4 rounded mb-4 text-sm">{error}</div>}
        {successMessage && <div className="bg-green-100 text-green-700 p-3 sm:p-4 rounded mb-4 text-sm">{successMessage}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* GIG DETAILS - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-4 sm:p-8">
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">{gig.title}</h1>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-lg">{gig.description}</p>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 pb-4 sm:pb-6 border-b gap-3 sm:gap-0">
                <span className="text-2xl sm:text-3xl font-bold text-green-600">${gig.budget}</span>
                <span className={`px-3 sm:px-4 py-1 sm:py-2 rounded font-semibold text-xs sm:text-sm ${
                  gig.status === 'open' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {gig.status === 'open' ? '🟢 Open' : '🔒 Assigned'}
                </span>
              </div>
              
              <p className="text-xs sm:text-sm text-gray-500">
                📌 Posted by <span className="font-semibold text-gray-700">{gig.ownerId.name}</span>
              </p>
            </div>
          </div>

          {/* BIDS SECTION - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 lg:sticky lg:top-4">
              {isOwner ? (
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">📋 Bids ({bids.length})</h3>
                  {bids.length === 0 ? (
                    <p className="text-gray-500 text-center py-4 text-sm">No bids yet. Share this gig to get bids!</p>
                  ) : (
                    <BidList 
                      bids={bids} 
                      onHire={handleHire} 
                      loading={bidLoading} 
                      isOwner={true} 
                    />
                  )}
                </div>
              ) : gig.status === 'open' ? (
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">💼 Submit Your Bid</h3>
                  <BidForm 
                    gigId={gigId} 
                    onSubmit={handleSubmitBid} 
                    loading={bidLoading} 
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-xs sm:text-sm">
                    ✅ This gig has been assigned to a freelancer
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
