import express from 'express'
import { search, write, deleteBoard } from '../controllers/board.js'
import { verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

router.get('/search', verifyUser, search)
router.post('/write', verifyUser, write)
router.post('/delete', verifyUser, deleteBoard)

export default router