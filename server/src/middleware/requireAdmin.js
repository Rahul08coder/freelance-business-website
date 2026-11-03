import Admin from '../models/Admin.js'
import { SESSION_COOKIE_NAME, clearCookieOptions } from '../config/auth.js'
import { findValidSession } from '../services/sessionService.js'
import { HttpError } from '../utils/HttpError.js'

// Admin routes ka darwaza. Valid session ki cookie nahi hai toh 401, aage kuch nahi chalta.
// Har baar server par check hota hai. Frontend ka chhupana suraksha nahi hai.
export default async function requireAdmin(req, res, next) {
  const token = req.cookies?.[SESSION_COOKIE_NAME]

  const session = await findValidSession(token)
  const admin = session ? await Admin.findById(session.admin).lean() : null

  if (!session || !admin) {
    // Purani ya kharab cookie ho toh hata do
    if (token) {
      res.clearCookie(SESSION_COOKIE_NAME, clearCookieOptions())
    }
    throw new HttpError(401, 'Please log in.')
  }

  req.admin = admin
  req.sessionToken = token // CSRF token isi se banta hai
  next()
}