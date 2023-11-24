import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import csrf from 'csurf'

import { logger, reqFormat } from './config/winston.js'
import authRoute from './routes/auth.js'
import usersRoute from './routes/users.js'
import wifiRoute from './routes/wifi.js'
import gpsRoute from './routes/gps.js'
import attendRoute from './routes/attend.js'
import summaryRoute from './routes/summary.js'
import eventRoute from './routes/event.js'
import deviceRoute from './routes/device.js'
import locationRoute from './routes/location.js'
import employeeRoute from './routes/employee.js'
import approvalRoute from './routes/approval.js'
import boardRoute from './routes/board.js'
import reportRoute from './routes/report.js'
import confirmRoute from './routes/confirm.js'
import swaggerRoute from './routes/swagger.js'

const app = express()
dotenv.config()

app.set('trust proxy', process.env.TRUST_PROXY)
const connect = async () => {
    try {
        await mongoose.connect(
            process.env.MONGOURL, {
            dbName: process.env.MONGODB, auth: {username: process.env.MONGOUSER, password: process.env.MONGOPWD}
        })
        logger.info('Connected to mongoDB.')
    } catch (err) {
        logger.error(err)
        process.exit(1)
    }
}

mongoose.connection.on('disconnected', () => {
    logger.info('mongoDB disconnected!')
})

mongoose.connection.on('connected', () => {
    logger.info('mongoDB connected!')
})

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// middlewares
app.use(limiter) // Apply the rate limiting middleware to all requests
app.use(cookieParser())
app.use(express.json())
app.use(csrf({ cookie: true }))
app.use(cors({ origin: [
    'http://localhost:3000',
    process.env.DOMAIN
    ]}
))
app.use((req, res, next) => {
    logger.info(reqFormat(req))
    next()
})
app.use('/api/auth', authRoute)
app.use('/api/users', usersRoute)
app.use('/api/attend', attendRoute)
app.use('/api/wifi-attend', wifiRoute)
app.use('/api/gps-attend', gpsRoute)
app.use('/api/summary', summaryRoute)
app.use('/api/event', eventRoute)
app.use('/api/location', locationRoute)
app.use('/api/device', deviceRoute)
app.use('/api/employee', employeeRoute)
app.use('/api/approval', approvalRoute)
app.use('/api/board', boardRoute)
app.use('/api/report', reportRoute)
app.use('/api/confirm', confirmRoute)
app.use('/swagger', swaggerRoute)

app.use((err, req, res, next) => {
    console.log(req)
    console.log(err)
    const errorStatus = err.status || 500
    const errorMessage = err.message || 'Something went wrong!'
    if (err.status === 500) {
        logger.error(err)
    }
    return res.status(errorStatus).json({
        message: errorMessage
    })
})

app.listen(8888, () => {
    connect()
    logger.info('Connected to backend.')
})