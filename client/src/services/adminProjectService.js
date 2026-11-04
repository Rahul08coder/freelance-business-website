import { apiDelete, apiPatch, apiPost } from './api.js'

export const ADMIN_PROJECTS_PATH = '/admin/projects'

export function adminProjectPath(id) {
  return `/admin/projects/${encodeURIComponent(id)}`
}

export function createProject(payload) {
  return apiPost(ADMIN_PROJECTS_PATH, payload)
}

export function updateProject(id, payload) {
  return apiPatch(adminProjectPath(id), payload)
}

// Featured on/off: sirf ek field bhejte hain
export function setProjectFeatured(id, featured) {
  return apiPatch(adminProjectPath(id), { featured })
}

export function deleteProject(id) {
  return apiDelete(adminProjectPath(id))
}