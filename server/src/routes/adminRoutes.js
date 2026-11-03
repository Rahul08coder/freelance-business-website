import { Router } from 'express'
import { getMe, login, logout } from '../controllers/adminAuthController.js'
import requireAdmin from '../middleware/requireAdmin.js'
import requireCsrf from '../middleware/requireCsrf.js'
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

// Day 20 se yahan dashboard, inquiries, projects, services ke routes jodenge.
// Niyam: GET se kabhi koi badlaav nahi. Badlaav sirf POST, PATCH, DELETE se.

export default router