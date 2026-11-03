import { SESSION_COOKIE_NAME } from '../config/auth.js'
import { isValidCsrfToken } from '../utils/csrf.js'
import { HttpError } from '../utils/HttpError.js'

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

// Har badlaav wali request (POST, PATCH, DELETE) ke saath sahi X-CSRF-Token header chahiye.
// Ye requireAdmin ke BAAD lagta hai (pehle login check, phir token).
export default function requireCsrf(req, res, next) {
  if (SAFE_METHODS.has(req.method)) {
    return next()
  }

  const sessionToken = req.sessionToken ?? req.cookies?.[SESSION_COOKIE_NAME]

  if (!isValidCsrfToken(sessionToken, req.get('X-CSRF-Token'))) {
    throw new HttpError(403, 'Invalid or missing CSRF token.')
  }

  next()
}