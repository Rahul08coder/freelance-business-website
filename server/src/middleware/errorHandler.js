import { env } from '../config/env.js'

const GENERIC_MESSAGE = 'Something went wrong on the server.'

// Alag-alag tarah ke errors ko ek hi format mein badalta hai: { status, message, details? }
function normalizeError(err) {
  // 1. Galat JSON body
  if (err.type === 'entity.parse.failed') {
    return { status: 400, message: 'Request body is not valid JSON.' }
  }

  // 2. Bahut bada body (express.json ki limit se zyada)
  if (err.type === 'entity.too.large') {
    return { status: 413, message: 'Request body is too large.' }
  }

  // 3. Mongoose validation (schema ke rules tootna)
  if (err.name === 'ValidationError' && err.errors) {
    const details = Object.values(err.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }))
    return { status: 400, message: 'Validation failed.', details }
  }

  // 4. Galat ID format (jaise /projects/abc jahan ObjectId chahiye)
  if (err.name === 'CastError') {
    const message = err.path === '_id' ? 'Invalid id.' : `Invalid value for "${err.path}".`
    return { status: 400, message }
  }

  // 5. Duplicate (unique index tootna)
  if (err.code === 11000) {
    return { status: 409, message: 'This record already exists.' }
  }

  // 6. Hamare apne HttpError aur baaki 4xx errors
  const status = err.statusCode || err.status
  if (Number.isInteger(status) && status >= 400 && status < 500) {
    return { status, message: err.message, details: err.details }
  }

  // 7. Baaki sab: server ki galti. Andar ki baat bahar nahi jati.
  return { status: 500, message: GENERIC_MESSAGE }
}

// Express ko pata chalta hai ki yeh error handler hai kyunki isme 4 parameters hain.
// `next` use na bhi ho, tab bhi likhna zaroori hai.
export default function errorHandler(err, req, res, next) {
  // Jawab bhejna shuru ho chuka ho toh Express ke default handler ko do
  if (res.headersSent) {
    return next(err)
  }

  const { status, message, details } = normalizeError(err)

  // Server ki galti ho toh poora error sirf terminal mein dikhao (client ko nahi)
  if (status >= 500) {
    console.error(err)
  }

  res.status(status).json({
    success: false,
    error: {
      message,
      ...(details ? { details } : {}),
    },
    // Sirf development mein: 500 ka asli kaaran (debugging ke liye)
    ...(!env.isProduction && status >= 500 ? { debug: err.message } : {}),
  })
}