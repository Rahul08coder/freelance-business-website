import app from './app.js'
import { env } from './config/env.js'
import { connectDB, disconnectDB, explainConnectionError } from './config/db.js'

async function start() {
  // Pehle database. Connect na ho toh server start hi nahi karte.
  try {
    await connectDB()
  } catch (error) {
    console.error('Could not connect to MongoDB.')
    console.error(error.message)
    const hint = explainConnectionError(error)
    if (hint) console.error(hint)
    process.exit(1)
  }

  const server = app.listen(env.port, () => {
    console.log(`Server running on port ${env.port} (${env.nodeEnv})`)
  })

  // Port pehle se kisi aur ne le rakha ho toh saaf message do
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${env.port} is already in use. Close the other server or change PORT in .env.`)
    } else {
      console.error(error)
    }
    process.exit(1)
  })

  // Ctrl+C ya hosting restart par: pehle server, phir database band karo
  function shutdown(signal) {
    console.log(`${signal} received. Closing server...`)
    server.close(async () => {
      try {
        await disconnectDB()
      } finally {
        process.exit(0)
      }
    })
    // 10 second mein band na ho toh zabardasti band karo
    setTimeout(() => process.exit(1), 10000).unref()
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

start()