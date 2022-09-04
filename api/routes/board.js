import express from 'express'
import { search, write, deleteBoard } from '../controllers/board.js'

const router = express.Router()

router.get('/search', search)
router.post('/write', write)
router.delete('/delete', deleteBoard)

export default router