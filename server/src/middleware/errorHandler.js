import { env } from '../config/env.js'

// Express ko pata chalta hai ki yeh error handler hai kyunki isme 4 parameters hain.
// `next` use na bhi ho, tab bhi likhna zaroori hai.
export default function errorHandler(err, req, res, next) {
  // Jawab bhejna shuru ho chuka ho toh Express ke default handler ko do
  if (res.headersSent) {
    return next(err)
  }

  const status = err.statusCode || err.status || 500

  // Server ki galti ho toh poora error terminal mein dikhao (client ko nahi)
  if (status >= 500) {
    console.error(err)
  }

  // 4xx errors ka message client ko dikhana theek hai.
  // 5xx errors ka andar ka detail kabhi bahar nahi jana chahiye.
  const message = status < 500 ? err.message : 'Something went wrong on the server.'

  res.status(status).json({
    success: false,
    error: { message },
    ...(env.isProduction ? {} : { debug: status >= 500 ? err.message : undefined }),
  })
}