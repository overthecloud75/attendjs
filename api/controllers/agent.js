import AgentService from '../services/AgentService.js'
import AgentActivity from '../models/AgentActivity.js'
import User from '../models/User.js'

/**
 * Controller: Agentic Conversation & History management
 */
export const executeCommand = async (req, res, next) => {
    try {
        const { command, isConfirmed, pendingAction, sessionId } = req.body
        const user = await AgentService.hydrateUserContext(req.user)

        if (!command && !isConfirmed) {
            return res.status(400).json({ error: 'Command is required' })
        }

        const result = await AgentService.processCommand(user, command, isConfirmed, pendingAction, sessionId)
        res.status(200).json({ response: result })
    } catch (err) {
        next(err)
    }
}

export const getHistory = async (req, res, next) => {
    try {
        const user = await AgentService.hydrateUserContext(req.user)
        const historyData = await AgentActivity.find({ userId: user._id || user.id })
            .sort({ createdAt: -1 })
            .limit(10)
        res.status(200).json({ history: historyData })
    } catch (err) {
        next(err)
    }
}

export const deleteHistory = async (req, res, next) => {
    try {
        const { id } = req.params
        await AgentActivity.findByIdAndDelete(id)
        res.status(200).json({ message: 'History record deleted' })
    } catch (err) {
        next(err)
    }
}
