import { Router } from 'express'
import { getPublicSettings } from '../controllers/settingsController.js'

const router = Router()

// GET /api/settings
router.get('/', getPublicSettings)

export default router