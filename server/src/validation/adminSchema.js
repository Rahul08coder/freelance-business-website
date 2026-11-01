import { z } from 'zod'
import { HttpError } from '../utils/HttpError.js'

// Login mein hum rules (kitna lamba password, etc.) nahi batate, sirf type aur lambai check karte hain.
// z.string() ka matlab hai ki {"$ne": null} jaise objects yahin reject ho jate hain.
const loginSchema = z.object({
  email: z.string().trim().toLowerCase().min(1).max(254),
  password: z.string().min(1).max(200),
})

export function parseLoginInput(body) {
  const result = loginSchema.safeParse(body ?? {})

  if (!result.success) {
    throw new HttpError(400, 'Please enter your email and password.')
  }

  return result.data
}