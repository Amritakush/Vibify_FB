import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, clearError } from '../features/auth/authSlice'
import './AuthPages.css'

function RegisterPage() {
  const dispatch = useDispatch()
  const { user, initialized, submitting, error } = useSelector((state) => state.auth)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  if (initialized && user) return <Navigate to="/" replace />

  const fieldErrors = Object.fromEntries(
    (error?.errors ?? []).map((e) => [e.field, e.message]),
  )

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(registerUser(form))
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">Vibify</div>
        <h1>Create your account</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.name)}
            />
            {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
          </div>

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
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.password)}
            />
            {fieldErrors.password ? (
              <p className="field-error">{fieldErrors.password}</p>
            ) : (
              <p className="page-subtitle" style={{ fontSize: '0.875rem', margin: '0.35rem 0 0' }}>
                At least 8 characters
              </p>
            )}
          </div>

          {error && !error.errors && (
            <p className="form-error" role="alert">{error.message}</p>
          )}

          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage