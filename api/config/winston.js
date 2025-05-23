import winston from 'winston'
import winstonDaily from 'winston-daily-rotate-file'

import { getClientIP } from '../utils/util.js'

const logDir = 'logs'  // logs 디렉토리 하위에 로그 파일 저장
const { combine, timestamp, printf } = winston.format

// Define log format
const logFormat = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`
})

export const reqFormat = (req) => {
    const headers = req.headers
    let referer = ' '
    if (headers.referer) {
        referer = headers.referer
    }
    const ip = getClientIP(req)
    let info
    try {
        info = ip + '-' + req.method + '-' + decodeURI(req.originalUrl) + '-' + referer + '-' + headers['user-agent']
    } catch (err) {
        info = ip + '-' + req.method + '-' + req.originalUrl + '-' + referer + '-' + headers['user-agent']
        logger.error(err + ' ' + info)
    }
    return info
}
/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
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
});

// Production 환경이 아닌 경우(dev 등) 
//if (process.env.NODE_ENV !== 'production') {
//    logger.add(new winston.transports.Console({
//        format: winston.format.combine(
//            winston.format.colorize(),  // 색깔 넣어서 출력
//            winston.format.simple(),  // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
//        )
//    }));
//}
