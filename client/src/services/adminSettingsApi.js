import { apiPatch } from './api.js'

export const ADMIN_SETTINGS_PATH = '/admin/settings'

export function updateSettings(payload) {
  return apiPatch(ADMIN_SETTINGS_PATH, payload)
}