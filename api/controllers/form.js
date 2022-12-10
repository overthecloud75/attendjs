import { logger, reqFormat } from '../config/winston.js'

export const csrfToken = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        res.status(200).setHeader('csrftoken', req.csrfToken()).json([])
    } catch (err) {
        next(err)
    }
}
