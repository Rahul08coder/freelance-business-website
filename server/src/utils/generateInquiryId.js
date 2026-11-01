import { randomInt } from 'node:crypto'

// 0, O, 1, I jaise confusing characters nahi hain, taaki phone par bolna aasaan ho.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

// Jaise "INQ-K7M2X9PQ". crypto.randomInt secure random deta hai (Math.random nahi).
export function generateInquiryId() {
  let code = ''
  for (let i = 0; i < 8; i += 1) {
    code += ALPHABET[randomInt(ALPHABET.length)]
  }
  return `INQ-${code}`
}