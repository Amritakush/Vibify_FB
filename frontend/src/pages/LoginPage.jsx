import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, clearError } from '../features/auth/authSlice'
import './AuthPages.css'

function LoginPage() {
  const dispatch = useDispatch()
  const { user, initialized, submitting, error } = useSelector((state) => state.auth)
  const [form, setForm] = useState({ email: '', password: '' })

  // Page khulte hi purana error hata do
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  // Pehle se login hai to Home bhej do
  if (initialized && user) return <Navigate to="/" replace />

  const fieldErrors = Object.fromEntries(
    (error?.errors ?? []).map((e) => [e.field, e.message]),
  )

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser(form))
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">Vibify</div>
        <h1>Welcome back</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.email)}
            />
            {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.password)}
            />
            {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
          </div>

          {error && !error.errors && (
            <p className="form-error" role="alert">{error.message}</p>
          )}

          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="auth-switch">
          New to Vibify? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage