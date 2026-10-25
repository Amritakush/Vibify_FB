import { useEffect, useState } from 'react'
import { api } from './services/api'

function App() {
  const [status, setStatus] = useState('loading')
  const [totalSongs, setTotalSongs] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function check() {
      try {
        const health = await api('/health')
        const songs = await api('/songs?limit=1')
        setStatus(health.status)
        setTotalSongs(songs.pagination.total)
      } catch (err) {
        setStatus('error')
        setError(err.message)
      }
    }
    check()
  }, [])

  return (
    <main style={{ maxWidth: 480, margin: '4rem auto', padding: '0 1rem' }}>
      <h1>Vibify</h1>
      <p style={{ color: 'var(--text-muted)' }}>Frontend and backend connection test</p>

      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: 'var(--space-3)',
        }}
      >
        {status === 'loading' && <p>Checking backend...</p>}
        {status === 'ok' && (
          <>
            <p>Backend: <strong style={{ color: 'var(--success)' }}>ok</strong></p>
            <p>Songs in database: <strong style={{ color: 'var(--accent)' }}>{totalSongs}</strong></p>
          </>
        )}
        {status === 'error' && (
          <p style={{ color: 'var(--danger)' }}>Error: {error}</p>
        )}
      </div>
    </main>
  )
}

export default App