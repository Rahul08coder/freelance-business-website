import { randomBytes } from 'node:crypto'
import bcrypt from 'bcryptjs'

// Cost 12: har password check mein thoda time lagta hai (jaanbujhkar), taaki guess karna mehnga pade.
export const BCRYPT_COST = 12

// bcrypt sirf pehle 72 bytes padhta hai. Isse bade passwords hum accept hi nahi karte.
export const MAX_PASSWORD_BYTES = 72
export const MIN_PASSWORD_LENGTH = 12

export function hashPassword(plain) {
  return bcrypt.hash(plain, BCRYPT_COST)
}

export function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash)
}

// Email database mein na mile tab bhi itna hi time lagana, taaki response ke time se
// koi pata na laga sake ki kaun sa email asli hai.
let dummyHashPromise = null

export async function verifyAgainstDummy(plain) {
  if (!dummyHashPromise) {
    dummyHashPromise = bcrypt.hash(randomBytes(16).toString('hex'), BCRYPT_COST)
  }
  await bcrypt.compare(plain, await dummyHashPromise)
}