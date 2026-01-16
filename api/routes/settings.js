import express from 'express'
import { getGeneralSettings, updateGeneralSettings } from '../controllers/settings.js'
import { verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router()

// GET /api/settings/general
router.get('/general', verifyAdmin, getGeneralSettings)

// PUT /api/settings/general
router.put('/general', verifyAdmin, updateGeneralSettings)

export default router
