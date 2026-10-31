import net from 'node:net'

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

function requireEnv(name) {
  const value = process.env[name]
  if (!value || !value.trim()) {
    throw new Error(
      `Missing required environment variable: ${name}. Add it to server/.env (see .env.example).`
    )
  }
  return value.trim()
}

function readMongoUri() {
  const uri = requireEnv('MONGODB_URI')

  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    throw new Error('MONGODB_URI must start with mongodb:// or mongodb+srv://')
  }
  if (uri.includes('<') || uri.includes('>')) {
    throw new Error(
      'MONGODB_URI still has <...> placeholder text. Replace <db_password> with your real password (remove the < > brackets too).'
    )
  }
  return uri
}

function readDbName(isProduction) {
  const name = process.env.MONGODB_DB_NAME
  if (name && name.trim()) return name.trim()

  // Production mein galti se dev database use na ho, isliye naam zaroor dena padega
  if (isProduction) {
    throw new Error('Missing required environment variable: MONGODB_DB_NAME')
  }
  return 'devlance_dev'
}

// Optional: DNS servers ki list, jaise "8.8.8.8,1.1.1.1". Khaali ho toh system ka DNS chalega.
function readDnsServers() {
  const raw = process.env.DNS_SERVERS
  if (!raw || !raw.trim()) return []

  const servers = raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  const invalid = servers.find((item) => net.isIP(item) === 0)
  if (invalid) {
    throw new Error(`Invalid DNS_SERVERS value: "${invalid}". Use IP addresses like 8.8.8.8,1.1.1.1`)
  }
  return servers
}

const nodeEnv = process.env.NODE_ENV || 'development'
const isProduction = nodeEnv === 'production'

export const env = {
  nodeEnv,
  isProduction,
  port: readPort(),
  mongodbUri: readMongoUri(),
  mongodbDbName: readDbName(isProduction),
  dnsServers: readDnsServers(),
}