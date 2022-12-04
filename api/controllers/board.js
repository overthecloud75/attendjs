import { logger, reqFormat } from '../config/winston.js'
import Board from '../models/Board.js'

export const search = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const name = req.query.name
        // const startDate = req.query.startDate
        // const endDate = req.query.endDate
        let boards
        if (name && name !== '') {
            // to test NoSQL injection name = {$ne: null}
            // console.log({name}) = { name: '{$ne: null}'}
            // boards = await Board.find({name : {$ne: null}}).sort({createdAt: -1})  NoSQL Success
            // boards = await Board.find({name : '{$ne: '1'}'}).sort({createdAt: -1}) Not NoSQL Success
            boards = await Board.find({name}).sort({createdAt: -1})
        }
        else { 
            boards = await Board.find().sort({createdAt: -1});
        }
        res.status(200).json(boards)
    } catch (err) {
        console.log('err', err)
        next(err);
    }
}

export const write = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const id = req.body.id
        const name = req.body.name
        const title = req.body.title
        const content = req.body.content

        const board = await Board.updateOne({id}, {$set: {id, name, title, content}}, {upsert: true})
        res.status(200).json(board)
    } catch (err) {
        console.log('err', err)
        next(err);
    }
}

export const deleteBoard = async (req,res,next) => {
    logger.info(reqFormat(req))
    try {
        const id = req.body.id
        const board = await Board.deleteOne({id})
        console.log('deleteId', id, board)
        res.status(200).json(board)
    } catch (err) {
        console.log('err', err)
        next(err);
    }
}