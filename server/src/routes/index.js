import { Router } from 'express'
import healthRoutes from './healthRoutes.js'
import serviceRoutes from './serviceRoutes.js'
import projectRoutes from './projectRoutes.js'
import { apiLimiter } from '../middleware/rateLimiters.js'

const router = Router()

// Health par rate limit nahi, kyunki hosting ise baar-baar check karti hai
router.use('/health', healthRoutes)

// Iske neeche ke saare API routes par rate limit lagega
router.use(apiLimiter)

// Public routes
router.use('/services', serviceRoutes)
router.use('/projects', projectRoutes)

// Naye routes (inquiries, admin) yahin niche jodte jayenge.

export default router