import express from 'express'
import { search, getLeftLeave, getLeftLeaveList } from '../controllers/summary.js'
import { verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

/**
 * @swagger
 * paths:
 *  /summary/search:
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
 */
router.get('/search', verifyUser, search)

/**
 * @swagger
 * paths:
 *  /summary/leftleave:
 *   get:
 *      tags: [Summary]
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
router.get('/leftleave', verifyUser, getLeftLeave)

/**
 * @swagger
 * paths:
 *  /summary/leftleavelist:
 *   get:
 *      tags: [Summary]
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
router.get('/leftleavelist', verifyUser, getLeftLeaveList)

export default router