// Koi route match na ho toh yeh chalta hai. HTML ki jagah JSON error deta hai.
export default function notFound(req, res) {
  res.status(404).json({
    success: false,
    error: { message: 'Route not found.' },
  })
}