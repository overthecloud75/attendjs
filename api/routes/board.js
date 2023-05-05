import express from 'express'
import { search, write, deleteBoard } from '../controllers/board.js'
import { verifyUser, verifyIP } from '../utils/verifyToken.js'

const router = express.Router()

router.get('/search', verifyIP, search)
router.post('/write', verifyUser, write)
router.post('/delete', verifyUser, deleteBoard)

export default router