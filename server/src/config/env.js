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

// Kaun si websites browser se is API ko call kar sakti hain.
function readClientOrigins(isProduction) {
  const raw = process.env.CLIENT_ORIGINS

  if (!raw || !raw.trim()) {
    // Production mein jaanbujhkar default nahi: galti se sab khula na rahe
    if (isProduction) {
      throw new Error('Missing required environment variable: CLIENT_ORIGINS')
    }
    return ['http://localhost:5173']
  }

  const origins = raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  origins.forEach((origin) => {
    let url
    try {
      url = new URL(origin)
    } catch {
      throw new Error(`Invalid CLIENT_ORIGINS entry: "${origin}". Example: https://example.com`)
    }

    const isHttp = url.protocol === 'http:' || url.protocol === 'https:'
    if (!isHttp || url.origin !== origin) {
      throw new Error(
        `Invalid CLIENT_ORIGINS entry: "${origin}". Use only scheme, host and port, like https://example.com (no trailing slash, no path, no *).`
      )
    }

    const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1'
    if (isProduction && url.protocol !== 'https:' && !isLocalhost) {
      throw new Error(`In production, CLIENT_ORIGINS must use https: "${origin}"`)
    }
  })

  return origins
}

// Server ke aage kitne proxy (hosting ke) hain. Rate limit ko asli client IP dekhne ke liye chahiye.
function readTrustProxy() {
  const raw = process.env.TRUST_PROXY
  if (!raw || !raw.trim()) return 0

  const value = Number(raw)
  if (!Number.isInteger(value) || value < 0 || value > 5) {
    throw new Error(`Invalid TRUST_PROXY value: "${raw}". Use a whole number from 0 to 5.`)
  }
  return value
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
  clientOrigins: readClientOrigins(isProduction),
  trustProxy: readTrustProxy(),
}