import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { formatToTimeZone } from 'date-fns-timezone'
import distance from 'gps-distance'
import { logger, reqFormat } from '../config/winston.js'
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
        const location = req.body.location

        const where = await whereIs(location, ip, user_agent)
        console.log('where', where)
        await updateLogin(user.employeeId, user.name, ip, user_agent, location, where)
        console.log('update')
        
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

const whereIs = async (location, ip, user_agent) => {
    const locations = await Location.find()
    let attend = false 
    let place = ''
    let distanceResult = 0 
    let minDistance = 10000
    let placeLocation = {latituce: -1, longitude: -1}
    if (location) {
        for (let loc of locations) {
            distanceResult = Math.round(distance(loc.latitude, loc.longitude, location.latitude, location.longitude)*1000)/1000
            console.log(distanceResult)
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
    return {attend, place, minDistance, placeLocation}
}

const updateLogin = async (employeeId, name, ip, user_agent, location, where) => {
    console.log('where2', where)
    const dateTime = new Date()
    const data = {ip, user_agent, location}
    const output = formatToTimeZone(dateTime, 'YYYY-MM-DD HHmmss', { timeZone: process.env.TIME_ZONE })
    const date = output.split(' ')[0]
    const time = output.split(' ')[1]
    if (location && where.attend) { 
        const gpsOn = await GPSOn.findOne({date, employeeId})
        if (gpsOn) {
            await GPSOn.updateOne({date, employeeId, name}, {$set: {endData: data, end: time, endPlace: where.place}})
        } else {
            const newGPSOn = new GPSOn({employeeId, name, date, beginData: data, begin: time, beginPlace: where.place, endData: data, end: time, endPlace: where.place})
            await newGPSOn.save()
        }
    } else if (location) {
        const login = new Login({employeeId, name, date, time, ip, user_agent, location})
        await login.save()
    } else {
        const login = new Login({employeeId, name, date, time, ip, user_agent})
        await login.save()
    }
}