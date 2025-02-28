import CreditCard from '../models/CreditCard.js'
import { sanitizeData } from '../utils/util.js'

const LIMIT = 1000

export const search = async (req, res, next) => {
    try {
        const creditcardHistory = await getCreditCardHistory(req)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(creditcardHistory)
    } catch (err) {
        next(err)
    }
}

export const write = async (req, res, next) => {
    try {
        let { date: dateString, price: priceString, people: peopleString, use, content } = req.body
        const date = sanitizeData(dateString, 'date')
        const price = Number(priceString)
        const people = Number(peopleString)
        const { name, email, cardNo } = req.user
        const perPrice = Math.round(price / people)
        if (!content) {
            content = ''
        }
        if (cardNo) {
            const creditcard = CreditCard({date, name, email, cardNo, price, people, perPrice, use, content})
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
        let { _id, date: dateString, price: priceString, people: peopleString, use, content } = req.body
        const date = sanitizeData(dateString, 'date')
        const price = Number(priceString)
        const people = Number(peopleString)
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

export const deleteCreditCard = async (req,res,next) => {
    try {
        const { _id } = req.body
        const creditcard = await CreditCard.deleteOne({_id})
        res.status(200).json(creditcard)
    } catch (err) {
        next(err)
    }
}

const getCreditCardHistory = async (req) => {
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