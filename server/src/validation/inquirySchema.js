import { z } from 'zod'
import { BUDGET_VALUES, DEADLINE_VALUES, INQUIRY_LIMITS as L } from '../config/constants.js'
import { emailPattern, isEmptyOrHttpUrl, slugPattern } from '../utils/validators.js'
import { HttpError } from '../utils/HttpError.js'

// Chhupe control characters (null byte jaise). Tab, line break yahan nahi hain.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g
const LINE_BREAKS = /[\r\n\t]+/g

// Single-line fields (naam, email, etc.): control chars hatao, line break ko space banao.
// Missing (undefined/null) ko '' maante hain, taaki "required" ka saaf message mile.
function cleanLine(value) {
  if (value === undefined || value === null) return ''
  if (typeof value !== 'string') return value // galat type: Zod reject karega
  return value.replace(CONTROL_CHARS, '').replace(LINE_BREAKS, ' ')
}

// Multi-line fields (description, notes): line break rehne do, control chars hatao.
function cleanMultiline(value) {
  if (value === undefined || value === null) return ''
  if (typeof value !== 'string') return value
  return value.replace(CONTROL_CHARS, '')
}

export const inquirySchema = z.object({
  name: z.preprocess(
    cleanLine,
    z
      .string()
      .trim()
      .min(1, 'Please enter your name.')
      .min(L.name.min, `Name must be at least ${L.name.min} characters.`)
      .max(L.name.max, `Name must be ${L.name.max} characters or fewer.`)
  ),

  email: z.preprocess(
    cleanLine,
    z
      .string()
      .trim()
      .toLowerCase()
      .min(1, 'Please enter your email address.')
      .max(L.email.max, 'This email address is too long.')
      .regex(emailPattern, 'Please enter a valid email address, like name@example.com.')
  ),

  company: z.preprocess(
    cleanLine,
    z.string().trim().max(L.company.max, `Company name must be ${L.company.max} characters or fewer.`)
  ),

  projectType: z.preprocess(
    cleanLine,
    z
      .string()
      .trim()
      .toLowerCase()
      .min(1, 'Please choose a project type.')
      .max(L.projectType.max, 'Please choose a valid project type.')
      .regex(slugPattern, 'Please choose a valid project type.')
  ),

  budget: z.preprocess(
    cleanLine,
    z
      .string()
      .trim()
      .min(1, 'Please choose a budget range.')
      .refine((value) => BUDGET_VALUES.includes(value), 'Please choose one of the listed budget ranges.')
  ),

  deadline: z.preprocess(
    cleanLine,
    z
      .string()
      .trim()
      .min(1, 'Please choose when you need the project.')
      .refine((value) => DEADLINE_VALUES.includes(value), 'Please choose one of the listed options.')
  ),

  description: z.preprocess(
    cleanMultiline,
    z
      .string()
      .trim()
      .min(1, 'Please describe your project.')
      .min(
        L.description.min,
        `Please write at least ${L.description.min} characters so I can understand your project.`
      )
      .max(L.description.max, `Description must be ${L.description.max} characters or fewer.`)
  ),

  referenceUrl: z.preprocess(
    cleanLine,
    z
      .string()
      .trim()
      .max(L.referenceUrl.max, 'This link is too long.')
      .refine(isEmptyOrHttpUrl, 'Please enter a full link starting with http:// or https://')
  ),

  notes: z.preprocess(
    cleanMultiline,
    z.string().trim().max(L.notes.max, `Notes must be ${L.notes.max} characters or fewer.`)
  ),
})

// Body check karta hai. Sahi ho toh saaf data deta hai (sirf upar ke 9 fields, baaki sab hata diye).
// Galat ho toh 400 error throw karta hai, har field ka sirf pehla message.
export function parseInquiryInput(body) {
  const result = inquirySchema.safeParse(body ?? {})

  if (result.success) {
    return result.data
  }

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