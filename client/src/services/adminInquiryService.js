import { apiDelete, apiPatch } from './api.js'

// List ka path banata hai. Khaali filters query mein jate hi nahi.
export function inquiriesPath({ search, status, page, limit }) {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (status) params.set('status', status)
  if (page > 1) params.set('page', String(page))
  params.set('limit', String(limit))

  return `/admin/inquiries?${params.toString()}`
}

export function inquiryPath(id) {
  return `/admin/inquiries/${encodeURIComponent(id)}`
}

export function updateInquiryStatus(id, status) {
  return apiPatch(inquiryPath(id), { status })
}

export function deleteInquiry(id) {
  return apiDelete(inquiryPath(id))
}