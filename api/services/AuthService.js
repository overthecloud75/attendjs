import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { authenticator } from 'otplib'
import User from '../models/User.js'
import Employee from '../models/Employee.js'
import Login from '../models/Login.js'
import SystemSettings from '../models/SystemSettings.js'
import { createError } from '../utils/error.js'
import { DateUtil, dateAndTime, getRandomInt, sanitizeData } from '../utils/util.js'
import EmployeeService from './EmployeeService.js'
import LocationService from './LocationService.js'
import EmailService from './EmailService.js'
import InfrastructureService from './InfrastructureService.js'

authenticator.options = { digits: 6 }

export default class AuthService {

    static async register(name, rawEmail, password) {
        const email = sanitizeData(rawEmail, 'email')
        await this.checkPasswordPolicy(password)

        const userCount = await User.countDocuments()
        let isAdmin
        let employeeId

        if (userCount === 0) {
            isAdmin = true
            employeeId = 0
            const beginDate = DateUtil.today()
            const rootEmployee = new Employee({
                employeeId, name, email, beginDate,
                department: 'IT', rank: '관리자', position: '팀장',
                regular: '상근', mode: '내근', attendMode: 'O'
            })
            await rootEmployee.save()
        } else {
            const employee = await this.validateNewUser(name, email)
            employeeId = employee.employeeId
        }

        const token = jwt.sign({ email }, process.env.JWT, { expiresIn: '12h' })
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const newUser = new User({ name, email, employeeId, password: hash, isAdmin, confirmationCode: token })
        await newUser.save()

        // Side effect: Send Email
        EmailService.sendRegistrationConfirmation(name, email, token)

        return 'User has been created.'
    }

    static async validateNewUser(name, email) {
        const check = await EmployeeService.validateActiveEmployee(email, name)
        if (!check.valid) {
            if (check.reason === 'Employee not found') throw createError(403, 'Forbidden')
            if (check.reason === 'Employee is retired') throw createError(403, 'Employee not found!')
            throw createError(403, check.reason || 'User not found!')
        }

        const existingUser = await this.getUserByEmail(email)
        if (existingUser) throw createError(409, 'The User is already created')
        return check.employee
    }

    static async login(rawEmail, password, platform, width, height, cloudflareToken, ip, user_agent) {
        const email = sanitizeData(rawEmail, 'email')
        const user = await this.validateUserCredentials(email, password)

        const employee = await EmployeeService.getEmployeeByEmail(email)
        const { beginDate, department, rank, regular } = employee
        const token = jwt.sign(
            { name: user.name, employeeId: user.employeeId, isAdmin: user.isAdmin, email, department },
            process.env.JWT,
            { expiresIn: '12h' }
        )

        const cloudflareCheck = await InfrastructureService.handleCloudflarePost(ip, cloudflareToken)
        const { where, hash } = await this.saveLogin(user, ip, user_agent, platform, width, height, cloudflareCheck)

        return {
            token,
            userData: { _id: user._id, employeeId: user.employeeId, name: user.name, email, isAdmin: user.isAdmin, department, rank, regular, beginDate, where, hash }
        }
    }

    static async validateUserCredentials(email, password) {
        const user = await this.getUserByEmail(email)
        if (!user) throw createError(401, 'Wrong password or email!')

        // Check Lockout
        if (user.lockoutUntil && user.lockoutUntil > new Date()) {
            const waitMinutes = Math.ceil((user.lockoutUntil - new Date()) / 1000 / 60)
            throw createError(403, `Account locked. Try again in ${waitMinutes} minutes.`)
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            const settings = await this.getSecuritySettings()
            const maxAttempts = settings.session.maxLoginAttempts

            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1

            if (user.failedLoginAttempts >= maxAttempts) {
                user.lockoutUntil = new Date(Date.now() + 30 * 60 * 1000)
                await user.save()
                throw createError(403, 'Account locked due to too many failed attempts.')
            } else {
                await user.save()
                const remaining = maxAttempts - user.failedLoginAttempts
                throw createError(401, `Wrong password! ${remaining} attempts remaining.`)
            }
        }

        if (user.failedLoginAttempts > 0 || user.lockoutUntil) {
            user.failedLoginAttempts = 0
            user.lockoutUntil = null
            await user.save()
        }

        if (user.status !== 'Active') {
            throw createError(401, 'Pending Account. Please Verify Your Email!')
        }
        return user
    }

    static async saveLogin(user, ip, user_agent, platform, width, height, cloudflareCheck, loginType = 'general') {
        const { employeeId, name } = user
        const { date, time } = dateAndTime()

        const { isMobile, isRemotePlace } = LocationService.checkMobile(ip, user_agent)
        const where = LocationService.attendRemotePlace(isRemotePlace, isMobile, cloudflareCheck, loginType)
        const hash = getRandomInt()

        const attend = where.attend ? 'O' : 'X'
        const login = new Login({ employeeId, name, date, time, ip, isMobile, platform, user_agent, width, height, latitude: -1, longitude: -1, accuracy: 1, attend, hash, cloudflareCheck, loginType, timestamp: Date.now() })

        await LocationService.setGpsOn(employeeId, name, date, time, where)
        await login.save()

        return { where, hash }
    }

