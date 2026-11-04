import { z } from 'zod'
import { PROJECT_CATEGORIES } from '../config/constants.js'
import { HttpError } from '../utils/HttpError.js'
import { cleanLine, cleanMultiline } from '../utils/cleanText.js'
import { isEmptyOrHttpUrl, slugPattern } from '../utils/validators.js'

const urlField = z.preprocess(
  cleanLine,
  z
    .string()
    .trim()
    .max(300, 'This link is too long.')
    .refine(isEmptyOrHttpUrl, 'Please enter a full link starting with http:// or https://')
)

// features aur tech jaisi lists: har item ek chhota text. Missing ho toh khaali list.
function listField(singular, plural, maxItems, maxLength) {
  return z.preprocess(
    (value) => (value === undefined || value === null ? [] : value),
    z
      .array(
        z.preprocess(
          cleanLine,
          z
            .string()
            .trim()
            .min(1, `A ${singular} cannot be empty.`)
            .max(maxLength, `Each ${singular} must be ${maxLength} characters or fewer.`)
        )
      )
      .max(maxItems, `Use at most ${maxItems} ${plural}.`)
  )
}

// Rules Project model jaise hi hain (server/src/models/Project.js)
const fields = {
  title: z.preprocess(
    cleanLine,
    z
      .string()
      .trim()
      .min(1, 'Please enter a title.')
      .min(2, 'Title must be at least 2 characters.')
      .max(100, 'Title must be 100 characters or fewer.')
  ),

  slug: z.preprocess(
    cleanLine,
    z
      .string()
      .trim()
      .toLowerCase()
      .min(1, 'Please enter a slug.')
      .max(80, 'Slug must be 80 characters or fewer.')
      .regex(slugPattern, 'Slug can only have lowercase letters, numbers and hyphens.')
  ),

  category: z.preprocess(
    cleanLine,
    z
      .string()
      .trim()
      .min(1, 'Please choose a category.')
      .refine((value) => PROJECT_CATEGORIES.includes(value), 'Please choose one of the listed categories.')
  ),

  description: z.preprocess(
    cleanMultiline,
    z
      .string()
      .trim()
      .min(1, 'Please write a short description.')
      .max(300, 'Description must be 300 characters or fewer.')
  ),

  overview: z.preprocess(
    cleanMultiline,
    z
      .string()
      .trim()
      .min(1, 'Please write an overview.')
      .max(3000, 'Overview must be 3000 characters or fewer.')
  ),

  features: listField('feature', 'features', 15, 200),
  tech: listField('technology', 'technologies', 15, 40),

  githubUrl: urlField,
  liveUrl: urlField,

  featured: z.boolean(),
  order: z.number().int().min(0).max(9999),
}

// Naya project: title, slug, category, description, overview zaroori. Baaki optional.
// (Default yahan nahi lagaye, controller lagata hai. Zod ke naye version mein default aur partial
// milkar PATCH par purani value reset kar sakte hain, isliye.)
const createSchema = z.object({
  ...fields,
  featured: fields.featured.optional(),
  order: fields.order.optional(),
})

// Edit (PATCH): koi bhi fields, jitne bheje utne hi badalte hain
const updateSchema = z.object(fields).partial()

function parseWith(schema, body) {
  const result = schema.safeParse(body ?? {})

  if (result.success) {
    return result.data
  }

  // Har field ka sirf pehla message
  const seen = new Set()
  const details = []
  for (const issue of result.error.issues) {
    const field = String(issue.path[0] ?? 'form')
    if (seen.has(field)) continue
    seen.add(field)
    details.push({ field, message: issue.message })
  }

  throw new HttpError(400, 'Validation failed.', details)
}

export function parseProjectCreate(body) {
  return parseWith(createSchema, body)
}

export function parseProjectUpdate(body) {
  const data = parseWith(updateSchema, body)

  if (Object.keys(data).length === 0) {
    throw new HttpError(400, 'No changes were sent.')
  }

  return data
}