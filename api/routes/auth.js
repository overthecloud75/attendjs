import express from 'express'
import { register, login, logout, search } from '../controllers/auth.js'
import { csrfToken } from '../controllers/form.js'
import { verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router()

router.get('/register', csrfToken)
router.post('/register', register)
router.get('/login', csrfToken)
router.post('/login', login)
router.get('/logout', logout)
router.get('/search', verifyAdmin, search)

export default router