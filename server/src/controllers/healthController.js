// Controller ka kaam: request lena, jawab bhejna. (Zyada logic services mein jayega, Day 13+)

export function getHealth(req, res) {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
  })
}