import { logger, reqFormat } from '../config/winston.js'

export const csrfToken = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        res.status(200).json({CSRFToken: req.csrfToken()})
    } catch (err) {
        next(err)
    }
}
