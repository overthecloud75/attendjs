import express from 'express'
import { search } from '../controllers/summary.js'
import { verifyIP } from '../utils/verifyToken.js'

const router = express.Router()

/**
 * @swagger
 * paths:
 *  /api/summary/search:
 *   get:
 *      tags: [Summary]
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
 *
 */

router.get('/search', verifyIP, search)

export default router