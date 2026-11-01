export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Slug: lowercase letters, numbers aur beech mein hyphen. Jaise "business-website"
export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function isHttpUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

// Optional URL fields ke liye: khaali chalega, par bhara ho toh http(s) hi hona chahiye
export function isEmptyOrHttpUrl(value) {
  return value === '' || isHttpUrl(value)
}

export function isEmptyOrEmail(value) {
  return value === '' || emailPattern.test(value)
}
