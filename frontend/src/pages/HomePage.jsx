import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { MOODS } from '../utils/moods'
import { fetchSongs } from '../services/songService'
import MoodCard from '../components/MoodCard'
import SongCard from '../components/SongCard'
import './HomePage.css'

function HomePage() {
  const user = useSelector((state) => state.auth.user)
  const [songs, setSongs] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [errorMessage, setErrorMessage] = useState('')
  const [attempt, setAttempt] = useState(0) // "Try again" dabane par badhta hai

  useEffect(() => {
    let ignore = false // page badal jaye to purana jawab state me mat daalo

    async function load() {
      setStatus('loading')
      try {
        const res = await fetchSongs({ limit: 8 })
        if (!ignore) {
          setSongs(res.data)
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
  }, [attempt])

  const firstName = user?.name?.split(' ')[0]

  return (
    <section className="page">
      <h1>{firstName ? `Hey ${firstName}, what's your vibe?` : "What's your vibe?"}</h1>
      <p className="page-subtitle">Pick a mood and let the music match it.</p>

      <div className="home-section">
        <h2>Moods</h2>
        <div className="mood-grid">
          {MOODS.map((mood) => (
            <MoodCard key={mood.id} mood={mood} />
          ))}
        </div>
      </div>

      <div className="home-section" aria-busy={status === 'loading'}>
        <h2>Explore songs</h2>

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
            <button type="button" className="btn-secondary" onClick={() => setAttempt((n) => n + 1)}>
              Try again
            </button>
          </div>
        )}

        {status === 'ready' && songs.length === 0 && (
          <div className="state-box">
            <p>No songs found yet. Run the seed script in the backend to add songs.</p>
          </div>
        )}

        {status === 'ready' && songs.length > 0 && (
          <div className="song-grid">
            {songs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default HomePage