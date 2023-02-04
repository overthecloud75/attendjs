import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import CryptoJS from 'crypto-js'
import { formatToTimeZone } from 'date-fns-timezone'
import distance from 'gps-distance'
import { logger, reqFormat } from '../config/winston.js'
import { MOBILE_IP_LIST } from '../config/working.js'
import User from '../models/User.js'
import Employee from '../models/Employee.js'
import GPSOn from '../models/GPSOn.js'
import Login from '../models/Login.js'
import Location from '../models/Location.js'
import { createError } from '../utils/error.js'
import { sendConfirmationEmail } from '../utils/email.js'
import { sanitizeData } from '../utils/util.js'


export const register = async (req, res, next) => {
    logger.info(reqFormat(req))
    try {
        const token = jwt.sign({email: req.body.email}, process.env.JWT)
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt)
        
        const name = req.body.name 
        const email = sanitizeData(req.body.email, 'email')
        const employee = await Employee.findOne({email})
        if (!employee) {
            return next(createError(403, 'Fobidden'))
        } else if (employee.name !== name) {
            return next(createError(403, 'User not found!'))
        }
    
        const user = await User.findOne({email})
        if (user) {
            return next(createError(403, 'The User is already created'))
        }
        const userCount = await User.count()

        let isAdmin 
        if (userCount !== 0) {
            isAdmin = false
        } else {
            isAdmin = true
        }
        const newUser = User({name, email, employeeId: employee.employeeId, password: hash, isAdmin, confirmationCode: token})
        await newUser.save()
        res.status(200).send('User has been created.')
        sendConfirmationEmail(req.body.name, email, token)
    } catch (err) {
        next(err)
    }
}

export const login = async (req, res, next) => {
    logger.info(reqFormat(req))
    const email = sanitizeData(req.body.email, 'email')
    try {
        const user = await User.findOne({email}).setOptions({sanitizeFilter: true})
        if (!user) return next(createError(403, 'User not found!'))

        const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if (!isPasswordCorrect)
            return next(createError(400, 'Wrong password or email!'))

        if (user.status != 'Active') {
            return next(createError(401, 'Pending Account. Please Verify Your Email!'))
        }

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT
        )
        
        const ip = req.headers['x-forwarded-for'].split(',')[0].split(':')[0]
        const user_agent = req.headers['user-agent']
        const hash = req.body.hash
        const location = req.body.location
        const encryptedLocation = req.body.encryptedLocation

        const decryptedLocation = decryptLocation(encryptedLocation, hash)
        console.log(location, decryptedLocation)
        
        const {isMobile, isRemotePlace} = checkMobile(ip)
        const abuse = validateCheck(isMobile, location, decryptedLocation, hash)
        const where = await whereIs(location, isMobile, isRemotePlace)
        await updateLogin(user.employeeId, user.name, ip, isMobile, user_agent, location, where, abuse)
        
        res.cookie('access_token', token, {
            httpOnly: true, secure: true
        })
        .status(200)
        .json({ name: user.name, email, isAdmin: user.isAdmin, where })
    } catch (err) {
        next(err)
    }
}

export const logout = async (req, res, next) => {
    logger.info(reqFormat(req))
    try {
        res.clearCookie('access_token').status(200).json([])
    } catch (err) {
        next(err)
    }
}

export const confirmCode = async (req, res, next) => {
    logger.info(reqFormat(req))
    try {
        const confirmationCode = req.params.confirmationCode
        const user = await User.findOne({confirmationCode})
        if (!user) return next(createError(404, 'User not found!'))

        const status = 'Active'
        await User.updateOne({confirmationCode}, {$set: {status}})
        res.status(200).json({name: user.name, email: user.email, message: 'activated'})

    } catch (err) {
        next(err)
    }
}

