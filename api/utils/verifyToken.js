import jwt from 'jsonwebtoken'
import { createError } from '../utils/error.js'
import { separateIP } from '../utils/util.js'

// https://stackoverflow.com/questions/73162583/verification-of-user-and-admin-not-working-properly-in-following-code
export const verifyToken = (req) => {
    const token = req.cookies.access_token
    if (!token) {
        return { status: 401, message: 'You are not authenticated!' }
    }
    try {
        const user = jwt.verify(token, process.env.JWT)
        req.user = user
        return { status: 200, user }
    } catch (e) {
        return { status: 403, message: 'Token is not valid!' }
    }
}

export const verifyUser = (req, res, next) => {
    const tokenStatus = verifyToken(req)
    if (tokenStatus.status !== 200) return next(createError(tokenStatus.status, tokenStatus.message))
    next()
}

export const verifyAdmin = (req, res, next) => {
    const tokenStatus = verifyToken(req)
    if (tokenStatus.status !== 200) return next(createError(tokenStatus.status, tokenStatus.message))
    if (tokenStatus.user.isAdmin) return next()
    return next(createError(403, 'You are not authorized!'));
}

export const verifyIP = (req, res, next) => {
    const {externalIP, internalIP} = separateIP(req.headers['x-forwarded-for'])
    // dotenv does not support boolean
    if (process.env.ACCESS_CONTROL === 'true') {
        const isExternalIP = checkExternalIP(externalIP, internalIP)
        if (isExternalIP) {return verifyUser(req, res, next)}
    }
    next()
}

const checkExternalIP = (externalIP, internalIP) => {
    let isExternalIP 
    if (['127.0.0.1', 'localhost'].includes(internalIP)) { 
        return isExternalIP
    }
    const splittedInternalIPRange = process.env.INTERNAL_IP_RANGE.split('.')
    const splittedExteranlIP = externalIP.split('.')
    for (let x of splittedInternalIPRange.keys()) { 
        if (splittedInternalIPRange[x] === '0') { isExternalIP = false }
        else if (splittedInternalIPRange[x] !== splittedExteranlIP[x]) 
        { isExternalIP = true }
    }
    return isExternalIP 
}