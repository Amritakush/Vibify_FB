import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchFacets, fetchSongs } from '../services/songService'
import { moodLabel } from '../utils/moods'
import SongCard from '../components/SongCard'
import Pagination from '../components/Pagination'
import './BrowsePage.css'

const PAGE_SIZE = 20
const MAX_ARTIST_CHIPS = 40

const TABS = [
  { key: 'mood', label: 'Moods', facet: 'moods' },
  { key: 'language', label: 'Languages', facet: 'languages' },
  { key: 'artist', label: 'Artists', facet: 'artists' },
]

function BrowsePage() {
  const [params, setParams] = useSearchParams()

  const mood = params.get('mood') ?? ''
  const language = params.get('language') ?? ''
  const artist = params.get('artist') ?? ''
  const page = Math.max(1, parseInt(params.get('page'), 10) || 1)

  // Konsa filter lag raha hai (ek samay par ek hi dikhate hain)
  const activeKey = mood ? 'mood' : language ? 'language' : artist ? 'artist' : null
  const activeValue = mood || language || artist

  const [tab, setTab] = useState(activeKey ?? 'mood')
  const [artistQuery, setArtistQuery] = useState('')

  // ---------- Chips ki list (ek baar) ----------
  const [facets, setFacets] = useState(null)
  const [facetsError, setFacetsError] = useState('')

  useEffect(() => {
    let ignore = false
    fetchFacets()
      .then((res) => {
        if (!ignore) setFacets(res.data)
      })
      .catch((err) => {
        if (!ignore) setFacetsError(err.message)
      })
    return () => {
      ignore = true
    }
  }, [])

  // ---------- Songs (filter ya page badalne par) ----------
  const [songs, setSongs] = useState([])
  const [pagination, setPagination] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [errorMessage, setErrorMessage] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let ignore = false

    async function load() {
      setStatus('loading')
      try {
        const res = await fetchSongs({
          mood,
          language,
          artist,
          page,
          limit: PAGE_SIZE,
        })
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
  }, [mood, language, artist, page, attempt])

  // ---------- Chips jo dikhane hain ----------
  const currentTab = TABS.find((t) => t.key === tab)

  const chips = useMemo(() => {
    if (!facets) return []
    const list = facets[currentTab.facet]
    if (tab === 'artist') {
      const query = artistQuery.trim().toLowerCase()
      return list
        .filter((item) => item.name.toLowerCase().includes(query))
        .slice(0, MAX_ARTIST_CHIPS)
    }
    return list
  }, [facets, tab, currentTab, artistQuery])

  const chipLabel = (name) => (tab === 'mood' ? moodLabel(name) : name)

  const isChipActive = (name) =>
    activeKey === tab && activeValue.toLowerCase() === name.toLowerCase()

  // ---------- Click handlers ----------
  const selectFilter = (name) => {
    if (isChipActive(name)) {
      setParams({}) // wahi chip dobara dabaya: filter hata do
    } else {
      setParams({ [tab]: name }) // naya filter, page 1 se
    }
  }

  const goToPage = (nextPage) => {
    const next = new URLSearchParams(params)
    if (nextPage <= 1) next.delete('page')
    else next.set('page', String(nextPage))
    setParams(next)
    window.scrollTo({ top: 0 })
  }

  // ---------- Heading ----------
  const title = activeKey
    ? activeKey === 'mood'
      ? moodLabel(activeValue)
      : activeValue
    : 'All songs'

  return (
    <section className="page">
      <h1>Browse</h1>
      <p className="page-subtitle">Explore by mood, language and artist.</p>

      <div className="tabs" role="group" aria-label="Browse by">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className="tab-btn"
            aria-pressed={tab === t.key}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'artist' && (
        <input
          type="search"
          className="artist-search"
          placeholder="Search artists..."
          aria-label="Search artists"
          value={artistQuery}
          onChange={(e) => setArtistQuery(e.target.value)}
        />
      )}

      {facetsError && (
        <div className="state-box error" role="alert" style={{ marginTop: 'var(--space-2)' }}>
          Could not load filters: {facetsError}
        </div>
      )}

      {facets && (
        <div className="chips">
          {chips.map((item) => (
            <button
              key={item.name}
              type="button"
              className="chip"
              aria-pressed={isChipActive(item.name)}
              onClick={() => selectFilter(item.name)}
            >
              {chipLabel(item.name)}
              <span className="chip-count">{item.count}</span>
            </button>
          ))}
          {tab === 'artist' && chips.length === 0 && (
            <p className="page-subtitle">No artists match your search.</p>
          )}
        </div>
      )}

      <div className="browse-header">
        <h2>{title}</h2>
        {pagination && status === 'ready' && (
          <span className="browse-count">
            {pagination.total} {pagination.total === 1 ? 'song' : 'songs'}
          </span>
        )}
        {activeKey && (
          <button type="button" className="link-btn" onClick={() => setParams({})}>
            Clear filter
          </button>
        )}
      </div>

      <div aria-busy={status === 'loading'}>
        {status === 'loading' && (
          <div className="song-grid" aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="skeleton" />
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className="state-box error" role="alert">
            <p>Could not load songs: {errorMessage}</p>
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
            <p>No songs found here.</p>
            {page > 1 && (
              <button type="button" className="btn-secondary" onClick={() => goToPage(1)}>
                Back to first page
              </button>
            )}
          </div>
        )}

        {status === 'ready' && songs.length > 0 && (
          <div className="song-grid">
            {songs.map((song, index) => (
              <SongCard key={song.id} song={song} queue={songs} index={index} />
            ))}
          </div>
        )}
      </div>

      {pagination && status === 'ready' && (
        <Pagination page={page} totalPages={pagination.totalPages} onChange={goToPage} />
      )}
    </section>
  )
}

export default BrowsePage