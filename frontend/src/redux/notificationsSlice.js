import { createSlice } from '@reduxjs/toolkit'

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [], // Array of notifications
    unreadCount: 0
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift({
        id: Date.now(),
        ...action.payload,
        read: false
      })
      state.unreadCount += 1
    },
    markAsRead: (state, action) => {
      const notification = state.items.find(n => n.id === action.payload)
      if (notification && !notification.read) {
        notification.read = true
        state.unreadCount -= 1
      }
    },
    clearNotifications: (state) => {
      state.items = []
      state.unreadCount = 0
    },
    removeNotification: (state, action) => {
      const index = state.items.findIndex(n => n.id === action.payload)
      if (index !== -1) {
        if (!state.items[index].read) {
          state.unreadCount -= 1
        }
        state.items.splice(index, 1)
      }
    }
  }
})

export const { addNotification, markAsRead, clearNotifications, removeNotification } = notificationsSlice.actions
export default notificationsSlice.reducer
