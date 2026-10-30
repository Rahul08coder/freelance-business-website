import { projectTypeOptions, budgetOptions, deadlineOptions } from '../config/formOptions.js'

// Maximum aur minimum lengths. Day 17 mein backend mein bhi yahi rakhenge.
export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  company: { max: 100 },
  description: { min: 20, max: 2000 },
  referenceUrl: { max: 300 },
  notes: { max: 1000 },
}

// botField ek chhupa hua "honeypot" field hai. Insaan ise nahi bharta, bots bhar dete hain.
export const initialValues = {
  name: '',
  email: '',
  company: '',
  projectType: '',
  budget: '',
  deadline: '',
  description: '',
  referenceUrl: '',
  notes: '',
  botField: '',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function isValidHttpUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function isAllowed(options, value) {
  return options.some((option) => option.value === value)
}

// Ek field check karta hai. Sahi ho toh '' (khaali string), galat ho toh error message deta hai.
export function validateField(name, rawValue) {
  const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue

  switch (name) {
    case 'name':
      if (!value) return 'Please enter your name.'
      if (value.length < LIMITS.name.min) return `Name must be at least ${LIMITS.name.min} characters.`
      if (value.length > LIMITS.name.max) return `Name must be ${LIMITS.name.max} characters or fewer.`
      return ''

    case 'email':
      if (!value) return 'Please enter your email address.'
      if (value.length > LIMITS.email.max) return 'This email address is too long.'
      if (!emailPattern.test(value)) return 'Please enter a valid email address, like name@example.com.'
      return ''

    case 'company':
      if (value.length > LIMITS.company.max) {
        return `Company name must be ${LIMITS.company.max} characters or fewer.`
      }
      return ''

    case 'projectType':
      if (!value) return 'Please choose a project type.'
      if (!isAllowed(projectTypeOptions, value)) return 'Please choose one of the listed project types.'
      return ''

    case 'budget':
      if (!value) return 'Please choose a budget range.'
      if (!isAllowed(budgetOptions, value)) return 'Please choose one of the listed budget ranges.'
      return ''

    case 'deadline':
      if (!value) return 'Please choose when you need the project.'
      if (!isAllowed(deadlineOptions, value)) return 'Please choose one of the listed options.'
      return ''

    case 'description':
      if (!value) return 'Please describe your project.'
      if (value.length < LIMITS.description.min) {
        return `Please write at least ${LIMITS.description.min} characters so I can understand your project.`
      }
      if (value.length > LIMITS.description.max) {
        return `Description must be ${LIMITS.description.max} characters or fewer.`
      }
      return ''

    case 'referenceUrl':
      if (!value) return '' // optional
      if (value.length > LIMITS.referenceUrl.max) return 'This link is too long.'
      if (!isValidHttpUrl(value)) {
        return 'Please enter a full link starting with http:// or https://'
      }
      return ''

    case 'notes':
      if (value.length > LIMITS.notes.max) {
        return `Notes must be ${LIMITS.notes.max} characters or fewer.`
      }
      return ''

    default:
      return ''
  }
}

// Visible fields ki list (botField validate nahi hota)
const fieldNames = [
  'name',
  'email',
  'company',
  'projectType',
  'budget',
  'deadline',
  'description',
  'referenceUrl',
  'notes',
]

// Saare fields check karta hai. Sirf galat fields ke errors wapas aate hain.
export function validateAll(values) {
  const errors = {}
  fieldNames.forEach((name) => {
    const message = validateField(name, values[name])
    if (message) errors[name] = message
  })
  return errors
}

// Server ko bhejne se pehle spaces trim karta hai aur honeypot hata deta hai.
export function buildPayload(values) {
  const payload = {}
  fieldNames.forEach((name) => {
    payload[name] = values[name].trim()
  })
  return payload
}