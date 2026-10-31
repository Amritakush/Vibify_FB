import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { fetchSongs } from '../services/songService'
import SongCard from '../components/SongCard'
import Pagination from '../components/Pagination'
import './SearchPage.css'

const PAGE_SIZE = 20
const DEBOUNCE_MS = 350

function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q = (params.get('q') ?? '').trim()
  const page = Math.max(1, parseInt(params.get('page'), 10) || 1)

  // Input me jo likha hai (URL se thoda aage chalta hai, debounce ki wajah se)
  const [text, setText] = useState(params.get('q') ?? '')

  // Typing rukne ke 350ms baad URL badlo
  useEffect(() => {
    const timer = setTimeout(() => {
      const next = text.trim()
      if (next === q) return
      setParams(next ? { q: next } : {}, { replace: true })
    }, DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [text, q, setParams])

  // Back/Forward se URL badle to input bhi badal jaye
  useEffect(() => {
    setText((current) => (current.trim() === q ? current : q))
  }, [q])

  const [songs, setSongs] = useState([])
  const [pagination, setPagination] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [errorMessage, setErrorMessage] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!q) {
      setStatus('idle')
      setSongs([])
      setPagination(null)
      return
    }

    let ignore = false

    async function load() {
      setStatus('loading')
      try {
        const res = await fetchSongs({ q, page, limit: PAGE_SIZE })
        if (!ignore) {
          setSongs(res.data)
          setPagination(res.pagination)
          setStatus('ready')
        }
      } catch (err) {
        if (!ignore) {
          setErrorMessage(err.message)
          setStatus('error')
        }
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [q, page, attempt])

  const goToPage = (nextPage) => {
    const next = new URLSearchParams(params)
    if (nextPage <= 1) next.delete('page')
    else next.set('page', String(nextPage))
    setParams(next)
    window.scrollTo({ top: 0 })
  }

  return (
    <section className="page">
      <h1>Search</h1>
      <p className="page-subtitle">Find songs by title or artist.</p>

      <div className="search-box">
        <Search className="search-icon" size={20} aria-hidden="true" />
        <input
          type="search"
          className="search-input"
          placeholder="Search songs or artists..."
          aria-label="Search songs or artists"
          maxLength={100}
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="home-section" aria-busy={status === 'loading'}>
        {status === 'idle' && (
          <div className="state-box">
            <p>Type a song title or an artist name to start searching.</p>
          </div>
        )}

        {status === 'loading' && (
          <div className="song-grid" aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="skeleton" />
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className="state-box error" role="alert">
            <p>Search failed: {errorMessage}</p>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setAttempt((n) => n + 1)}
            >
              Try again
            </button>
          </div>
        )}

        {status === 'ready' && songs.length === 0 && (
          <div className="state-box">
            <p>No results for “{q}”. Try a different title or artist.</p>
            {page > 1 && (
              <button type="button" className="btn-secondary" onClick={() => goToPage(1)}>
                Back to first page
              </button>
            )}
          </div>
        )}

        {status === 'ready' && songs.length > 0 && (
          <>
            <p className="page-subtitle" role="status">
              {pagination.total} {pagination.total === 1 ? 'result' : 'results'} for “{q}”
            </p>
            <div className="song-grid">
              {songs.map((song, index) => (
                <SongCard key={song.id} song={song} queue={songs} index={index} />
              ))}
            </div>
          </>
        )}
      </div>

      {pagination && status === 'ready' && (
        <Pagination page={page} totalPages={pagination.totalPages} onChange={goToPage} />
      )}
    </section>
  )
}

export default SearchPage