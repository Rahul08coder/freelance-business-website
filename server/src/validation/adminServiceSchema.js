import { z } from 'zod'
import { SERVICE_ICONS } from '../config/constants.js'
import { HttpError } from '../utils/HttpError.js'
import { cleanLine, cleanMultiline } from '../utils/cleanText.js'
import { slugPattern } from '../utils/validators.js'

// Rules Service model jaise hi hain (server/src/models/Service.js)
const fields = {
  slug: z.preprocess(
    cleanLine,
    z
      .string()
      .trim()
      .toLowerCase()
      .min(1, 'Please enter a slug.')
      .max(60, 'Slug must be 60 characters or fewer.')
      .regex(slugPattern, 'Slug can only have lowercase letters, numbers and hyphens.')
  ),

  title: z.preprocess(
    cleanLine,
    z
      .string()
      .trim()
      .min(1, 'Please enter a title.')
      .min(2, 'Title must be at least 2 characters.')
      .max(100, 'Title must be 100 characters or fewer.')
  ),

  description: z.preprocess(
    cleanMultiline,
    z
      .string()
      .trim()
      .min(1, 'Please write a short description.')
      .max(300, 'Description must be 300 characters or fewer.')
  ),

  icon: z.preprocess(
    cleanLine,
    z
      .string()
      .trim()
      .refine((value) => SERVICE_ICONS.includes(value), 'Please choose one of the listed icons.')
  ),

  enabled: z.boolean(),
  order: z.number().int().min(0).max(9999),
}

// Naya service: slug, title, description zaroori. Baaki optional (default controller/model lagata hai).
const createSchema = z.object({
  slug: fields.slug,
  title: fields.title,
  description: fields.description,
  icon: fields.icon.optional(),
  enabled: fields.enabled.optional(),
  order: fields.order.optional(),
})

// Edit (PATCH): slug yahan hai hi nahi, kyunki banne ke baad badal nahi sakta
const updateSchema = z
  .object({
    title: fields.title,
    description: fields.description,
    icon: fields.icon,
    enabled: fields.enabled,
    order: fields.order,
  })
  .partial()

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

export function parseServiceCreate(body) {
  return parseWith(createSchema, body)
}

export function parseServiceUpdate(body) {
  // Slug badalne ki koshish chupchap ignore nahi karte, saaf bata dete hain
  if (body && typeof body === 'object' && Object.prototype.hasOwnProperty.call(body, 'slug')) {
    throw new HttpError(400, 'Validation failed.', [
      { field: 'slug', message: 'The slug cannot be changed after the service is created.' },
    ])
  }

  const data = parseWith(updateSchema, body)

  if (Object.keys(data).length === 0) {
    throw new HttpError(400, 'No changes were sent.')
  }

  return data
}