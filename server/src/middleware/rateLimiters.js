import { rateLimit } from 'express-rate-limit'
import { env } from '../config/env.js'

function createLimiter({ windowMs, limit, message, skipSuccessfulRequests = false }) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7', // RateLimit-* headers bhejta hai
    legacyHeaders: false,
    skipSuccessfulRequests,
    handler: (req, res) => {
      // Retry-After header library khud laga deti hai
      res.status(429).json({ success: false, error: { message } })
    },
  })
}

// Saare API routes par (health ko chhodkar): 15 minute mein 300 requests
export const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  message: 'Too many requests. Please try again later.',
})

// Inquiry form: ek IP se 1 ghante mein 5 (production). Development mein 30, taaki testing ho sake.
export const inquiryLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  limit: env.isProduction ? 5 : 30,
  message: 'You have sent too many requests. Please try again in an hour.',
})

// Admin login par lagega (Day 18): 15 minute mein sirf 5 galat koshish
export const loginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true, // sahi login ginti mein nahi aata
  message: 'Too many login attempts. Please try again in 15 minutes.',
})