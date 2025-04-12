import { getEmployeeByEmail } from './employee.js'
import CreditCard from '../models/CreditCard.js'
import { sanitizeData } from '../utils/util.js'

const LIMIT = 1000

export const search = async (req, res, next) => {
    try {
        const creditcardHistory = await getCreditCardUseHistory(req)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(creditcardHistory)
    } catch (err) {
        next(err)
    }
}

export const getCreditCardNo = async (req, res, next) => {
    try {
        const { email } = req.user
        const employee = await getEmployeeByEmail(email)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json({cardNo: employee.cardNo})
    } catch (err) {
        next(err)
    }
}

export const write = async (req, res, next) => {
    try {
        let { date: dateStr, price: priceStr, people: peopleStr, use, content } = req.body
        const date = sanitizeData(dateStr, 'date')
        const price = Number(priceStr)
        const people = Number(peopleStr)
        const { name, email } = req.user
        const employee = await getEmployeeByEmail(email)
        const perPrice = Math.round(price / people)
        if (!content) {
            content = ''
        }
        if (employee.cardNo) {
            const creditcard = CreditCard({date, name, email, cardNo: employee.cardNo, price, people, perPrice, use, content})
            await creditcard.save()
            res.status(200).json(creditcard)
        } else {
            throw createError(400, 'Something Wrong!')
        }
    } catch (err) {
        next(err)
    }
}

export const update = async (req, res, next) => {
    try {
        let { _id, date: dateStr, price: priceStr, people: peopleStr, use, content } = req.body
        const date = sanitizeData(dateStr, 'date')
        const price = Number(priceStr)
        const people = Number(peopleStr)
        const perPrice = Math.round(price / people)
        if (!content) {
            content = ''
        }
        await CreditCard.updateOne({_id}, {$set: {date, price, people, perPrice, use, content}}, {runValidators: true})
        res.status(204).send()
    } catch (err) {
        next(err)
    }
}

export const deleteCreditCardUse = async (req, res, next) => {
    try {
        const { _id } = req.body
        const creditcard = await CreditCard.deleteOne({_id})
        res.status(200).json(creditcard)
    } catch (err) {
        next(err)
    }
}

const getCreditCardUseHistory = async (req) => {
    const { name, startDate: startDateStr, endDate: endDateStr } = req.query
    const startDate = sanitizeData(startDateStr, 'date')
    const endDate = sanitizeData(endDateStr, 'date')
    const { email, department } = req.user

    let query = {date: {$gte: startDate, $lte: endDate}}
    if (['관리팀', '대표'].includes(department)) {
        if (name) query.name = name
    } else {
        query.email = email
    }
    return CreditCard.find(query).sort({ createdAt: -1 }).limit(LIMIT)
}