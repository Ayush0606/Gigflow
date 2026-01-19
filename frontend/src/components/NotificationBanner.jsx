import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { onHired } from '../services/socket'
import { addNotification } from '../redux/notificationsSlice'

export default function NotificationBanner() {
  const [banner, setBanner] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const handleHired = (data) => {
      console.log('🎉 NotificationBanner received:', data)
      
      // Add to Redux notifications store
      dispatch(addNotification(data))
      
      // Show banner
      setBanner(data)
      console.log('✅ Banner state updated:', data)
      
      // Auto-hide banner after 6 seconds
      const timer = setTimeout(() => {
        console.log('⏱️ Auto-hiding banner')
        setBanner(null)
      }, 6000)

      return () => clearTimeout(timer)
    }

    console.log('🔔 Setting up hired notification listener...')
    onHired(handleHired)

    return () => {
      onHired(null)
    }
  }, [dispatch])

  return (
    <>
      {banner && (
        <div className="fixed top-20 sm:top-24 right-2 sm:right-4 z-[9999] animate-bounce p-2 sm:p-0">
          <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-4 sm:p-6 rounded-lg shadow-2xl max-w-xs sm:max-w-md border-2 border-green-300">
            <div className="flex items-start gap-3 sm:gap-4">
              <span className="text-2xl sm:text-4xl flex-shrink-0">🎉</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm sm:text-lg mb-1 truncate">{banner.message}</h3>
                <p className="text-xs sm:text-sm mb-2 text-green-50">
                  Budget: <span className="font-semibold text-green-100">${banner.gigBudget}</span>
                </p>
                <p className="text-xs text-green-100 opacity-75">
                  ✅ Check notifications for details
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
