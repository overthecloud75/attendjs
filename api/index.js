import express from 'express'
import { logger } from './config/winston.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import csrf from 'csurf'

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
import boardRoute from './routes/board.js'
import reportRoute from './routes/report.js'
import confirmRoute from './routes/confirm.js'

const app = express()
dotenv.config()

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO)
        logger.info('Connected to mongoDB.')
    } catch (error) {
        console.log(error)
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
app.use('/api/board', boardRoute)
app.use('/api/report', reportRoute)
app.use('/api/confirm', confirmRoute)

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || 'Something went wrong!'
    if (err.status === 500) {
        logger.error(err.stack)
    }
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage
    })
})

app.listen(8888, () => {
    connect()
    logger.info('Connected to backend.')
})