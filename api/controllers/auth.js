import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { logger, reqFormat } from '../config/winston.js'
import User from '../models/User.js'
import Employee from '../models/Employee.js'
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
        if (!user) return next(createError(404, 'User not found!'))

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