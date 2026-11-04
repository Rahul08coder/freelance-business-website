import { apiGet, apiPost } from './api.js'

export function loginAdmin(email, password) {
  return apiPost('/admin/login', { email, password })
}

export function logoutAdmin() {
  return apiPost('/admin/logout', {})
}

// Page reload ke baad session wapas laata hai, aur naya CSRF token deta hai
export function fetchMe() {
  return apiGet('/admin/me')
}