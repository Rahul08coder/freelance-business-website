import { HttpError } from '../utils/HttpError.js'

const MAX_DEPTH = 10

// Body ke andar kisi bhi gehrai par "$" se shuru hone wala naam (jaise $where, $gt, $ne) ya __proto__
// ho toh true. Ye MongoDB operators ya object ke andar chhed-chhaad ki koshish hoti hai.
// Sirf NAAM dekhe jate hain. Text value mein "$" hona bilkul theek hai.
function hasUnsafeKey(value, depth = 0) {
  if (depth > MAX_DEPTH) return true // bahut gehra nested: shak

  if (Array.isArray(value)) {
    return value.some((item) => hasUnsafeKey(item, depth + 1))
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).some(
      ([key, inner]) => key.startsWith('$') || key === '__proto__' || hasUnsafeKey(inner, depth + 1)
    )
  }

  return false
}

// Doosra layer. Zod aur schemas pehle se anjaan fields hata dete hain,
// par ye aise body ko shuru mein hi rok deta hai.
export default function blockOperatorKeys(req, res, next) {
  if (hasUnsafeKey(req.body)) {
    throw new HttpError(400, 'Request contains field names that are not allowed.')
  }
  next()
}