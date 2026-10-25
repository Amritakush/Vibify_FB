import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../features/auth/authSlice'

function HomePage() {
  const dispatch = useDispatch()
  const { user, initialized } = useSelector((state) => state.auth)

  return (
    <section className="page">
      <h1>Home</h1>
      <p className="page-subtitle">Your vibes, your tunes. Mood-based picks will appear here.</p>

      {!initialized && <p>Checking your session...</p>}

      {initialized && user && (
        <p>
          Logged in as <strong>{user.name}</strong> ({user.email}){' '}
          <button type="button" onClick={() => dispatch(logoutUser())}>
            Log out
          </button>
        </p>
      )}

      {initialized && !user && (
        <p>
          <Link to="/login">Log in</Link> or <Link to="/register">create an account</Link>
        </p>
      )}
    </section>
  )
}

export default HomePage