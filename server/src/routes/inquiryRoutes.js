import { Router } from 'express'
import { createInquiry } from '../controllers/inquiryController.js'
import { inquiryLimiter } from '../middleware/rateLimiters.js'

const router = Router()

// POST /api/inquiries  (sirf likhna. Public se padhne ka koi route nahi hai.)
router.post('/', inquiryLimiter, createInquiry)

export default router