import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getSocket } from '../services/socket'
import { addNotification } from '../redux/notificationsSlice'

export default function NotificationBanner() {
  const [banner, setBanner] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const socket = getSocket()
    if (!socket) {
      console.log('❌ Socket not available in NotificationBanner')
      return
    }

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

    console.log('🔔 Listening for hired event...')
    socket.on('hired', handleHired)

    return () => {
      socket.off('hired', handleHired)
    }
  }, [dispatch])

  return (
    <>
      {banner && (
        <div className="fixed top-24 right-4 z-[9999] animate-bounce">
          <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-lg shadow-2xl max-w-md border-2 border-green-300">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🎉</span>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{banner.message}</h3>
                <p className="text-sm mb-2 text-green-50">
                  Budget: <span className="font-semibold text-green-100">${banner.gigBudget}</span>
                </p>
                <p className="text-xs text-green-100 opacity-75">
                  ✅ Check your notifications for details
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
