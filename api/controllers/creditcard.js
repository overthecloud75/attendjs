import CreditCard from '../models/CreditCard.js'
import { sanitizeData } from '../utils/util.js'

const LIMIT = 200

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
        const { date: dateString, price: priceString, people: peopleString, use } = req.body
        const date = sanitizeData(dateString, 'date')
        const price = Number(priceString)
        const people = Number(peopleString)
        const { name, email, cardNo } = req.user
        const perPrice = Math.round(price /people)
        if (cardNo) {
            const creditcard = CreditCard({date, name, email, cardNo, price, people, perPrice, use})
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
        const { _id, date: dateString, price: priceString, people: peopleString, use } = req.body
        const date = sanitizeData(dateString, 'date')
        const price = Number(priceString)
        const people = Number(peopleString)
        const perPrice = Math.round(price /people)
        await CreditCard.updateOne({_id}, {$set: {date, price, people, perPrice, use}}, {runValidators: true})
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
    const { name } = req.query
    const { email, department } = req.user
    // const startDate = sanitizeData(req.query.startDate, 'date')
    // const endDate = sanitizeData(req.query.endDate, 'date')
    let query = {}
    if (department==='관리팀') {
        if (name) query.name = name
    } else {
        query.email = email
    }
    return CreditCard.find(query).sort({ createdAt: -1 }).limit(LIMIT)
}