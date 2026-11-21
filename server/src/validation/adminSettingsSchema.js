import { z } from 'zod'
import { HttpError } from '../utils/HttpError.js'
import { cleanLine } from '../utils/cleanText.js'
import { emailPattern, isEmptyOrHttpUrl } from '../utils/validators.js'

const socialUrl = z.preprocess(
  cleanLine,
  z
    .string()
    .trim()
    .max(300, 'This link is too long.')
    .refine(isEmptyOrHttpUrl, 'Please enter a full link starting with http:// or https://')
)

// Rules SiteSettings model jaise hi hain (server/src/models/SiteSettings.js).
// Email khaali nahi ho sakta (site par contact ka raasta hamesha rehna chahiye).
// Location aur links khaali ho sakte hain (khaali = site par dikhta nahi).
const updateSchema = z
  .object({
    email: z.preprocess(
      cleanLine,
      z
        .string()
        .trim()
        .toLowerCase()
        .min(1, 'Please enter an email address.')
        .max(254, 'This email address is too long.')
        .regex(emailPattern, 'Please enter a valid email address, like name@example.com.')
    ),

    location: z.preprocess(
      cleanLine,
      z.string().trim().max(100, 'Location must be 100 characters or fewer.')
    ),

    // Sirf ye 3 naam. Aur koi naam (ya operator jaise $set) yahin ruk jata hai.
    socials: z
      .object({
        github: socialUrl,
        linkedin: socialUrl,
        twitter: socialUrl,
      })
      .partial(),
  })
  .partial()

// PATCH body check karta hai. Sahi ho toh saaf data deta hai, galat ho toh 400 error throw karta hai.
export function parseSettingsUpdate(body) {
  const result = updateSchema.safeParse(body ?? {})

  if (result.success) {
    return result.data
  }

  // Har field ka sirf pehla message. Nested field ka naam "socials.github" jaisa hota hai.
  const seen = new Set()
  const details = []
  for (const issue of result.error.issues) {
    const field = issue.path.length > 0 ? issue.path.join('.') : 'form'
    if (seen.has(field)) continue
    seen.add(field)
    details.push({ field, message: issue.message })
  }

  throw new HttpError(400, 'Validation failed.', details)
}