import { env } from './env.js'
import { HttpError } from '../utils/HttpError.js'

// CORS: browser se sirf allowed websites API call kar sakti hain.
// Dhyan do: ye sirf browsers ko rokta hai. curl ya scripts ko nahi.
export const corsOptions = {
  origin(origin, callback) {
    // Origin header nahi hota jab request browser se nahi aati (Thunder Client, curl, server-to-server)
    if (!origin || env.clientOrigins.includes(origin)) {
      return callback(null, true)
    }
    callback(new HttpError(403, 'This origin is not allowed.'))
  },

  // Admin login ka cookie (Day 18) bhejne ke liye zaroori
  credentials: true,

  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],

  // Day 19 mein CSRF ke liye yahan ek aur header jodenge
  allowedHeaders: ['Content-Type'],

  // Browser preflight ka jawab 10 minute yaad rakhe
  maxAge: 600,
}