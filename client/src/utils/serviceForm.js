import { serviceIconNames } from '../config/icons.js'
import { slugify } from './projectForm.js'

// Icon chunne ka dropdown
export const serviceIconOptions = serviceIconNames.map((name) => ({ value: name, label: name }))

export const emptyService = {
  title: '',
  slug: '',
  description: '',
  icon: 'Code',
  enabled: true,
  order: '', // khaali = sabse aakhir mein
}

// Services ka slug 60 character tak
export function serviceSlugFromTitle(title) {
  return slugify(title).slice(0, 60).replace(/-+$/, '')
}

export function toServiceFormValues(service) {
  return {
    title: service.title,
    slug: service.slug,
    description: service.description,
    icon: service.icon,
    enabled: Boolean(service.enabled),
    order: String(service.order),
  }
}

// Edit mein slug nahi bhejte (banne ke baad badal nahi sakta)
export function toServicePayload(values, isEdit) {
  const payload = {
    title: values.title.trim(),
    description: values.description.trim(),
    icon: values.icon,
    enabled: values.enabled,
  }

  if (!isEdit) {
    payload.slug = values.slug.trim()
  }

  if (values.order.trim() !== '') {
    payload.order = Number(values.order)
  }

  return payload
}

// Backend jaise hi rules. Sahi ho toh {} deta hai, galat ho toh { fieldName: 'message' }
export function validateService(values, isEdit) {
  const errors = {}
  const title = values.title.trim()
  const slug = values.slug.trim()
  const description = values.description.trim()
  const order = values.order.trim()

  if (!title) errors.title = 'Please enter a title.'
  else if (title.length < 2) errors.title = 'Title must be at least 2 characters.'
  else if (title.length > 100) errors.title = 'Title must be 100 characters or fewer.'

  if (!isEdit) {
    if (!slug) errors.slug = 'Please enter a slug.'
    else if (slug.length > 60) errors.slug = 'Slug must be 60 characters or fewer.'
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      errors.slug = 'Slug can only have lowercase letters, numbers and hyphens.'
    }
  }

  if (!description) errors.description = 'Please write a short description.'
  else if (description.length > 300) errors.description = 'Description must be 300 characters or fewer.'

  if (!serviceIconNames.includes(values.icon)) {
    errors.icon = 'Please choose one of the listed icons.'
  }

  if (order !== '' && !/^\d{1,4}$/.test(order)) {
    errors.order = 'Order must be a whole number from 0 to 9999.'
  }

  return errors
}