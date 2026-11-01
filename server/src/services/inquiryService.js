import Inquiry from '../models/Inquiry.js'

const DUPLICATE_WINDOW_MS = 10 * 60 * 1000 // 10 minute
const MAX_ID_ATTEMPTS = 3

// 10 minute ke andar same email + same description aayi ho toh wo record dhoondho.
// Double-click ya network retry se doosra record nahi banta.
export async function findRecentDuplicate({ email, description }) {
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS)

  return Inquiry.findOne({ email, description, createdAt: { $gte: since } })
    .select('inquiryId')
    .lean()
}

// Inquiry save karta hai. Bahut kam chance hai ki inquiryId kisi purane se takraye;
// aisa ho toh naya ID banake 3 baar tak dobara koshish karta hai.
export async function createInquiryRecord(input) {
  for (let attempt = 1; attempt <= MAX_ID_ATTEMPTS; attempt += 1) {
    try {
      return await Inquiry.create(input)
    } catch (error) {
      const isIdCollision = error?.code === 11000 && error?.keyPattern?.inquiryId
      if (!isIdCollision || attempt === MAX_ID_ATTEMPTS) {
        throw error
      }
    }
  }
}