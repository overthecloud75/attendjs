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

export const update = async (req, res, next) => {
    try {
        const { price, people, use } = req.body
        const { name, email } = req.user
        const perPrice = (Number(price) / Number(people)).parseInt()
        await CreditCard.updateOne({_id}, {$set: {name, email, price, people, perPrice, use}}, {runValidators: true})
        res.status(204).send()
    } catch (err) {
        next(err)
    }
}

const getCreditCardHistory = async (req) => {
    const { name } = req.query
    const { isAdmin, email } = req.user
    // const startDate = sanitizeData(req.query.startDate, 'date')
    // const endDate = sanitizeData(req.query.endDate, 'date')
    let query = {}
    if (isAdmin) {
        if (name) query.name = name
    } else {
        query.email = email
    }
    return CreditCard.find(query).sort({ createdAt: -1 }).limit(LIMIT)
}