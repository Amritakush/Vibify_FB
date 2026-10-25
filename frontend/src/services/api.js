// Backend ko call karne ka ek hi tareeka. Cookie bhejne ke liye credentials: "include".
export class ApiError extends Error {
  constructor(status, message, errors) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

export async function api(path, { method = 'GET', body } = {}) {
  let response
  try {
    response = await fetch(`/api${path}`, {
      method,
      credentials: 'include',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Please check your connection.')
  }

  // Server kabhi JSON ke bina bhi jawab de sakta hai (jaise crash par)
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.message || 'Something went wrong',
      data?.errors,
    )
  }
  return data
}