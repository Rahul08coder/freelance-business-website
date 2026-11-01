// Har request ka sirf: METHOD /path status time. Jaise: GET /api/projects 200 12ms
// Jaanbujhkar log NAHI karte: body, query string, headers, cookies, passwords.
export default function requestLogger(req, res, next) {
  const path = req.originalUrl.split('?')[0]

  // Hosting har kuch second health check karti hai, uska log nahi chahiye
  if (path === '/api/health') {
    return next()
  }

  const start = process.hrtime.bigint()

  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6
    console.log(`${req.method} ${path} ${res.statusCode} ${ms.toFixed(0)}ms`)
  })

  next()
}