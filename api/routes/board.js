import express from 'express'
import { search, write, deleteBoard } from '../controllers/board.js'
import { verifyIP } from '../utils/verifyToken.js'

const router = express.Router()

router.get('/search', verifyIP, search)
router.post('/write', verifyIP, write)
router.post('/delete', verifyIP, deleteBoard)

export default router