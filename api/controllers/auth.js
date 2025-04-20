import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import CryptoJS from 'crypto-js'
import { formatToTimeZone } from 'date-fns-timezone'
import { authenticator } from 'otplib'
import distance from 'gps-distance'
import { MOBILE_IP_LIST } from '../config/working.js'
import { logger } from '../config/winston.js'
import User from '../models/User.js'
import GPSOn from '../models/GPSOn.js'
import Login from '../models/Login.js'
import Location from '../models/Location.js'
import { getEmployeeByEmail } from './employee.js'
import { createError } from '../utils/error.js'
import { registerConfirmationEmail, CheckOtpEmail } from '../utils/email.js'
import { sanitizeData } from '../utils/util.js'

authenticator.options = { digits: 6 }

export const register = async (req, res, next) => {
    try {
        const { name, email: rawEmail, password } = req.body
        const email = sanitizeData(rawEmail, 'email')

        const employee = await validateNewUser(name, email)

        const token = jwt.sign({email}, process.env.JWT)
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const isAdmin = await User.countDocuments() === 0
        const newUser = new User({name, email, employeeId: employee.employeeId, password: hash, isAdmin, confirmationCode: token})
        await newUser.save()
        res.status(200).send('User has been created.')
        registerConfirmationEmail(name, email, token)
    } catch (err) {
        next(err)
    }
}

const validateNewUser = async (name, email) => {
    const employee = await getEmployeeByEmail(email)
    if (!employee) {
        throw createError(403, 'Forbidden')
    }
    if (employee.name !== name) {
        throw createError(403, 'User not found!')
    }
    if (employee.regular === '퇴사') {
        throw createError(403, 'Employee not found!')
    } 
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
        throw createError(403, 'The User is already created')
    }
    return employee
}

export const login = async (req, res, next) => {
    try {
        const { email: rawEmail, password, platform, width, height, token: cloudflareToken } = req.body
        const email = sanitizeData(rawEmail, 'email')
        const user = await validateUserCredentials(email, password)
        
        let {department, cardNo} = await getEmployeeByEmail(email)
        if (!cardNo) {cardNo = ''}
        const token = jwt.sign(
            {name: user.name, employeeId: user.employeeId, isAdmin: user.isAdmin, email, department},
            process.env.JWT
        )
        const ip = getClientIp(req)
        const user_agent = req.headers['user-agent']
    
        const cloudflareCheck = await handleCloudflarePost(ip, cloudflareToken)
        const {where, hash} = await saveLogin(user, ip, user_agent, platform, width, height, cloudflareCheck)
        
        res.cookie('access_token', token, {
            httpOnly: true, secure: true, sameSite: 'Strict'
        })
        .status(200)
        .json({name: user.name, email, isAdmin: user.isAdmin, department, where, hash})
    } catch (err) {
        console.log(err)
        next(err)
    }
}

const validateUserCredentials = async (email, password) => {
    const user = await getUserByEmail(email)
    if (!user) throw createError(401, 'Wrong password or email!')

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) throw createError(401, 'Wrong password or email!')

    if (user.status !== 'Active') {
        throw createError(401, 'Pending Account. Please Verify Your Email!')
    }

    return user
}

export const password = async (req, res, next) => {
    try {
        const { email: rawEmail, currentPassword, newPassword } = req.body
        const email = sanitizeData(rawEmail, 'email')

        const user = await getUserByEmail(email)
        if (!user) throw createError(401, 'Wrong password or email!')

        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            user.password
        )
        if (!isPasswordCorrect) throw createError(401, 'Wrong password or email!')

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(newPassword, salt)
        await User.updateOne({email}, {$set: {password: hash}}, {runValidators: true})
        res.status(200).send('Password has been changed.')    
    } catch (err) {
        next(err)
    }
}

export const lostPassword = async (req, res, next) => {
    try {
        const { email: rawEmail } = req.body
        const email = sanitizeData(rawEmail, 'email')
        const user = await getUserByEmail(email)
        if (!user) throw createError(401, 'Wrong email!')
        const otpSecret = authenticator.generateSecret()          // OTP 시크릿 생성
        const otp = authenticator.generate(otpSecret)             // OTP 생성
        await User.updateOne({email}, {$set: {otp}}, {runValidators: true})
        CheckOtpEmail(user.name, email, otp)
        res.status(200).send('Otp has been sent.')    
    } catch (err) {
        next(err)
    }
}

export const passwordWithOtp = async (req, res, next) => {
    try {
        const { email: rawEmail, password, otp, token: cloudflareToken } = req.body
        const email = sanitizeData(rawEmail, 'email')
        const user = await getUserByEmail(email)
        if (!user) throw createError(401, 'Wrong email!')
        if (user.otp !== otp) throw createError(401, 'Wrong OTP!')

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const ip =  getClientIp(req)
        const cloudflareCheck = await handleCloudflarePost(ip, cloudflareToken)
        if (cloudflareCheck === 'X') throw createError(500, 'Something Wrong!')
        await User.updateOne({email}, {$set: {password: hash}}, {runValidators: true})
        res.status(200).send('Password has been changed.')     
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
        const { confirmationCode } = req.params
        const user = await User.findOne({confirmationCode})
        if (!user) throw createError(404, 'User not found!')

        const status = 'Active'
        await User.updateOne({confirmationCode}, {$set: {status}}, {runValidators: true})
        res.status(200).json({name: user.name, email: user.email, message: 'activated'})
    } catch (err) {
        next(err)
    }
}

