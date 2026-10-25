import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import HomePage from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import SearchPage from './pages/SearchPage'
import LikedSongsPage from './pages/LikedSongsPage'
import PlaylistsPage from './pages/PlaylistsPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="browse" element={<BrowsePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="liked" element={<LikedSongsPage />} />
        <Route path="playlists" element={<PlaylistsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App