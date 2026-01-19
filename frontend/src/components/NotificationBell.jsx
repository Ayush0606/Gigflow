import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { markAsRead, removeNotification } from '../redux/notificationsSlice'

export default function NotificationBell() {
  const { items, unreadCount } = useSelector((state) => state.notifications)
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id))
  }

  const handleRemove = (id) => {
    dispatch(removeNotification(id))
  }

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full transition"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        
        {/* Badge with count */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl z-50 border border-gray-200 max-h-[70vh] flex flex-col">
          <div className="p-3 sm:p-4 border-b border-gray-200 flex-shrink-0">
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Notifications</h3>
          </div>

          {items.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No notifications yet
            </div>
          ) : (
            <div className="overflow-y-auto flex-1">
              {items.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                        {notification.message}
                      </h4>
                      {notification.gigBudget && (
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          Budget: <span className="font-semibold">${notification.gigBudget}</span>
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.id).toLocaleTimeString()}
                      </p>
                    </div>
                    
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(notification.id)
                    }}
                    className="text-xs text-red-500 hover:text-red-700 mt-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {items.length > 0 && (
            <div className="p-3 sm:p-4 border-t border-gray-200 text-center flex-shrink-0">
              <button
                onClick={() => {
                  dispatch(clearNotifications())
                  setIsOpen(false)
                }}
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
