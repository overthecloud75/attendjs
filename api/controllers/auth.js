import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { formatToTimeZone } from 'date-fns-timezone'
import distance from 'gps-distance'
import CryptoJS from 'crypto-js'
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
        } else if (employee.regular==='퇴사') {
            return next(createError(403, 'Employee not found!'))
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
        const employee = await Employee.findOne({email}).setOptions({sanitizeFilter: true})
        if (employee.regular==='퇴사') {
            return next(createError(403, 'Employee not found!'))
        }
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin, department: employee.department },
            process.env.JWT
        )
        
        const ip = req.headers['x-forwarded-for'].split(',')[0].split(':')[0]
        const platform = req.body.platform
        const user_agent = req.headers['user-agent']
        const width = req.body.width
        const height = req.body.height 
        const {isMobile, isRemotePlace} = checkMobile(ip, user_agent)
        const where = attendRemotePlace(isRemotePlace, isMobile)
        const hash = getRandomInt()
        await saveLogin(user.employeeId, user.name, ip, isMobile, platform, user_agent, width, height, where, hash)
        
        res.cookie('access_token', token, {
            httpOnly: true, secure: true
        })
        .status(200)
        .json({name: user.name, email, isAdmin: user.isAdmin, where, hash})
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

export const setAttend = async (req, res, next) => {
    logger.info(reqFormat(req))
    try {
        const ip = req.headers['x-forwarded-for'].split(',')[0].split(':')[0]
        const user_agent = req.headers['user-agent']
        const {isMobile, isRemotePlace} = checkMobile(ip, user_agent)

        const {date, time} = dateAndTime()
        const user = await User.findOne({_id: req.user.id})
        const lastLogin = await Login.findOne({id:user.employeeId, date}).sort({time: -1})
        const {delta, location, abuse} = validateCheck(lastLogin, req.body.locations, isMobile)
        const where = await whereIs(location, abuse, isMobile)

        await updateLogin(date, time, lastLogin.timestamp, user.employeeId, user.name, ip, isMobile, user_agent, where, abuse, location, delta)
        res.status(200).json({where})
    } catch (err) {
        next(err)
    }
}

export const search = async (req, res, next) => {
    logger.info(reqFormat(req))
    try {
        const name = req.query.name 
        const startDate = sanitizeData(req.query.startDate, 'date')
        const endDate = sanitizeData(req.query.endDate, 'date')
        let logins 
        if (name && name !== '') {
            logins = await Login.find({name: name, date: {$gte: startDate, $lte: endDate}}).sort({date: 1, time: -1})}
        else { 
            logins = await Login.find({date: {$gte: startDate, $lte: endDate}}).sort({date: 1, time: -1, name: 1})
        }
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(logins)
    } catch (err) {
        next(err)
    }
}

const checkMobile = (ip, user_agent) => {
    const ip_split = ip.split('.')
    const ip16 = ip_split[0] + '.' + ip_split[1]
    const ip24 = ip_split[0] + '.' + ip_split[1] + '.' + ip_split[2]

    let isMobile = 'X' 
    let isRemotePlace = false
    if (MOBILE_IP_LIST.includes(ip16)) {
        if (user_agent.includes('iPhone') || user_agent.includes('Android')) {isMobile = 'O'}
    }
    if (process.env.REMOTE_IP===ip24) {
        isRemotePlace = true
    }
    return {isMobile, isRemotePlace}
}

const attendRemotePlace = (isRemotePlace, isMobile) => {
    let attend = false 
    let place = ''
    let minDistance = 10000
    const placeLocation = {latitude: -1, longitude: -1}
    if (isRemotePlace) {
        attend = true
        place = process.env.REMOTE_PLACE
        minDistance = 0 
    }
    return {attend, place, minDistance, placeLocation, isMobile}
}

const whereIs = async (location, abuse, isMobile) => {
    let attend = false 
    let place = ''
    let distanceResult = 0 
    let minDistance = 10000
    let placeLocation = {latitude: -1, longitude: -1}
    if (location && abuse==='X') {
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

const saveLogin = async (employeeId, name, ip, isMobile, platform, user_agent, width, height, where, hash) => {
    const {date, time} = dateAndTime()
    let attend
    if (where.attend) {attend = 'O'
    } else {attend = 'X'
    }
    const login = new Login({employeeId, name, date, time, ip, isMobile, platform, user_agent, width, height, latitude: -1, longitude: -1, accuracy: 1, attend, abuse: 'X', hash, timestamp: Date.now()})
    await setGpsOn(employeeId, name, date, time, where)
    await login.save()
}

const updateLogin = async (date, time, timestamp, employeeId, name, ip, isMobile, user_agent, where, abuse, location, delta) => {
    let attend
    if (where.attend) {attend = 'O'
    } else {attend = 'X'
    }
    await Login.updateOne({timestamp, employeeId, name}, {$set: {ip, isMobile, user_agent, latitude: location.latitude, longitude: location.longitude, accuracy: location.accuracy, attend, abuse, delta: JSON.stringify(delta)}}, {upsert: false})
    await setGpsOn(employeeId, name, date, time, where)
}

const setGpsOn = async (employeeId, name, date, time, where) => {
    if (where.attend) { 
        const gpsOn = await GPSOn.findOne({date, employeeId})
        if (gpsOn) {
            await GPSOn.updateOne({date, employeeId, name}, {$set: {end: time, endPlace: where.place}})
        } else {
            const newGPSOn = new GPSOn({employeeId, name, date, begin: time, beginPlace: where.place, end: time, endPlace: where.place})
            await newGPSOn.save()
        }
    } 
}

const dateAndTime = () => {
    const dateTime = new Date()
    const output = formatToTimeZone(dateTime, 'YYYY-MM-DD HHmmss', { timeZone: process.env.TIME_ZONE })
    const date = output.split(' ')[0]
    const time = output.split(' ')[1]
    return {date, time}
}

const validateCheck = (lastLogin, hashLocation, isMobile) => {
    let abuse = 'O'
    const bytes  = CryptoJS.AES.decrypt(hashLocation, lastLogin.hash.toString())
    const locations = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    const location0 = locations[0]
    const location = locations[1]
    const delta = {latitude:location.latitude - location0.latitude, longitude:location.longitude - location0.longitude, accuracy: location.accuracy - location0.accuracy, timestamp: location.timestamp - location0.timestamp}

    if (isMobile === 'X') {abuse = 'X'}
    else if (lastLogin.width > 1000 || lastLogin.height > 1000) {}
    else if (delta.timestamp < 900) {}
    else if ((Date.now() - lastLogin.timestamp) < 1000) {abuse = 'X'}
    return {delta, location, abuse}
}

const getRandomInt = (min=1, max=1000) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min //최댓값은 제외, 최솟값은 포함
}



