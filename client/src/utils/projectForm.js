import { projectCategoryOptions } from '../config/projectOptions.js'
import { isHttpUrl } from './text.js'

export const emptyProject = {
  title: '',
  slug: '',
  category: '',
  description: '',
  overview: '',
  features: '', // har line ek feature
  tech: '', // comma se alag
  githubUrl: '',
  liveUrl: '',
  featured: false,
  order: '', // khaali = sabse aakhir mein
}

// "Admin API Test" -> "admin-api-test"
export function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

// Server ke project ko form ke text fields mein badalta hai
export function toFormValues(project) {
  return {
    title: project.title,
    slug: project.slug,
    category: project.category,
    description: project.description,
    overview: project.overview,
    features: project.features.join('\n'),
    tech: project.tech.join(', '),
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
    featured: Boolean(project.featured),
    order: String(project.order),
  }
}

export function splitLines(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

export function splitTech(text) {
  return text
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

// Form ke text ko server ko bhejne wale format mein badalta hai
export function toPayload(values) {
  const payload = {
    title: values.title.trim(),
    slug: values.slug.trim(),
    category: values.category,
    description: values.description.trim(),
    overview: values.overview.trim(),
    features: splitLines(values.features),
    tech: splitTech(values.tech),
    githubUrl: values.githubUrl.trim(),
    liveUrl: values.liveUrl.trim(),
    featured: values.featured,
  }

  // Order khaali ho toh bhejte hi nahi, server sabse aakhir mein laga deta hai
  if (values.order.trim() !== '') {
    payload.order = Number(values.order)
  }

  return payload
}

// Backend jaise hi rules. Sahi ho toh {} deta hai, galat ho toh { fieldName: 'message' }
export function validateProject(values) {
  const errors = {}
  const title = values.title.trim()
  const slug = values.slug.trim()
  const features = splitLines(values.features)
  const tech = splitTech(values.tech)

  if (!title) errors.title = 'Please enter a title.'
  else if (title.length < 2) errors.title = 'Title must be at least 2 characters.'
  else if (title.length > 100) errors.title = 'Title must be 100 characters or fewer.'

  if (!slug) errors.slug = 'Please enter a slug.'
  else if (slug.length > 80) errors.slug = 'Slug must be 80 characters or fewer.'
  else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.slug = 'Slug can only have lowercase letters, numbers and hyphens.'
  }

  if (!values.category) errors.category = 'Please choose a category.'
  else if (!projectCategoryOptions.some((option) => option.value === values.category)) {
    errors.category = 'Please choose one of the listed categories.'
  }

  const description = values.description.trim()
  if (!description) errors.description = 'Please write a short description.'
  else if (description.length > 300) errors.description = 'Description must be 300 characters or fewer.'

  const overview = values.overview.trim()
  if (!overview) errors.overview = 'Please write an overview.'
  else if (overview.length > 3000) errors.overview = 'Overview must be 3000 characters or fewer.'

  if (features.length > 15) errors.features = 'Use at most 15 features.'
  else if (features.some((item) => item.length > 200)) {
    errors.features = 'Each feature must be 200 characters or fewer.'
  }

  if (tech.length > 15) errors.tech = 'Use at most 15 technologies.'
  else if (tech.some((item) => item.length > 40)) {
    errors.tech = 'Each technology name must be 40 characters or fewer.'
  }

  for (const field of ['githubUrl', 'liveUrl']) {
    const value = values[field].trim()
    if (value.length > 300) errors[field] = 'This link is too long.'
    else if (value && !isHttpUrl(value)) {
      errors[field] = 'Please enter a full link starting with http:// or https://'
    }
  }

  const order = values.order.trim()
  if (order !== '' && !/^\d{1,4}$/.test(order)) {
    errors.order = 'Order must be a whole number from 0 to 9999.'
  }

  return errors
}