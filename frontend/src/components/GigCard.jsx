import React from 'react'

export default function GigCard({ gig, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-xl border border-slate-600 p-6 cursor-pointer hover:shadow-2xl hover:shadow-blue-500/30 transform hover:scale-105 transition-all duration-300"
    >
      {/* Status Badge */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1"></div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ml-2 ${
          gig.status === 'open' 
            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/30' 
            : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-500/30'
        }`}>
          {gig.status === 'open' ? '🟢 Open' : '🔒 Assigned'}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition mb-3 line-clamp-2">
        {gig.title}
      </h3>

      {/* Description */}
      <p className="text-slate-300 text-sm mb-4 line-clamp-2 leading-relaxed">
        {gig.description}
      </p>

      {/* Budget Section */}
      <div className="mb-4 p-3 bg-slate-600/50 rounded-lg border border-slate-500/30">
        <p className="text-slate-400 text-xs font-semibold mb-1">Budget</p>
        <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          ${gig.budget}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-600">
        <p className="text-xs text-slate-400">
          👤 {gig.ownerId?.name}
        </p>
        <div className="text-blue-400 group-hover:text-blue-300 font-semibold text-sm">
          View Details →
        </div>
      </div>
    </div>
  )
}
