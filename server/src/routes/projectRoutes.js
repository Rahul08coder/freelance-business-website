import { Router } from 'express'
import { getProject, listProjects } from '../controllers/projectController.js'

const router = Router()

// GET /api/projects
router.get('/', listProjects)

// GET /api/projects/:slug
router.get('/:slug', getProject)

export default router