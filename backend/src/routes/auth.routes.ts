import { Router } from 'express'
import { login, getCurrentUser } from '../controllers/auth.controller.js'

const router = Router()

router.post('/auth/login', login)
router.get('/auth/me', getCurrentUser)

export default router