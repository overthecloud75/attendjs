import express from 'express'

const ping = async (req, res, next) => {
    try {
        res.status(200).send('')
    } catch (err) {
        next(err)
    }
}

const router = express.Router()

router.get('/', ping)

export default router