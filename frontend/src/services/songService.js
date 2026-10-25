import { api } from './api'

// params: { mood, language, q, page, limit }. Khaali values chhod di jaati hain.
export function fetchSongs(params = {}) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') query.set(key, value)
  }
  const qs = query.toString()
  return api(`/songs${qs ? `?${qs}` : ''}`)
}