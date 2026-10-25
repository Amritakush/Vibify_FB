import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchCurrentUser } from './features/auth/authSlice'
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import SearchPage from './pages/SearchPage'
import LikedSongsPage from './pages/LikedSongsPage'
import PlaylistsPage from './pages/PlaylistsPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  const dispatch = useDispatch()

  // App khulte hi pata karo ki cookie wala user kaun hai
  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [dispatch])

  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />

      <Route element={<AppLayout />}>
        {/* Sabke liye khule pages */}
        <Route index element={<HomePage />} />
        <Route path="browse" element={<BrowsePage />} />
        <Route path="search" element={<SearchPage />} />

        {/* Sirf login wale users ke liye */}
        <Route element={<ProtectedRoute />}>
          <Route path="liked" element={<LikedSongsPage />} />
          <Route path="playlists" element={<PlaylistsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App