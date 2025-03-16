import Board from '../models/Board.js'
import { createError } from '../utils/error.js'
import { getDate, getNextDate, sanitizeData } from '../utils/util.js'

const BOARD_FIELDS = { id: 1, name: 1, title: 1, content: 1, createdAt: 1, updatedAt: 1 }

export const search = async (req, res, next) => {
    try {
        const { name, startDate: startDateStr, endDate: endDateStr } = req.query
        const startDate = getDate(sanitizeData(startDateStr, 'date'))
        const endDate = getNextDate(sanitizeData(endDateStr, 'date'))

        const query = name ? { name, createdAt: {$gte: startDate, $lte: endDate}} : {createdAt: {$gte: startDate, $lte: endDate}}
        const boards = await Board.find(query, BOARD_FIELDS).sort({ createdAt: -1 })
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(boards)
    } catch (err) {
        next(err)
    }
}

export const write = async (req, res, next) => {
    try {
        const { id, title, content } = req.body
        const { name, employeeId } = req.user
        const newBoard = Board({id, name: name, title, content, employeeId: employeeId})
        await newBoard.save()
        res.status(200).json(newBoard)
    } catch (err) {
        next(err)
    }
}

export const update = async (req, res, next) => {
    try {
        const { id, name, title, content } = req.body
        const board = await Board.findOne({id})

        if (!board) {
            throw createError(404, 'Board not found')
        }
        if (board.employeeId !== req.user.employeeId) {
            throw createError(403, "You don't have the authority to update this article")
        }

        await Board.updateOne({ id }, { $set: { name, title, content } }, { runValidators: true })
        res.status(204).send()
    } catch (err) {
        next(err)
    }
}

export const deleteBoard = async (req, res, next) => {
    try {
        const { id } = req.body
        const board = await Board.findOne({ id })

        if (!board) {
            throw createError(404, 'Board not found')
        }

        if (board.employeeId !== req.user.employeeId && !req.user.isAdmin) {
            throw createError(403, "You don't have the authority to delete this article")
        }

        await Board.deleteOne({ id })
        res.status(204).send()

    } catch (err) {
        next(err)
    }
}