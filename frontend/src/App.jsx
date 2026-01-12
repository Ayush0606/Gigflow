import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import AuthPage from './pages/AuthPage'
import GigsPage from './pages/GigsPage'
import CreateGigPage from './pages/CreateGigPage'
import GigDetailPage from './pages/GigDetailPage'
import HistoryPage from './pages/HistoryPage'
import NotificationBanner from './components/NotificationBanner'
import { initSocket, closeSocket } from './services/socket'

export default function App() {
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (user) {
      const userId = user._id || user.id
      initSocket(userId)
    } else {
      closeSocket()
    }

    return () => {
      // Don't close on unmount as we want persistent connection
    }
  }, [user])

  return (
    <>
      <NotificationBanner />
      <Routes>
        <Route path="/login" element={<AuthPage isLogin={true} />} />
        <Route path="/register" element={<AuthPage isLogin={false} />} />
        <Route path="/gigs" element={<GigsPage />} />
        <Route path="/gigs/:gigId" element={<GigDetailPage />} />
        <Route path="/create-gig" element={<CreateGigPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/" element={<Navigate to="/gigs" />} />
      </Routes>
    </>
  )
}
