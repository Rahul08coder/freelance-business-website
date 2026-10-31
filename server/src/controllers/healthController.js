import { getDbStatus } from '../config/db.js'

// Health check: server aur database dono theek hain ya nahi.
export function getHealth(req, res) {
  const database = getDbStatus()

  // Database na chal raha ho toh 503 (Service Unavailable). Hosting platforms isi se pehchante hain.
  if (database !== 'connected') {
    return res.status(503).json({
      success: false,
      error: { message: 'Database is not connected.' },
    })
  }

  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      database,
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
  })
}