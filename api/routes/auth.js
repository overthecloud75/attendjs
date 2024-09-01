import express from 'express'
import { register, login, password, logout, setAttend, search } from '../controllers/auth.js'
import { csrfToken } from '../controllers/form.js'
import { verifyUser, verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router()

router.get('/register', csrfToken)
router.post('/register', register)

/**
 * @swagger
 * paths:
 *  /auth/login:
 *   get:
 *      tags: [Auth]
 *      summary: 
 *      responses:
 *          200:
 *           description: succ
 *           content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status:
 *                              type: string
 */
router.get('/login', csrfToken)

/**
 * @swagger
 * paths:
 *  /auth/login:
 *   post:
 *      tags: [Auth]
 *      summary:
 *      parameters:
 *          - in: header
 *            name: X-CSRF-Token
 *          - in: body
 *            name: body
 *            schema:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                  password:
 *                      type: string
 *      responses:
 *          200:
 *           description: succ
 *           content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status:
 *                              type: string
 */
router.post('/login', login)

/**
 * @swagger
 * paths:
 *  /auth/password:
 *   get:
 *      tags: [Auth]
 *      summary: 
 *      responses:
 *          200:
 *           description: succ
 *           content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status:
 *                              type: string
 */
router.get('/password', csrfToken)

/**
 * @swagger
 * paths:
 *  /auth/password:
 *   post:
 *      tags: [Auth]
 *      summary:
 *      parameters:
 *          - in: header
 *            name: X-CSRF-Token
 *          - in: body
 *            name: body
 *            schema:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                  password:
 *                      type: string
 *      responses:
 *          200:
 *           description: succ
 *           content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status:
 *                              type: string
 */
router.post('/password', verifyUser, password)

/**
 * @swagger
 * paths:
 *  /auth/logout:
 *   get:
 *      tags: [Auth]
 *      summary:
 *      responses:
 *          200:
 *           description: succ
 *           content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status:
 *                              type: string
 */
router.get('/logout', logout)
router.post('/setAttend', verifyUser, setAttend)
router.get('/search', verifyAdmin, search)

export default router