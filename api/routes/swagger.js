import express from 'express'
import { swaggerUi, specs } from '../utils/swagger.js'
import { verifyIP } from '../utils/verifyToken.js'

const router = express.Router()

router.use('/', swaggerUi.serve)
router.get('/', verifyIP,  swaggerUi.setup(specs))

export default router