export const setAttend = async (req, res, next) => {
    try {
        const ip = getClientIp(req)
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
        const { name, startDate: sartDateStr, endDate: endDateStr } = req.query
        const startDate = sanitizeData(sartDateStr, 'date')
        const endDate = sanitizeData(endDateStr, 'date')
        let logins 
        if (name) {
            logins = await Login.find({name: name, date: {$gte: startDate, $lte: endDate}}).sort({date: 1, time: -1})}
        else { 
            logins = await Login.find({date: {$gte: startDate, $lte: endDate}}).sort({date: 1, time: -1, name: 1})
        }
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(logins)
    } catch (err) {
        next(err)
    }
}

export const getApiKey = async (req, res, next) => {
    try {
        const { email } = req.user
        const user = await getUserByEmail(email)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json({apiKey: user.apiKey})
    } catch (err) {
        next(err)
    }
}

export const updateApiKey = async (req, res, next) => {
    try {
        const { email } = req.user
        const apiKey = generateApiKey()
        await User.updateOne({email}, {$set: {apiKey}}, {runValidators: true})
        res.status(200).json({apiKey})
    } catch (err) {
        next(err)
    }
}

export const validateToken = async (req, res, next) => {
    try {
        logger.info(req.headers)
        const authHeader = req.headers['authorization']
        if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
            throw createError(401, 'Invalid or missing Authorization header')
        }
        const apiKey = authHeader.slice(7).trim()

        if (!apiKey) {
            throw createError(401, 'Token is missing')
        }
        const user = await User.findOne({apiKey})
        if (!user) { throw createError(401, 'Invalid Token')}
        else { return res.status(200).json({ message: 'OK' }) }
    } catch (err) {
        next(err)
    }
}

const checkMobile = (ip, user_agent) => {
    const ip16 = ip.split('.').slice(0, 2).join('.')
    // const ip24 = ip_split[0] + '.' + ip_split[1] + '.' + ip_split[2]
    const isMobile = MOBILE_IP_LIST.includes(ip16) && (user_agent.includes('iPhone') || user_agent.includes('Android')) ? 'O' : 'X'

    const isRemotePlace = ip16 === process.env.REMOTE_IP
    return {isMobile, isRemotePlace}
}

const attendRemotePlace = (isRemotePlace, isMobile, cloudflareCheck) => {
    let attend = false 
    let place = ''
    let minDistance = 10000
    const placeLocation = {latitude: -1, longitude: -1}
    if (isRemotePlace && cloudflareCheck==='O') {
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

const saveLogin = async (user, ip, user_agent, platform, width, height, cloudflareCheck) => {
    const {employeeId, name} = user
    const {date, time} = dateAndTime()

    const {isMobile, isRemotePlace} = checkMobile(ip, user_agent)
    const where = attendRemotePlace(isRemotePlace, isMobile, cloudflareCheck)
    const hash = getRandomInt()

    const attend = where.attend ? 'O' : 'X'
    const login = new Login({employeeId, name, date, time, ip, isMobile, platform, user_agent, width, height, latitude: -1, longitude: -1, accuracy: 1, attend, hash, cloudflareCheck, timestamp: Date.now()})
    
    await setGpsOn(employeeId, name, date, time, where)
    await login.save()

    return {where, hash}
}

const updateLogin = async (user, ip, isMobile, user_agent, hashLocation) => {

    const {employeeId, name} = user
    const {date, time} = dateAndTime()
    const lastLogin = await Login.findOne({employeeId, date}).sort({time: -1})
    const location = decryptLocation(lastLogin, hashLocation)
    const where = await whereIs(location, isMobile)

    const attend = where.attend ? 'O' : 'X'
    await Login.updateOne({timestamp: lastLogin.timestamp, employeeId, name}, {$set: {ip, isMobile, user_agent, latitude: location.latitude, longitude: location.longitude, accuracy: location.accuracy, attend}}, {runValidators: true})
    await setGpsOn(employeeId, name, date, time, where)

    return where 
}

const setGpsOn = async (employeeId, name, date, time, where) => {
    if (where.attend) { 
        const gpsOn = await GPSOn.findOne({date, employeeId})
        if (gpsOn) {
            await GPSOn.updateOne({date, employeeId, name}, {$set: {end: time, endPlace: where.place}}, {runValidators: true})
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

// https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
const handleCloudflarePost = async (ip, cloudflareToken) => {
    if (!cloudflareToken) return 'X'
    const formData = new FormData()
    formData.append('secret', process.env.CLOUDFLRAE_SECRET_KEY)
    formData.append('response', cloudflareToken)
    formData.append('remoteip', ip)

    const result = await fetch(process.env.CLOUDFLRAE_URL, {
        body: formData,
        method: 'POST',
    })

    const { success } = await result.json()
    return success ? 'O' : 'X'
}

const getClientIp = (req) => {
    if ('x-forwarded-for' in req.headers) 
        {return req.headers['x-forwarded-for'].split(',')[0].split(':')[0]}
    else {
        return req.connection.remoteAddress
    }
}

const generateApiKey = (length = 16) => {
    const randomBytes = CryptoJS.lib.WordArray.random(length)
    return randomBytes.toString(CryptoJS.enc.Hex)
}
  



