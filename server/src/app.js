import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { env } from './config/env.js'
import { corsOptions } from './config/cors.js'
import routes from './routes/index.js'
import requestLogger from './middleware/requestLogger.js'
import notFound from './middleware/notFound.js'
import errorHandler from './middleware/errorHandler.js'

const app = express()

// Response header se "X-Powered-By: Express" hata deta hai
app.disable('x-powered-by')

// Hosting (Render) ke proxy ke peeche asli client IP dekhne ke liye (rate limit ke kaam aata hai)
app.set('trust proxy', env.trustProxy)

// Security headers (clickjacking, MIME sniffing, etc. se bachav)
app.use(helmet())

// Request ka chhota log (method, path, status, time)
app.use(requestLogger)

// Sirf allowed websites browser se API call kar sakti hain
app.use(cors(corsOptions))

// JSON body padhne ke liye. 10kb se bada body reject hoga (inquiry form isse bahut chhota hai)
app.use(express.json({ limit: '10kb' }))

// Saare API routes /api se shuru honge
app.use('/api', routes)

// Order zaroori hai: pehle routes, phir 404, sabse aakhir mein error handler
app.use(notFound)
app.use(errorHandler)

export default app