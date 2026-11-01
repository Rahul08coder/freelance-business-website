// Backend se baat karne ka ek hi jagah. Saari fetch calls yahin se jayengi.

// Dev mein default localhost. Production mein VITE_API_URL zaroor set karna hoga.
const API_URL = (
  import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '')
).replace(/\/$/, '')

// 30 second: hosting ka free server so jata hai, pehli request dheere aati hai
const REQUEST_TIMEOUT_MS = 30000

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// GET request. Success par server ka "data" wapas deta hai, galti par ApiError throw karta hai.
export async function apiGet(path, { signal } = {}) {
  if (!API_URL) {
    throw new ApiError('The API address is not configured.')
  }

  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS)
  const combinedSignal = signal ? AbortSignal.any([signal, timeout]) : timeout

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include', // admin cookie ke liye (Day 18)
      signal: combinedSignal,
    })
  } catch (error) {
    // Hamne khud cancel kiya (page chhod diya): upar wale ko batao, error mat dikhao
    if (signal?.aborted) throw error
    if (error.name === 'TimeoutError') {
      throw new ApiError('The server took too long to respond. Please try again.')
    }
    throw new ApiError('Could not reach the server. Please check your connection and try again.')
  }

  let body = null
  try {
    body = await response.json()
  } catch {
    // JSON nahi aaya
  }

  if (!response.ok || !body?.success) {
    throw new ApiError(body?.error?.message || 'Something went wrong. Please try again.', response.status)
  }

  return body.data
}