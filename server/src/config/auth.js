import { env } from './env.js'

export const SESSION_COOKIE_NAME = 'devlance_admin_session'

// Session 12 ghante ki. Uske baad dobara login karna padega.
export const SESSION_TTL_MS = 12 * 60 * 60 * 1000

// Cookie ki settings:
//  httpOnly  -> browser ka JavaScript is cookie ko padh nahi sakta
//  secure    -> production mein sirf HTTPS par jati hai
//  sameSite  -> doosri website se aayi request par cookie nahi jati (CSRF ka pehla bachav)
//  path      -> sirf /api/admin ki requests ke saath jati hai
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    path: '/api/admin',
    maxAge: SESSION_TTL_MS,
  }
}

// Cookie hatane ke liye: same settings chahiye (maxAge ke bina), warna browser use nahi hatata
export function clearCookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    path: '/api/admin',
  }
}