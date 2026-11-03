import Admin from '../models/Admin.js'
import {
  SESSION_COOKIE_NAME,
  clearCookieOptions,
  sessionCookieOptions,
} from '../config/auth.js'
import { HttpError } from '../utils/HttpError.js'
import { csrfTokenFor } from '../utils/csrf.js'
import { MAX_PASSWORD_BYTES, verifyAgainstDummy, verifyPassword } from '../utils/password.js'
import { parseLoginInput } from '../validation/adminSchema.js'
import { createSession, deleteSession } from '../services/sessionService.js'

// Galat email ho ya galat password: dono par yahi ek message.
const INVALID_LOGIN = 'Invalid email or password.'

// POST /api/admin/login
export async function login(req, res) {
  if (!req.is('application/json')) {
    throw new HttpError(415, 'Content-Type must be application/json.')
  }

  const { email, password } = parseLoginInput(req.body)

  const admin = await Admin.findOne({ email }).select('+passwordHash')
  const tooLong = Buffer.byteLength(password, 'utf8') > MAX_PASSWORD_BYTES

  let valid = false
  if (admin && !tooLong) {
    valid = await verifyPassword(password, admin.passwordHash)
  } else {
    // Email na mile (ya password bahut bada ho) tab bhi utna hi time lagao
    await verifyAgainstDummy(password.slice(0, 64))
  }

  if (!valid) {
    throw new HttpError(401, INVALID_LOGIN)
  }

  // Har login par naya token (purana token dobara kabhi use nahi hota)
  const { token } = await createSession(admin._id)
  await Admin.updateOne({ _id: admin._id }, { lastLoginAt: new Date() })

  res.cookie(SESSION_COOKIE_NAME, token, sessionCookieOptions())
  res.status(200).json({
    success: true,
    data: {
      admin: { email: admin.email, name: admin.name },
      // Frontend ise memory mein rakhega aur har POST/PATCH/DELETE ke saath X-CSRF-Token mein bhejega
      csrfToken: csrfTokenFor(token),
    },
  })
}

// POST /api/admin/logout  (requireAdmin aur requireCsrf ke baad chalta hai)
export async function logout(req, res) {
  await deleteSession(req.sessionToken)

  res.clearCookie(SESSION_COOKIE_NAME, clearCookieOptions())
  res.status(200).json({ success: true, data: { loggedOut: true } })
}

// GET /api/admin/me  (requireAdmin ke baad chalta hai)
// Page reload ke baad frontend ko token wapas yahin se milta hai.
export function getMe(req, res) {
  res.status(200).json({
    success: true,
    data: {
      admin: {
        email: req.admin.email,
        name: req.admin.name,
        lastLoginAt: req.admin.lastLoginAt ?? null,
      },
      csrfToken: csrfTokenFor(req.sessionToken),
    },
  })
}