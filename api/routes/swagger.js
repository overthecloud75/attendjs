import express from 'express'
import { swaggerUi, specs } from '../utils/swagger.js'
import { verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

router.use('/', swaggerUi.serve)
router.get('/', verifyUser,  swaggerUi.setup(specs))

export default router

