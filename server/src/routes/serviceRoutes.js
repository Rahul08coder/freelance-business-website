import { Router } from 'express'
import { listServices } from '../controllers/serviceController.js'

const router = Router()

// GET /api/services
router.get('/', listServices)

export default router