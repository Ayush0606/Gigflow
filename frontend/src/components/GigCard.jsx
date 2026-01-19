import React from 'react'

export default function GigCard({ gig, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-xl border border-slate-600 p-4 sm:p-6 cursor-pointer hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 active:scale-95 sm:active:scale-100"
    >
      {/* Status Badge */}
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className="flex-1"></div>
        <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold whitespace-nowrap ml-2 ${
          gig.status === 'open' 
            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/30' 
            : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-500/30'
        }`}>
          {gig.status === 'open' ? '🟢 Open' : '🔒 Assigned'}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-xl font-bold text-white group-hover:text-blue-300 transition mb-2 sm:mb-3 line-clamp-2">
        {gig.title}
      </h3>

      {/* Description */}
      <p className="text-slate-300 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
        {gig.description}
      </p>

      {/* Budget Section */}
      <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-slate-600/50 rounded-lg border border-slate-500/30">
        <p className="text-slate-400 text-xs font-semibold mb-1">Budget</p>
        <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          ${gig.budget}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-600">
        <p className="text-xs text-slate-400 truncate">
          👤 {gig.ownerId?.name}
        </p>
        <div className="text-blue-400 group-hover:text-blue-300 font-semibold text-xs sm:text-sm whitespace-nowrap ml-2">
          View →
        </div>
      </div>
    </div>
  )
}
