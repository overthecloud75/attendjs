import express from 'express'
import { register, login, logout, setAttend, search } from '../controllers/auth.js'
import { csrfToken } from '../controllers/form.js'
import { verifyUser, verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router()

router.get('/register', csrfToken)
router.post('/register', register)
router.get('/login', csrfToken)
router.post('/login', login)
router.post('/setAttend', verifyUser, setAttend)
router.get('/logout', logout)
router.get('/search', verifyAdmin, search)

export default router