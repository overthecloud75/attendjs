import express from 'express'
import { search, update, write, deleteEmployee } from '../controllers/employee.js'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

router.get('/search', verifyUser, search)
router.post('/update', verifyAdmin, update)
router.post('/write', verifyAdmin, write)
router.post('/delete', verifyAdmin, deleteEmployee)

export default router