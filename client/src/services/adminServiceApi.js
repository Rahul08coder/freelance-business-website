import { apiDelete, apiPatch, apiPost } from './api.js'

export const ADMIN_SERVICES_PATH = '/admin/services'

export function adminServicePath(id) {
  return `/admin/services/${encodeURIComponent(id)}`
}

export function createService(payload) {
  return apiPost(ADMIN_SERVICES_PATH, payload)
}

export function updateService(id, payload) {
  return apiPatch(adminServicePath(id), payload)
}

// Enabled on/off: sirf ek field bhejte hain
export function setServiceEnabled(id, enabled) {
  return apiPatch(adminServicePath(id), { enabled })
}

export function deleteService(id) {
  return apiDelete(adminServicePath(id))
}