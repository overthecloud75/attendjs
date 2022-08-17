import express from 'express'
import { search } from '../controllers/summary.js'

const router = express.Router()

router.get('/search', search)

export default router