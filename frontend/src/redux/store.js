import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import gigsReducer from './gigsSlice'
import notificationsReducer from './notificationsSlice'

export default configureStore({
  reducer: {
    auth: authReducer,
    gigs: gigsReducer,
    notifications: notificationsReducer,
  },
})
