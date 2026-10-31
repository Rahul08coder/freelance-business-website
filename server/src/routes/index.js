import { Router } from 'express'
import healthRoutes from './healthRoutes.js'

const router = Router()

// Saare routes yahan jodte jayenge. Abhi sirf health hai.
router.use('/health', healthRoutes)

export default router