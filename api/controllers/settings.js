import SystemSettings from '../models/SystemSettings.js'
import { createError } from '../utils/error.js'

export const getGeneralSettings = async (req, res, next) => {
    try {
        let settings = await SystemSettings.findOne()
        if (!settings) {
            settings = new SystemSettings()
            await settings.save()
        }
        res.status(200).json(settings)
    } catch (err) {
        next(err)
    }
}

export const updateGeneralSettings = async (req, res, next) => {
    try {
        let settings = await SystemSettings.findOne()
        if (!settings) {
            settings = new SystemSettings()
        }

        if (req.body.jobTitles) settings.jobTitles = req.body.jobTitles
        if (req.body.ranks) settings.ranks = req.body.ranks
        if (req.body.security) settings.security = req.body.security

        const updatedSettings = await settings.save()
        res.status(200).json(updatedSettings)
    } catch (err) {
        next(err)
    }
}
