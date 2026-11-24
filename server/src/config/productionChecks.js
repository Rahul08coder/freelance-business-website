import { env } from './env.js'

function isLocalOrigin(origin) {
  return origin.includes('localhost') || origin.includes('127.0.0.1')
}

// Production mein start hone se pehle galtiyan pakadta hai.
// Badi galti par server start hi nahi hota. Chhoti par saaf warning aati hai.
export function runProductionChecks() {
  if (!env.isProduction) return

  // Asli data wale server par galti se dev ya test database na lag jaye
  if (/(_dev|_test)$/.test(env.mongodbDbName)) {
    throw new Error(
      `Refusing to start in production: MONGODB_DB_NAME "${env.mongodbDbName}" looks like a development or test database.`
    )
  }

  const warnings = []

  if (env.trustProxy === 0) {
    warnings.push(
      'TRUST_PROXY is 0. Behind a hosting proxy (like Render) set it to 1, otherwise rate limits count the proxy instead of each visitor.'
    )
  }
  if (env.clientOrigins.some(isLocalOrigin)) {
    warnings.push('CLIENT_ORIGINS contains localhost. Use only your real website address in production.')
  }
  if (env.dnsServers.length > 0) {
    warnings.push('DNS_SERVERS is set. It is meant only for local development.')
  }

  warnings.forEach((message) => console.warn(`[security warning] ${message}`))
}