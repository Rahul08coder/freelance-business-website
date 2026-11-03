import { createHmac, timingSafeEqual } from 'node:crypto'

// CSRF token session token se banta hai (HMAC). Isliye:
//  - server ko koi extra cheez store nahi karni
//  - har session ka token alag hota hai
//  - session token ke bina ye token koi bana nahi sakta
export function csrfTokenFor(sessionToken) {
  return createHmac('sha256', sessionToken).update('devlance-csrf-v1').digest('base64url')
}

// Request ke header se aaya token sahi hai ya nahi.
// timingSafeEqual: compare karne ka time same rehta hai, taaki time se token guess na ho sake.
export function isValidCsrfToken(sessionToken, candidate) {
  if (typeof sessionToken !== 'string' || !sessionToken) return false
  if (typeof candidate !== 'string' || candidate.length === 0 || candidate.length > 200) return false

  const expected = Buffer.from(csrfTokenFor(sessionToken))
  const given = Buffer.from(candidate)

  return expected.length === given.length && timingSafeEqual(expected, given)
}