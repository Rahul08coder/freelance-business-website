import { createHash, randomBytes } from 'node:crypto'
import Session from '../models/Session.js'
import { SESSION_TTL_MS } from '../config/auth.js'

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex')
}

// Naya session banata hai. Token sirf ek baar (cookie ke liye) wapas milta hai.
export async function createSession(adminId) {
  const token = randomBytes(32).toString('base64url') // 43 characters, guess karna namumkin
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)

  await Session.create({ tokenHash: hashToken(token), admin: adminId, expiresAt })

  return { token, expiresAt }
}

// Token valid session ka hai ya nahi.
export async function findValidSession(token) {
  // cookie-parser "j:{...}" jaisi cookie ko object bana deta hai. Sirf string token hi chalega.
  if (typeof token !== 'string' || token.length < 20 || token.length > 100) {
    return null
  }

  return Session.findOne({ tokenHash: hashToken(token), expiresAt: { $gt: new Date() } }).lean()
}

export async function deleteSession(token) {
  if (typeof token !== 'string' || !token) return
  await Session.deleteOne({ tokenHash: hashToken(token) })
}

export async function deleteAdminSessions(adminId) {
  await Session.deleteMany({ admin: adminId })
}