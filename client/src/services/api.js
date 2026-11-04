// Backend se baat karne ka ek hi jagah. Saari fetch calls yahin se jayengi.

// Dev mein default localhost. Production mein VITE_API_URL zaroor set karna hoga.
const API_URL = (
  import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '')
).replace(/\/$/, '')

// 30 second: hosting ka free server so jata hai, pehli request dheere aati hai
const REQUEST_TIMEOUT_MS = 30000

// CSRF token sirf memory mein (is variable mein). localStorage ya cookie mein kabhi nahi.
let csrfToken = null

export function setCsrfToken(token) {
  csrfToken = token || null
}

// Admin request par 401 aaye (session khatam) toh AuthProvider ko batane ke liye
let unauthorizedHandler = null

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

export class ApiError extends Error {
  // details: server ke validation errors ki list, jaise [{ field: 'email', message: '...' }]
  constructor(message, status = 0, details = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

async function request(path, { method = 'GET', body, signal } = {}) {
  if (!API_URL) {
    throw new ApiError('The API address is not configured.')
  }

  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS)
  const combinedSignal = signal ? AbortSignal.any([signal, timeout]) : timeout

  const headers = { Accept: 'application/json' }
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  // Badlaav wali requests (POST, PATCH, DELETE) ke saath CSRF token zaroori hai
  if (method !== 'GET' && csrfToken) {
    headers['X-CSRF-Token'] = csrfToken
  }

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      credentials: 'include', // admin cookie ke liye
      body: body !== undefined ? JSON.stringify(body) : undefined,
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

  let payload = null
  try {
    payload = await response.json()
  } catch {
    // JSON nahi aaya
  }

  if (!response.ok || !payload?.success) {
    // Admin session khatam ho gaya (login wali request ko chhodkar)
    if (
      response.status === 401 &&
      path.startsWith('/admin') &&
      !path.startsWith('/admin/login') &&
      unauthorizedHandler
    ) {
      unauthorizedHandler()
    }

    throw new ApiError(
      payload?.error?.message || 'Something went wrong. Please try again.',
      response.status,
      payload?.error?.details ?? null
    )
  }

  return payload.data
}

export function apiGet(path, options) {
  return request(path, { ...options, method: 'GET' })
}

export function apiPost(path, body, options) {
  return request(path, { ...options, method: 'POST', body })
}

export function apiPatch(path, body, options) {
  return request(path, { ...options, method: 'PATCH', body })
}

export function apiDelete(path, options) {
  return request(path, { ...options, method: 'DELETE' })
}