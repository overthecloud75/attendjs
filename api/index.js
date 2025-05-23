import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import csrf from 'csurf'

import { logger, reqFormat } from './config/winston.js'
import pingRoute from './routes/ping.js'
import authRoute from './routes/auth.js'
import usersRoute from './routes/users.js'
import wifiRoute from './routes/wifi.js'
import gpsRoute from './routes/gps.js'
import attendRoute from './routes/attend.js'
import summaryRoute from './routes/summary.js'
import eventRoute from './routes/event.js'
import deviceRoute from './routes/device.js'
import creditcardRoute from './routes/creditcard.js'
import locationRoute from './routes/location.js'
import employeeRoute from './routes/employee.js'
import approvalRoute from './routes/approval.js'
import paymentRoute from './routes/payment.js'
import boardRoute from './routes/board.js'
import confirmRoute from './routes/confirm.js'
import uploadRoute from './routes/upload.js'
import chatRoute from './routes/chat.js'
import swaggerRoute from './routes/swagger.js'
import { getClientIP } from './utils/util.js'

dotenv.config()
const app = express()

const connect = async () => {
    try {
        await mongoose.connect(
            process.env.MONGOURL, {
            dbName: process.env.MONGODB, auth: {username: process.env.MONGOUSER, password: process.env.MONGOPWD}
        })
        logger.warn('Connected to mongoDB.')
    } catch (err) {
        logger.error(err)
        process.exit(1)
    }
}

mongoose.connection.on('disconnected', () => {
    logger.warn('mongoDB disconnected!')
})

mongoose.connection.on('connected', () => {
    logger.warn('mongoDB connected!')
})

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 2 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req, res) => getClientIP(req)
})
// middlewares
app.use(limiter) // Apply the rate limiting middleware to all requests
app.use(cookieParser())
app.use(express.json())

const csrfProtection = csrf({ cookie: true })

app.use((req, res, next) => {
    const exemptPaths = ['/api/auth/setAttend', '/api/auth/callback']
    if (exemptPaths.includes(req.path)) {
        return next()
    } 
    csrfProtection(req, res, next)
})

app.use(cors({ origin: [
    process.env.DOMAIN
    ]}
))
app.use((req, res, next) => {
    logger.info(reqFormat(req))
    next()
})

app.use('/', pingRoute)
app.use('/api/auth', authRoute)
app.use('/api/users', usersRoute)
app.use('/api/attend', attendRoute)
app.use('/api/wifi-attend', wifiRoute)
app.use('/api/gps-attend', gpsRoute)
app.use('/api/summary', summaryRoute)
app.use('/api/event', eventRoute)
app.use('/api/location', locationRoute)
app.use('/api/device', deviceRoute)
app.use('/api/creditcard', creditcardRoute)
app.use('/api/employee', employeeRoute)
app.use('/api/approval', approvalRoute)
app.use('/api/payment', paymentRoute)
app.use('/api/board', boardRoute)
app.use('/api/confirm', confirmRoute)
app.use('/api/upload', uploadRoute)
app.use('/api/chat', chatRoute)
app.use('/swagger', swaggerRoute)

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    let errorMessage = err.status === 500 ? 'Something went wrong!' : err.message || 'Something went wrong'
    logger.error(reqFormat(req) + '-' + errorStatus + '-' + err)
    return res.status(errorStatus).json({ message: errorMessage })
})

app.listen(8888, () => {
    connect()
    logger.warn('Connected to backend.')
})