import { HttpError } from '../utils/HttpError.js'

// MongoDB ObjectId: bilkul 24 hex characters (0-9, a-f)
const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/

// Route mein use: router.get('/inquiries/:id', validateObjectId(), handler)
// Galat format ka id database tak pahunchta hi nahi (400). Sahi format par na mile toh 404 handler dega.
export default function validateObjectId(paramName = 'id') {
  return function checkObjectId(req, res, next) {
    const value = req.params[paramName]

    if (typeof value !== 'string' || !OBJECT_ID_PATTERN.test(value)) {
      throw new HttpError(400, 'Invalid id.')
    }

    next()
  }
}