    static async updateLogin(user, ip, user_agent, hashLocation) {
        const { employeeId, name } = user
        const { isMobile } = LocationService.checkMobile(ip, user_agent)
        const { date, time } = dateAndTime()

        const lastLogin = await Login.findOne({ employeeId, date }).sort({ time: -1 })

        // Using LocationService to decrypt and find location
        const location = LocationService.decryptLocation(lastLogin, hashLocation)
        const where = await LocationService.whereIs(location, isMobile)

        const attend = where.attend ? 'O' : 'X'
        await Login.updateOne({ timestamp: lastLogin.timestamp, employeeId, name }, { $set: { ip, isMobile, user_agent, latitude: location.latitude, longitude: location.longitude, accuracy: location.accuracy, attend } }, { runValidators: true })
        await LocationService.setGpsOn(employeeId, name, date, time, where)

        return where
    }

    static async changePassword(email, currentPassword, newPassword) {
        await this.checkPasswordPolicy(newPassword)

        const user = await this.getUserByEmail(email)
        if (!user) throw createError(401, 'Wrong password or email!')

        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password)
        if (!isPasswordCorrect) throw createError(401, 'Wrong password or email!')

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(newPassword, salt)
        await User.updateOne({ email }, { $set: { password: hash } }, { runValidators: true })

        return 'Password has been changed.'
    }

    static async lostPassword(rawEmail) {
        const email = sanitizeData(rawEmail, 'email')
        const user = await this.getUserByEmail(email)
        if (!user) throw createError(401, 'Wrong email!')

        const otpSecret = authenticator.generateSecret()
        const otp = authenticator.generate(otpSecret)
        await User.updateOne({ email }, { $set: { otp } }, { runValidators: true })

        EmailService.sendPasswordResetOtp(user.name, email, otp)
        return 'Otp has been sent.'
    }

    static async resetPasswordWithOtp(rawEmail, password, otp, cloudflareToken, ip) {
        const email = sanitizeData(rawEmail, 'email')
        await this.checkPasswordPolicy(password)

        const user = await this.getUserByEmail(email)
        if (!user) throw createError(401, 'Wrong email!')
        if (user.otp !== otp) throw createError(401, 'Wrong OTP!')

        const cloudflareCheck = await InfrastructureService.handleCloudflarePost(ip, cloudflareToken)
        if (cloudflareCheck === 'X') throw createError(500, 'Something Wrong!')

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        await User.updateOne({ email }, { $set: { password: hash } }, { runValidators: true })

        return 'Password has been changed.'
    }

    static async verifyRegistrationCode(confirmationCode) {
        const user = await User.findOne({ confirmationCode })
        if (!user) throw createError(404, 'User not found!')

        if (user.status === 'Active') {
            return { name: user.name, alreadyActive: true }
        }

        await User.updateOne(
            { confirmationCode },
            { $set: { status: 'Active' } },
            { runValidators: true }
        )

        return { name: user.name, alreadyActive: false }
    }

    static async ssoCallback(code, session_state, redirect_uri, width, height, platform, ip, user_agent) {
        if (!code || !session_state || !redirect_uri) throw createError(401, 'Invalid Code')

        const accessToken = await InfrastructureService.ssoLoginWithCode(code, session_state, redirect_uri)
        const response = await InfrastructureService.getUserInfoFromMS365(accessToken)
        const email = response.data.mail

        let isAdmin = false
        const user = await this.getUserByEmail(email)
        if (user) { isAdmin = user.isAdmin }

        const { name, employeeId, department } = await EmployeeService.getEmployeeByEmail(email)
        const token = jwt.sign(
            { name, employeeId, isAdmin, email, department },
            process.env.JWT,
            { expiresIn: '12h' }
        )

        const { where, hash } = await this.saveLogin(user, ip, user_agent, platform, width, height, 'X', 'sso')

        return {
            token,
            userData: { name: user.name, email, isAdmin: user.isAdmin, department, where, hash }
        }
    }

    static async getUserByEmail(email) {
        return await User.findOne({ email })
    }

    static async getSecuritySettings() {
        const settings = await SystemSettings.findOne()
        return settings?.security || {
            passwordPolicy: { minLength: 8, requireSpecialChar: true, expiryDays: 90 },
            session: { timeoutMinutes: 60, maxLoginAttempts: 5 },
            ipAccess: { allowedIps: [], blockExternalAccess: false }
        }
    }

    static async checkPasswordPolicy(password) {
        const settings = await this.getSecuritySettings()
        const { minLength, requireSpecialChar } = settings.passwordPolicy

        if (password.length < minLength) {
            throw createError(400, `Password must be at least ${minLength} characters long`)
        }
        if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            throw createError(400, 'Password must contain at least one special character')
        }
    }
}
