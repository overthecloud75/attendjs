import winston from 'winston'
import winstonDaily from 'winston-daily-rotate-file'

import { getClientIP } from '../utils/util.js'

const logDir = 'logs'  // logs 디렉토리 하위에 로그 파일 저장
const { combine, timestamp, printf } = winston.format

// Define log format
const logFormat = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`
})

export const accessLogFormat = (req, res, duration) => {
    const headers = req.headers
    let referer = ''
    if (headers.referer) {
        referer = headers.referer
    }
    const ip = getClientIP(req)
    let info
    try {
        info = `${res.statusCode} - ${ip} - ${req.method} - ${decodeURI(req.originalUrl)} - ${referer} - ${headers['user-agent']} - ${duration}`
    } catch (err) {
        info = `${res.statusCode} - ${ip} - ${req.method} - ${req.originalUrl} - ${referer} - ${headers['user-agent']} - ${duration}`
        logger.error(`${err} ${info}`)
    }
    return info
}

export const logger = winston.createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat,
    ),
    transports: [
        // info 레벨 로그를 저장할 파일 설정
        new winstonDaily({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `%DATE%.log`,
            maxFiles: 30,  // 30일치 로그 파일 저장
            zippedArchive: true, 
        }),
        // error 레벨 로그를 저장할 파일 설정
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,  // error.log 파일은 /logs/error 하위에 저장 
            filename: `%DATE%.error.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
    ],
})
