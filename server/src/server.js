import app from './app.js'
import { env } from './config/env.js'

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

// Ctrl+C ya hosting restart par server ko aaram se band karo
function shutdown(signal) {
  console.log(`${signal} received. Closing server...`)
  server.close(() => process.exit(0))
  // 10 second mein band na ho toh zabardasti band karo
  setTimeout(() => process.exit(1), 10000).unref()
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))