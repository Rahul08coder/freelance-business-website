// "business-website" ko "Business website" jaisa dikhata hai
export function prettySlug(slug) {
  const text = String(slug).replace(/-/g, ' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// options list mein se value ka label deta hai (na mile toh value hi)
export function labelFor(options, value) {
  return options.find((option) => option.value === value)?.label ?? value
}

// Link sirf http ya https ho tabhi clickable banao ("javascript:..." jaise links nahi)
export function isHttpUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}