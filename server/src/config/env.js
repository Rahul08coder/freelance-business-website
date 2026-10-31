// .env se values padhta hai aur check karta hai ki sahi hain.
// Baaki files seedha process.env nahi padhengi, sab yahin se import karengi.

function readPort() {
  const raw = process.env.PORT
  if (!raw) return 5000

  const port = Number(raw)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT value: "${raw}". Use a number between 1 and 65535.`)
  }
  return port
}

const nodeEnv = process.env.NODE_ENV || 'development'

export const env = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  port: readPort(),
}