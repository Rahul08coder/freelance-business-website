import { z } from 'zod'
import { INQUIRY_STATUSES } from '../config/constants.js'
import { HttpError } from '../utils/HttpError.js'

function fail(field, message) {
  throw new HttpError(400, 'Validation failed.', [{ field, message }])
}

// Query ki value ek hi text honi chahiye. ?search=a&search=b (array) ya object reject.
function readString(value, field, maxLength) {
  if (value === undefined) return ''
  if (typeof value !== 'string') {
    fail(field, `"${field}" must be a single text value.`)
  }

  const trimmed = value.trim()
  if (trimmed.length > maxLength) {
    fail(field, `"${field}" must be ${maxLength} characters or fewer.`)
  }
  return trimmed
}

function readInteger(value, field, { fallback, min, max }) {
  if (value === undefined || value === '') return fallback

  if (typeof value !== 'string' || !/^\d{1,5}$/.test(value)) {
    fail(field, `"${field}" must be a whole number.`)
  }

  const number = Number(value)
  if (number < min || number > max) {
    fail(field, `"${field}" must be between ${min} and ${max}.`)
  }
  return number
}

// GET /api/admin/inquiries ki query: search, status, page, limit
export function parseInquiryListQuery(query) {
  const search = readString(query.search, 'search', 100)
  const status = readString(query.status, 'status', 20)

  if (status && !INQUIRY_STATUSES.includes(status)) {
    fail('status', 'Status is not valid.')
  }

  const page = readInteger(query.page, 'page', { fallback: 1, min: 1, max: 10000 })
  const limit = readInteger(query.limit, 'limit', { fallback: 10, min: 1, max: 50 })

  return { search, status, page, limit }
}

// PATCH body: sirf status. Aur koi field ignore ho jata hai.
const statusUpdateSchema = z.object({
  status: z.preprocess(
    (value) => (value === undefined || value === null ? '' : value),
    z
      .string()
      .trim()
      .min(1, 'Please choose a status.')
      .refine((value) => INQUIRY_STATUSES.includes(value), 'Status is not valid.')
  ),
})

export function parseStatusUpdate(body) {
  const result = statusUpdateSchema.safeParse(body ?? {})

  if (result.success) {
    return result.data
  }

  const details = result.error.issues.map((issue) => ({
    field: String(issue.path[0] ?? 'form'),
    message: issue.message,
  }))
  throw new HttpError(400, 'Validation failed.', details.slice(0, 1))
}