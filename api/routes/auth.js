import express from 'express'
import { register, login, logout } from '../controllers/auth.js'
import { csrfToken } from '../controllers/form.js'

const router = express.Router()

router.get('/register', csrfToken)
router.post('/register', register)
router.get('/login', csrfToken)
router.post('/login', login)
router.get('/logout', logout)

export default router