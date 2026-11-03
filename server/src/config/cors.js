import { env } from './env.js'
import { HttpError } from '../utils/HttpError.js'

// CORS: browser se sirf allowed websites API call kar sakti hain.
// Humne anjaan Origin par error diya hai, isliye wo request route tak pahunchti hi nahi
// (sirf response nahi chhupta). Ye CSRF ka ek layer bhi hai.
// Dhyan do: Origin header sirf browsers bhejte hain. curl ya scripts ko ye nahi rokta.
export const corsOptions = {
  origin(origin, callback) {
    // Origin header nahi hota jab request browser se nahi aati (Thunder Client, curl, server-to-server)
    if (!origin || env.clientOrigins.includes(origin)) {
      return callback(null, true)
    }
    callback(new HttpError(403, 'This origin is not allowed.'))
  },

  // Admin login ka cookie bhejne ke liye zaroori
  credentials: true,

  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],

  // X-CSRF-Token custom header hai, isliye browser pehle preflight (OPTIONS) bhejta hai
  allowedHeaders: ['Content-Type', 'X-CSRF-Token'],

  // Browser preflight ka jawab 10 minute yaad rakhe
  maxAge: 600,
}