import Service from '../models/Service.js'
import { HttpError } from '../utils/HttpError.js'
import { parseInquiryInput } from '../validation/inquirySchema.js'
import { createInquiryRecord, findRecentDuplicate } from '../services/inquiryService.js'

// POST /api/inquiries
export async function createInquiry(req, res) {
  // Sirf JSON body. Aur kuch ho toh 415.
  if (!req.is('application/json')) {
    throw new HttpError(415, 'Content-Type must be application/json.')
  }

  // 1. Format check (galat ho toh 400)
  const input = parseInquiryInput(req.body)

  // 2. Project type asli service honi chahiye (ya "other")
  if (input.projectType !== 'other') {
    const serviceExists = await Service.exists({ slug: input.projectType, enabled: true })
    if (!serviceExists) {
      throw new HttpError(400, 'Validation failed.', [
        { field: 'projectType', message: 'Please choose a valid project type.' },
      ])
    }
  }

  // 3. Duplicate? Toh purana ID hi wapas do (naya record nahi)
  const duplicate = await findRecentDuplicate(input)
  if (duplicate) {
    return res.status(200).json({ success: true, data: { inquiryId: duplicate.inquiryId } })
  }

  // 4. Save. Status hamesha "new" (schema ka default), client chunta nahi.
  const inquiry = await createInquiryRecord(input)

  // Client ko sirf reference ID. Uska diya hua data wapas nahi bhejte.
  res.status(201).json({ success: true, data: { inquiryId: inquiry.inquiryId } })
}