const checkMobile = (ip) => {
    const ip_split = ip.split('.')
    const ip16 = ip_split[0] + '.' + ip_split[1]

    let isMobile = 'X' 
    let isRemotePlace = false
    if (MOBILE_IP_LIST.includes(ip16)) {
        isMobile = 'O'
    }
    if (process.env.REMOTE_IP===ip16) {
        isRemotePlace = true
    }
    return {isMobile, isRemotePlace}
}

const whereIs = async (location, isMobile, isRemotePlace) => {
    
    let attend = false 
    let place = ''
    let distanceResult = 0 
    let minDistance = 10000
    let placeLocation = {latitude: -1, longitude: -1}
    if (isRemotePlace) {
        attend = true
        place = process.env.REMOTE_PLACE
        minDistance = 0 
    } else if (isMobile==='X') {
        attend = false
    } else if (location) {
        const locations = await Location.find()
        for (let loc of locations) {
            distanceResult = Math.round(distance(loc.latitude, loc.longitude, location.latitude, location.longitude)*1000)/1000
            if (distanceResult < minDistance) {
                place = loc.location 
                minDistance = distanceResult
                placeLocation = {latitude: loc.latitude, longitude: loc.longitude}
                if (distanceResult < loc.dev) {
                    attend = true        
                }
            }
        }
    }
    return {attend, place, minDistance, placeLocation, isMobile}
}

const updateLogin = async (employeeId, name, ip, isMobile, user_agent, location, where, abuse) => {
    const {date, time} = dateAndTime()
    let attend
    if (where.attend) {attend = 'O'
    } else {attend = 'X'
    }

    const login = new Login({employeeId, name, date, time, ip, isMobile, user_agent, latitude: location.latitude, longitude: location.longitude, attend, abuse})
    if (where.attend) { 
        const gpsOn = await GPSOn.findOne({date, employeeId})
        if (gpsOn) {
            await GPSOn.updateOne({date, employeeId, name}, {$set: {end: time, endPlace: where.place}})
        } else {
            const newGPSOn = new GPSOn({employeeId, name, date, begin: time, beginPlace: where.place, end: time, endPlace: where.place})
            await newGPSOn.save()
        }
    } 
    await login.save()
}

const dateAndTime = () => {
    const dateTime = new Date()
    const output = formatToTimeZone(dateTime, 'YYYY-MM-DD HHmmss', { timeZone: process.env.TIME_ZONE })
    const date = output.split(' ')[0]
    const time = output.split(' ')[1]
    return {date, time}
}

const decryptLocation = (encryptedLocation, hash) => {
    const latitude = Number(CryptoJS.AES.decrypt(encryptedLocation.latitude, hash.toString()).toString(CryptoJS.enc.Utf8))
    const longitude = Number(CryptoJS.AES.decrypt(encryptedLocation.longitude, hash.toString()).toString(CryptoJS.enc.Utf8))
    return {latitude, longitude}
}

const validateCheck = (isMobile, location, decryptedLocation, hash) => {
    let abuse = 'O'
    let time = 0 
    if (isMobile === 'X') { abuse = 'X'}
    else {
        time = Date.now()
        if (Math.abs(location.latitude - decryptedLocation.latitude) < 0.001 && Math.abs(location.longitude - decryptedLocation.longitude) < 0.001 &&   Math.abs(hash-time) < 30000) {
            abuse = 'X' 
        }
    }
    if (abuse === 'O') { console.log(location, decryptedLocation, hash, time) }
    return abuse
}

export const search = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const name = req.query.name 
        const startDate = sanitizeData(req.query.startDate, 'date')
        const endDate = sanitizeData(req.query.endDate, 'date')
        let logins 
        if (name && name !== '') {
            logins = await Login.find({name: name, date: {$gte: startDate, $lte: endDate}}).sort({date: 1, time: 1})}
        else { 
            logins = await Login.find({date: {$gte: startDate, $lte: endDate}}).sort({date: 1, time: 1, name: 1})
        }
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(logins)
    } catch (err) {
        next(err)
    }
}