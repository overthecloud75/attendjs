import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { formatToTimeZone } from 'date-fns-timezone'
import { logger, reqFormat } from '../config/winston.js'
import User from '../models/User.js'
import Employee from '../models/Employee.js'
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
        const userCount = await User.count()
        const name = req.body.name 
        const email = sanitizeData(req.body.email, 'email')
        let newUser 
        if (userCount !== 0) {
            const employee = await Employee.findOne({email})
            if (!employee) {
                return next(createError(403, 'Fobidden'))
            } else if (employee.name !== name) {
                return next(createError(403, 'Fobidden'))
            } else {
                const user = await User.findOne({email})
                if (user) {
                    return next(createError(403, 'Fobidden'))
                } else {
                    newUser = new User({
                        name, 
                        email, 
                        password: hash,
                        confirmationCode: token
                    })
                }
            }
        } else {
            const employee = await Employee.findOne({email})
            if (employee) {
                newUser = new User({
                    name, 
                    email, 
                    password: hash,
                    isAdmin: true,
                    confirmationCode: token
                })
            } else {
                return next(createError(403, 'Fobidden'))
            }
        }
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
        const { password, status, confirmationCode, ...otherDetails } = user._doc
        const ip = req.headers['x-forwarded-for'].split(',')[0].split(':')[0]
        const user_agent = req.headers['user-agent']
        const location = req.body.location
        const where = await whereIs(location, ip, user_agent)
        if (where.attend) {
            const date = new Date()
            const data = {ip, user_agent, location}
            const output = formatToTimeZone(date, 'YYYY-MM-DD HHmmss', { timeZone: process.env.TIME_ZONE })  
            const login = await Login.findOne({date: output.split(' ')[0], email})
            if (login) {
                    await Login.updateOne({date: output.split(' ')[0], email, name: user.name}, {$set: {endData: data, end: output.split(' ')[1]}, endPlace: where.place},  {upsert: true})
            } else {
                    await Login.updateOne({date: output.split(' ')[0], email, name: user.name}, {$set: {email, name:user.name, beginData: data, date: output.split(' ')[0], begin: output.split(' ')[1], beginPlace: where.place}}, {upsert: true})
            }
        }
        res.cookie('access_token', token, {
            httpOnly: true,
        })
        .status(200)
        .json({ ...otherDetails })
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
    let attend = false 
    let place = ''
    const locations = await Location.find()
    for (let loc of locations) {
        const latDev = loc.latitude - location.latitude
        const logDev = loc.longitude - location.longitude
        if ((latDev < loc.dev) && (latDev > -1 * loc.dev) && (logDev < loc.dev) && (logDev > -1 * loc.dev)) {
            attend = true
            place = loc.location  
        }
    }
    return {attend, place}
}