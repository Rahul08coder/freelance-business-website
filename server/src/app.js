import express from 'express'
import routes from './routes/index.js'
import notFound from './middleware/notFound.js'
import errorHandler from './middleware/errorHandler.js'

const app = express()

// Response header se "X-Powered-By: Express" hata deta hai (attacker ko hint nahi milta)
app.disable('x-powered-by')

// JSON body padhne ke liye. 10kb se bada body reject hoga (inquiry form isse bahut chhota hai)
app.use(express.json({ limit: '10kb' }))

// Saare API routes /api se shuru honge
app.use('/api', routes)

// Order zaroori hai: pehle routes, phir 404, sabse aakhir mein error handler
app.use(notFound)
app.use(errorHandler)

export default app