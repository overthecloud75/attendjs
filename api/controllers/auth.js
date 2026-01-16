import User from '../models/User.js'
import AuthService from '../services/AuthService.js'
import { getClientIP, sanitizeData } from '../utils/util.js'

export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        const message = await AuthService.register(name, email, password)
        res.status(200).send(message)
    } catch (err) {
        next(err)
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password, platform, width, height, token: cloudflareToken } = req.body
        const ip = getClientIP(req)
        const user_agent = req.headers['user-agent']

        const result = await AuthService.login(email, password, platform, width, height, cloudflareToken, ip, user_agent)

        res.cookie('access_token', result.token, {
            httpOnly: true, secure: true, sameSite: 'Strict'
        })
            .status(200)
            .json(result.userData)
    } catch (err) {
        next(err)
    }
}

export const password = async (req, res, next) => {
    try {
        const { email, currentPassword, newPassword } = req.body
        const message = await AuthService.changePassword(email, currentPassword, newPassword)
        res.status(200).send(message)
    } catch (err) {
        next(err)
    }
}

export const lostPassword = async (req, res, next) => {
    try {
        const { email } = req.body
        const message = await AuthService.lostPassword(email)
        res.status(200).send(message)
    } catch (err) {
        next(err)
    }
}

export const passwordWithOtp = async (req, res, next) => {
    try {
        const { email, password, otp, token: cloudflareToken } = req.body
        const ip = getClientIP(req)

        const message = await AuthService.resetPasswordWithOtp(email, password, otp, cloudflareToken, ip)
        res.status(200).send(message)
    } catch (err) {
        next(err)
    }
}

export const logout = async (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json([])
    } catch (err) {
        next(err)
    }
}

export const verifyRegistrationCode = async (req, res, next) => {
    try {
        const { confirmationCode } = req.params;
        const { name, alreadyActive } = await AuthService.verifyRegistrationCode(confirmationCode)
        res.status(200).send(successHtml(name, alreadyActive))
    } catch (err) {
        next(err)
    }
}

export const setAttend = async (req, res, next) => {
    try {
        const ip = getClientIP(req)
        const user_agent = req.headers['user-agent']

        const user = await AuthService.getUserByEmail(req.user.email)
        const where = await AuthService.updateLogin(user, ip, user_agent, req.body.location)

        res.status(200).json({ where })
    } catch (err) {
        next(err)
    }
}

export const search = async (req, res, next) => {
    try {
        const { name, startDate: sartDateStr, endDate: endDateStr } = req.query
        const startDate = sanitizeData(sartDateStr, 'date')
        const endDate = sanitizeData(endDateStr, 'date')

        const Login = (await import('../models/Login.js')).default

        let logins
        if (name) {
            logins = await Login.find({ name: name, date: { $gte: startDate, $lte: endDate } }).sort({ date: 1, time: -1 })
        }
        else {
            logins = await Login.find({ date: { $gte: startDate, $lte: endDate } }).sort({ date: 1, time: -1, name: 1 })
        }
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(logins)
    } catch (err) {
        next(err)
    }
}

export const getApiKey = async (req, res, next) => {
    try {
        const { email } = req.user
        const user = await AuthService.getUserByEmail(email)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json({ apiKey: user.apiKey })
    } catch (err) {
        next(err)
    }
}

export const updateApiKey = async (req, res, next) => {
    try {
        const { email } = req.user
        // Logic to generate API Key - maybe move to AuthService or util
        const apiKey = generateApiKey()
        await User.updateOne({ email }, { $set: { apiKey } }, { runValidators: true })
        res.status(200).json({ apiKey })
    } catch (err) {
        next(err)
    }
}

export const validateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
            // throw createError(401, 'Invalid or missing Authorization header')
            // Need to import createError or just throw
            const { createError } = await import('../utils/error.js')
            throw createError(401, 'Invalid or missing Authorization header')
        }
        const apiKey = authHeader.slice(7).trim()

        if (!apiKey) {
            const { createError } = await import('../utils/error.js')
            throw createError(401, 'Token is missing')
        }
        const user = await User.findOne({ apiKey })
        if (!user) {
            const { createError } = await import('../utils/error.js')
            throw createError(401, 'Invalid Token')
        }
        else { return res.status(200).json({ message: 'OK' }) }
    } catch (err) {
        next(err)
    }
}

export const authCallback = async (req, res, next) => {
    try {
        const { code, session_state, redirect_uri, width, height, platform } = req.body
        const ip = getClientIP(req)
        const user_agent = req.headers['user-agent']

        const result = await AuthService.ssoCallback(code, session_state, redirect_uri, width, height, platform, ip, user_agent)

        res.cookie('access_token', result.token, {
            httpOnly: true, secure: true, sameSite: 'Strict'
        })
            .status(200)
            .json(result.userData)
    } catch (err) {
        next(err)
    }
}

export const verify = async (req, res, next) => {
    try {
        const { email, password } = req.body
        // Reuse AuthService.validateUserCredentials just for verification
        await AuthService.validateUserCredentials(email, password)
        res.status(200).json({ status: 'success', message: 'Verified' })
    } catch (err) {
        next(err)
    }
}


// Encryption util re-implementation or import if needed for generateApiKey
import CryptoJS from 'crypto-js'
const generateApiKey = (length = 16) => {
    const randomBytes = CryptoJS.lib.WordArray.random(length)
    return randomBytes.toString(CryptoJS.enc.Hex)
}

// HTML Template - still here for "View" logic, but could move to a template file.
// Keeping it simple as per plan (Service Layer focus).
const successHtml = (name, alreadyActive = false) => `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SmartWork 가입 인증 완료</title>
    <style>
    body {
        font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, sans-serif;
        background-color: #f4f6f8;
        margin: 0;
        padding: 0;
    }
    .container {
        max-width: 480px;
        margin: 60px auto;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        overflow: hidden;
        text-align: center;
    }
    .header {
        background-color: #2563eb;
        color: #fff;
        padding: 20px;
    }
    .content {
        padding: 30px 20px;
    }
    h1 {
        font-size: 22px;
        margin-bottom: 10px;
    }
    p {
        color: #555;
        line-height: 1.6;
        margin: 10px 0 20px;
    }
    .button {
        display: inline-block;
        background-color: #2563eb;
        color: white;
        padding: 12px 28px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: bold;
        transition: background-color 0.3s;
    }
    .button:hover {
        background-color: #1e4ed8;
    }
    .footer {
        background-color: #f9fafb;
        padding: 16px;
        font-size: 12px;
        color: #777;
    }

    /* ✅ 모바일 대응 */
    @media (max-width: 480px) {
        .container {
        margin: 20px;
        }
        h1 {
        font-size: 20px;
        }
    }
    </style>
    </head>
    <body>
    <div class="container">
        <div class="header">
        <h1>SmartWork 가입 인증</h1>
        </div>
        <div class="content">
        <h2>안녕하세요, ${name}님 👋</h2>
        <p>
            ${alreadyActive
        ? '이미 인증이 완료된 계정입니다.'
        : '이메일 인증이 성공적으로 완료되었습니다!'
    }
        </p>
        <a href="${process.env.DOMAIN}" class="button">
            SmartWork로 이동하기
        </a>
        </div>
        <div class="footer">
        © ${new Date().getFullYear()} SmartWork. All rights reserved.
        </div>
    </div>
    </body>
    </html>
    `