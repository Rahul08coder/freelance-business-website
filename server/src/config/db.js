import dns from 'node:dns'
import mongoose from 'mongoose'
import { env } from './env.js'

const stateNames = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
}

// Connection URI ko kabhi log nahi karte (usme password hota hai).
export async function connectDB() {
  // Agar network ka DNS Atlas ka SRV address resolve nahi karta, toh .env mein DNS_SERVERS do
  if (env.dnsServers.length > 0) {
    dns.setServers(env.dnsServers)
    console.log(`Using custom DNS servers: ${env.dnsServers.join(', ')}`)
  }

  mongoose.connection.on('connected', () => {
    console.log(`MongoDB connected (database: ${mongoose.connection.name})`)
  })
  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected')
  })
  mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error.message)
  })

  await mongoose.connect(env.mongodbUri, {
    dbName: env.mongodbDbName,
    // Atlas tak 10 second mein na pahunche toh error do (warna bahut der atka rehta hai)
    serverSelectionTimeoutMS: 10000,
  })
}

export async function disconnectDB() {
  await mongoose.connection.close()
}

// 'connected', 'disconnected', 'connecting' ya 'disconnecting'
export function getDbStatus() {
  return stateNames[mongoose.connection.readyState] || 'unknown'
}

// Common galtiyon ke liye seedha hint deta hai
export function explainConnectionError(error) {
  const message = String(error?.message || '')

  if (/bad auth|authentication failed/i.test(message)) {
    return 'Hint: Username ya password galat hai. Atlas ke Database Access mein check karo. Password mein special characters (@ : / #) hain toh woh connection string mein URL-encode karne padte hain.'
  }
  if (/ECONNREFUSED|ETIMEOUT/i.test(message)) {
    return 'Hint: DNS lookup fail hua. Tumhare network ka DNS Atlas ka address resolve nahi kar raha. Fix: Windows ka DNS 8.8.8.8 set karo, ya server/.env mein DNS_SERVERS=8.8.8.8,1.1.1.1 jodo, ya mobile hotspot par try karo.'
  }
  if (/ENOTFOUND/i.test(message)) {
    return 'Hint: Cluster ka address nahi mila. MONGODB_URI ka host part (...mongodb.net) check karo, aur internet chal raha hai ya nahi dekho.'
  }
  if (error?.name === 'MongooseServerSelectionError') {
    return 'Hint: Atlas tak pahunch nahi paye. Network Access mein tumhara current IP add hai? Cluster running hai? Internet chal raha hai?'
  }
  return ''
}