import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import CryptoJS from 'crypto-js'
import { formatToTimeZone } from 'date-fns-timezone'
import distance from 'gps-distance'
import { MOBILE_IP_LIST } from '../config/working.js'
import User from '../models/User.js'
import GPSOn from '../models/GPSOn.js'
import Login from '../models/Login.js'
import Location from '../models/Location.js'
import { getEmployeeByEmail } from './employee.js'
import { createError } from '../utils/error.js'
import { registerConfirmationEmail } from '../utils/email.js'
import { sanitizeData } from '../utils/util.js'

export const register = async (req, res, next) => {
    logger.info(reqFormat(req))
    try {
        const name = req.body.name 
        const email = sanitizeData(req.body.email, 'email')

        const token = jwt.sign({email}, process.env.JWT)
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt)

        const employee = await getEmployeeByEmail(email)
        if (!employee) {
            return next(createError(403, 'Fobidden'))
        } else if (employee.name !== name) {
            return next(createError(403, 'User not found!'))
        } else if (employee.regular==='퇴사') {
            return next(createError(403, 'Employee not found!'))
        }
    
        const user = await getUserByEmail(email)
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
        registerConfirmationEmail(req.body.name, email, token)
    } catch (err) {
        next(err)
    }
}

export const login = async (req, res, next) => {
    const email = sanitizeData(req.body.email, 'email')
    try {
        const user = await getUserByEmail(email)
        if (!user) return next(createError(403, 'Wrong password or email!'))

        const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if (!isPasswordCorrect)
            return next(createError(403, 'Wrong password or email!'))

        if (user.status != 'Active') {
            return next(createError(401, 'Pending Account. Please Verify Your Email!'))
        }
        const {regular, department} = await getEmployeeByEmail(email)
        if (regular==='퇴사') {
            return next(createError(403, 'Wrong password or email!'))
        }
        const token = jwt.sign(
            {name: user.name, employeeId: user.employeeId, isAdmin: user.isAdmin, email, department},
            process.env.JWT
        )
        
        const ip = req.headers['x-forwarded-for'].split(',')[0].split(':')[0]
        const user_agent = req.headers['user-agent']
        const platform = req.body.platform
        const width = req.body.width
        const height = req.body.height 

        const {where, hash} = await saveLogin(user, ip, user_agent, platform, width, height)
        
        res.cookie('access_token', token, {
            httpOnly: true, secure: true, sameSite: 'Strict'
        })
        .status(200)
        .json({name: user.name, email, isAdmin: user.isAdmin, where, hash})
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

export const confirmCode = async (req, res, next) => {
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
    try {
        const ip = req.headers['x-forwarded-for'].split(',')[0].split(':')[0]
        const user_agent = req.headers['user-agent']
        const {isMobile} = checkMobile(ip, user_agent)

        const user = await User.findOne({email: req.user.email})
        const where = await updateLogin(user, ip, isMobile, user_agent, req.body.location)
        res.status(200).json({where})
    } catch (err) {
        next(err)
    }
}

export const search = async (req, res, next) => {
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
    // const ip24 = ip_split[0] + '.' + ip_split[1] + '.' + ip_split[2]

    let isMobile = 'X' 
    let isRemotePlace = false
    if (MOBILE_IP_LIST.includes(ip16)) {
        if (user_agent.includes('iPhone') || user_agent.includes('Android')) {isMobile = 'O'}
    }
    if (process.env.REMOTE_IP===ip16) {
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

const whereIs = async (location, isMobile) => {
    let attend = false 
    let place = ''
    let distanceResult = 0 
    let minDistance = 10000
    let placeLocation = {latitude: -1, longitude: -1}
    if (location) {
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

const saveLogin = async (user, ip, user_agent, platform, width, height) => {
    const employeeId = user.employeeId
    const name = user.name 
    const {date, time} = dateAndTime()

    const {isMobile, isRemotePlace} = checkMobile(ip, user_agent)
    const where = attendRemotePlace(isRemotePlace, isMobile)
    const hash = getRandomInt()

    let attend
    if (where.attend) {attend = 'O'
    } else {attend = 'X'}
    const login = new Login({employeeId, name, date, time, ip, isMobile, platform, user_agent, width, height, latitude: -1, longitude: -1, accuracy: 1, attend, hash, timestamp: Date.now()})
    
    await setGpsOn(employeeId, name, date, time, where)
    await login.save()

    return {where, hash}
}

const updateLogin = async (user, ip, isMobile, user_agent, hashLocation) => {

    const employeeId = user.employeeId
    const name = user.name

    const {date, time} = dateAndTime()
    const lastLogin = await Login.findOne({employeeId, date}).sort({time: -1})
    const location = decryptLocation(lastLogin, hashLocation)
    const where = await whereIs(location, isMobile)

    let attend
    if (where.attend) {attend = 'O'
    } else {attend = 'X'}

    await Login.updateOne({timestamp: lastLogin.timestamp, employeeId, name}, {$set: {ip, isMobile, user_agent, latitude: location.latitude, longitude: location.longitude, accuracy: location.accuracy, attend}})
    await setGpsOn(employeeId, name, date, time, where)

    return where 
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

const decryptLocation = (lastLogin, hashLocation) => {
    const bytes  = CryptoJS.AES.decrypt(hashLocation, lastLogin.hash.toString())
    const location = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    return location
}

const getRandomInt = (min=1, max=1000) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min //최댓값은 제외, 최솟값은 포함
}

const getUserByEmail = async (email) => {
    const user = await User.findOne({email})
    return user
}



