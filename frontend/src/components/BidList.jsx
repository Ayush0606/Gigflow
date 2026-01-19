import React from 'react'

export default function BidList({ bids, onHire, loading, isOwner }) {
  if (!bids || bids.length === 0) {
    return <p className="text-gray-500 text-center py-8 text-xs sm:text-sm">No bids yet.</p>
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {bids.map((bid) => (
        <div 
          key={bid._id} 
          className={`rounded-lg p-3 sm:p-4 border-l-4 ${
            bid.status === 'hired' 
              ? 'bg-green-50 border-green-500' 
              : bid.status === 'rejected'
              ? 'bg-red-50 border-red-500'
              : 'bg-white border-blue-500'
          }`}
        >
          <div className="flex justify-between items-start mb-2 gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{bid.freelancerId?.name || 'Unknown'}</p>
              <p className="text-gray-600 text-xs mt-1 line-clamp-2">{bid.message}</p>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
              bid.status === 'hired' 
                ? 'bg-green-200 text-green-800' 
                : bid.status === 'rejected'
                ? 'bg-red-200 text-red-800'
                : 'bg-yellow-200 text-yellow-800'
            }`}>
              {bid.status === 'pending' ? '⏳ Pending' : 
               bid.status === 'hired' ? '✅ Hired' : 
               '❌ Rejected'}
            </span>
          </div>
          
          <div className="flex justify-between items-center mt-3 gap-2">
            <p className="text-base sm:text-lg font-bold text-green-600">${bid.price}</p>
            
            {isOwner && bid.status === 'pending' && (
              <button
                onClick={() => onHire(bid._id)}
                disabled={loading}
                className="bg-green-600 text-white px-2 sm:px-3 py-1 rounded text-xs hover:bg-green-700 disabled:bg-gray-400 transition font-semibold flex-shrink-0"
              >
                {loading ? '⏳' : '✅ Hire'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
