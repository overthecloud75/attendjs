import jwt from 'jsonwebtoken'
import { createError } from '../utils/error.js'
import { separateIP } from '../utils/util.js'

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token
    if (!token) {
        return next(createError(401, 'You are not authenticated!'))
    }

    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) return next(createError(403, 'Token is not valid!'))
        req.user = user
        next()
    })
}

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user._id === req.params._id || req.user.isAdmin) {
            next()
        } else {
            return next(createError(403, 'You are not authorized!'))
        }
    })
}

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return next(createError(403, 'You are not authorized!'))
        }
    })
}

export const verifyIP = (req, res, next) => {
    const {externalIP, internalIP} = separateIP(req.headers['x-forwarded-for'])
    // dotenv does not support boolean
    if (process.env.ACCESS_CONTROL === 'true') {
        const isExternalIP = checkExternalIP(externalIP, internalIP)
        if (isExternalIP) {return verifyToken(req, res, next)}
    }
    next()
}

const checkExternalIP = (externalIP, internalIP) => {
    let isExternalIP = false
    if (['127.0.0.1', 'localhost'].includes(internalIP)) { 
        return isExternalIP
    }
    const splittedInternalIPRange = process.env.INTERNAL_IP_RANGE.split('.')
    const splittedExteranlIP = externalIP.split('.')
    for (let x of splittedInternalIPRange.keys()) { 
        if (splittedInternalIPRange[x] === '0') { }
        else if (splittedInternalIPRange[x] !== splittedExteranlIP[x]) 
        { isExternalIP = true }
    }
    return isExternalIP 
}