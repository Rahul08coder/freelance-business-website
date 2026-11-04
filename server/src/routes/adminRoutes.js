import { Router } from 'express'
import { getMe, login, logout } from '../controllers/adminAuthController.js'
import { getDashboard } from '../controllers/adminDashboardController.js'
import {
  deleteInquiry,
  getInquiry,
  listInquiries,
  updateInquiryStatus,
} from '../controllers/adminInquiryController.js'
import requireAdmin from '../middleware/requireAdmin.js'
import requireCsrf from '../middleware/requireCsrf.js'
import validateObjectId from '../middleware/validateObjectId.js'
import { loginLimiter } from '../middleware/rateLimiters.js'

const router = Router()

// Admin ke jawab kabhi cache nahi hone chahiye
router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

// Login ke bina chalne wala ekmatra route
router.post('/login', loginLimiter, login)

// Iske neeche ka har route: pehle login, phir (badlaav wali requests par) CSRF token
router.use(requireAdmin)
router.use(requireCsrf)

router.post('/logout', logout)
router.get('/me', getMe)
router.get('/dashboard', getDashboard)

// Inquiries
router.get('/inquiries', listInquiries)
router.get('/inquiries/:id', validateObjectId(), getInquiry)
router.patch('/inquiries/:id', validateObjectId(), updateInquiryStatus)
router.delete('/inquiries/:id', validateObjectId(), deleteInquiry)

// Niyam: GET se kabhi koi badlaav nahi. Badlaav sirf POST, PATCH, DELETE se.

export default router