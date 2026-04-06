import winston from 'winston'
import winstonDaily from 'winston-daily-rotate-file'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { getClientIP } from '../utils/util.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const logDir = path.join(__dirname, '..', 'logs')

// logs 디렉토리가 없으면 생성
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
}

// console.log(`[Winston] Log Directory: ${logDir}`)

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
        new winstonDaily({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `%DATE%.log`,
            maxFiles: 30,
            zippedArchive: true, 
        }),
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `%DATE%.error.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
    ],
})

// 에이전트 전용 로그 포맷 (질문, 전문가 관찰, 지능형 취합 답변을 단계별로 기록)
const agentFormat = printf(rawInfo => {
    // If winston wrapped the object inside message, extract it
    const info = (typeof rawInfo.message === 'object' && rawInfo.message !== null) ? { ...rawInfo, ...rawInfo.message } : rawInfo;
    const { timestamp, level, sessionId, agentTrail, intent, command, toolUsed, toolArgs, llmRaw, observation, requestPayload, responsePayload, durationMs, message } = info;
    const sessionStr = sessionId ? `[Session: ${sessionId}] ` : '';
    const agentStr = (agentTrail && Array.isArray(agentTrail)) ? `[Agent: ${agentTrail.join(' -> ')}] ` : (agentTrail ? `[${agentTrail}] ` : '');
    const levelStr = level.toUpperCase();
    
    // 1. 단순 메시지 (필수 정보가 하나도 없을 때만 출력하고 종료)
    if (!command && !requestPayload && !llmRaw && !observation && !toolUsed && typeof message === 'string') {
        const trailPre = agentStr ? agentStr : '';
        return `${timestamp} ${levelStr}: ${sessionStr}${trailPre}${message}\n`;
    }

    let output = '';

    // 2. [Q] 질문 라인 (커멘드가 있을 때만 표시)
    if (command) {
        output += `${timestamp} ${levelStr}: ${sessionStr}${agentStr}[Intent: ${intent || 'NONE'}] [Q: ${command}] [Duration: ${durationMs || 0}ms]\n`;
    } else if (message && typeof message === 'string' && !observation && !llmRaw) {
        output += `${timestamp} ${levelStr}: ${sessionStr}${agentStr}${message}\n`;
    }
    
    // 3. [LLM_REQ]
    if (requestPayload) {
        const model = requestPayload.model || 'unknown';
        const msgs = Array.isArray(requestPayload.messages) ? JSON.stringify(requestPayload.messages) : requestPayload.messages;
        output += `${timestamp} ${levelStr}: ${sessionStr}${agentStr}[LLM_REQ: ${model}] ${msgs}\n`;
    }
    
    // 4. [LLM_RES]
    if (llmRaw) {
        const usage = (responsePayload && responsePayload.usage) ? ` [Usage: ${JSON.stringify(responsePayload.usage)}]` : '';
        const resContent = typeof llmRaw === 'object' ? JSON.stringify(llmRaw) : llmRaw;
        output += `${timestamp} ${levelStr}: ${sessionStr}${agentStr}[LLM_RES] ${resContent}${usage}\n`;
    }

    // 5. [OBSERVATION] (도구 실행 결과)
    if (observation) {
        const toolLabel = toolUsed ? ` (${toolUsed})` : '';
        output += `${timestamp} ${levelStr}: ${sessionStr}${agentStr}[OBSERVATION]${toolLabel} Raw Data: ${observation}\n`;
    }

    // 6. [TOOL_CALL] (도구 호출 시점만 출력, 결과 시점에는 observation이 있으므로 스킵)
    if (toolUsed && !observation) {
        output += `${timestamp} ${levelStr}: ${sessionStr}${agentStr}[TOOL_CALL: ${toolUsed}] ${JSON.stringify(toolArgs || {})}\n`;
    }

    // 7. [A: Synthesis]
    if (responsePayload && responsePayload.content) {
        output += `${timestamp} ${levelStr}: ${sessionStr}${agentStr}[A: Synthesis] ${responsePayload.content}\n`;
    }

    return output;
});


export const agentLogger = winston.createLogger({
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        agentFormat
    ),
    transports: [
        new winstonDaily({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `agent-%DATE%.log`,
            maxFiles: 30,
            zippedArchive: true,
        })
    ]
})
