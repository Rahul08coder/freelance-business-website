import { isHttpUrl } from './text.js'

// { email, location, socials } (API ya site.js se) ko form ke text fields mein badalta hai
export function toSettingsFormValues(source) {
  return {
    email: source.email ?? '',
    location: source.location ?? '',
    github: source.socials?.github ?? '',
    linkedin: source.socials?.linkedin ?? '',
    twitter: source.socials?.twitter ?? '',
  }
}

// Form ke text ko server ko bhejne wale format mein badalta hai (hamesha poore fields)
export function toSettingsPayload(values) {
  return {
    email: values.email.trim(),
    location: values.location.trim(),
    socials: {
      github: values.github.trim(),
      linkedin: values.linkedin.trim(),
      twitter: values.twitter.trim(),
    },
  }
}

// Backend jaise hi rules. Sahi ho toh {} deta hai, galat ho toh { fieldName: 'message' }
export function validateSettings(values) {
  const errors = {}
  const email = values.email.trim()

  if (!email) errors.email = 'Please enter an email address.'
  else if (email.length > 254) errors.email = 'This email address is too long.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = 'Please enter a valid email address, like name@example.com.'
  }

  if (values.location.trim().length > 100) {
    errors.location = 'Location must be 100 characters or fewer.'
  }

  for (const field of ['github', 'linkedin', 'twitter']) {
    const value = values[field].trim()
    if (value.length > 300) errors[field] = 'This link is too long.'
    else if (value && !isHttpUrl(value)) {
      errors[field] = 'Please enter a full link starting with http:// or https://'
    }
  }

  return errors
}