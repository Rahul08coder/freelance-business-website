import { apiPost } from './api.js'

// Inquiry server ko bhejta hai. Success par { inquiryId } deta hai.
// Galti par ApiError throw hota hai (status aur details ke saath).
export async function submitInquiry(payload) {
  const data = await apiPost('/inquiries', payload)
  return { inquiryId: data.inquiryId, demo: false }
}