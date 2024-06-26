import Board from '../models/Board.js'
import { createError } from '../utils/error.js'

export const search = async (req, res, next) => {
    try {
        const name = req.query.name
        // const startDate = req.query.startDate
        // const endDate = req.query.endDate
        let boards
        if (name) {
            // to test NoSQL injection name = {$ne: null}
            // boards = await Board.find({name : {$ne: null}}).sort({createdAt: -1})  NoSQL Success
            // boards = await Board.find({name : '{$ne: '1'}'}).sort({createdAt: -1}) Not NoSQL Success
            boards = await Board.find({name}, {id: 1, name: 1, title: 1, content: 1, createdAt: 1, updatedAt: 1}).sort({createdAt: -1})
        } else { 
            boards = await Board.find({}, {id: 1, name: 1, title: 1, content: 1, createdAt: 1, updatedAt: 1}).sort({createdAt: -1})
        }
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(boards)
    } catch (err) {
        next(err)
    }
}

export const write = async (req, res, next) => {
    try {
        const id = req.body.id
        const title = req.body.title
        const content = req.body.content
        console.log(req.user)

        const newBoard = Board({id, name: req.user.name, title, content, employeeId: req.user.employeeId})
        await newBoard.save()
        res.status(200).json(newBoard)
    } catch (err) {
        next(err)
    }
}

export const update = async (req, res, next) => {
    try {
        const id = req.body.id
        const name = req.body.name
        const title = req.body.title
        const content = req.body.content

        const board = await Board.findOne({id})

        if (board && (board.employeeId === req.user.employeeId)) {
            await Board.updateOne({id}, {$set: {id, name, title, content}}, {runValidators: true})
            res.status(204).send() 
        } else {
            return next(createError(401, "You don't have the authority to update the article"))
        }
    } catch (err) {
        next(err)
    }
}

export const deleteBoard = async (req, res, next) => {
    try {
        const id = req.body.id
        const board = await Board.findOne({id})

        if (board && (board.employeeId === req.user.employeeId | req.user.isAdmin)) {
            await Board.deleteOne({id})
            res.status(204).send()  
        } else {
            return next(createError(401, "You don't have the authority to delete the article"))
        }

    } catch (err) {
        next(err)
    }
}