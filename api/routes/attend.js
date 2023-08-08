import express from 'express'
import { search } from '../controllers/attend.js'
import { verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

/**
 * @swagger
 * paths:
 *  /attend/search:
 *   get:
 *      tags: [Attend]
 *      summary: 
 *      parameters:
 *          - in: query
 *            name: name
 *            type: string
 *          - in: query
 *            name: startDate
 *            type: string
 *          - in: query
 *            name: endDate
 *            type: string
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
router.get('/search', verifyUser, search)

export default router