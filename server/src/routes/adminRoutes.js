import { Router } from 'express'
import { getMe, login, logout } from '../controllers/adminAuthController.js'
import requireAdmin from '../middleware/requireAdmin.js'
import { loginLimiter } from '../middleware/rateLimiters.js'

const router = Router()

// Admin ke jawab kabhi cache nahi hone chahiye
router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

// Ye do login ke bina chalte hain
router.post('/login', loginLimiter, login)
router.post('/logout', logout)

// Iske neeche ka har route login maangta hai
router.use(requireAdmin)

router.get('/me', getMe)

// Day 20 se yahan dashboard, inquiries, projects, services ke routes jodenge.

export default router