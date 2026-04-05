import SystemSettings from '../models/SystemSettings.js'
import axios from 'axios'

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
        if (req.body.llm) settings.llm = req.body.llm

        const updatedSettings = await settings.save()
        res.status(200).json(updatedSettings)
    } catch (err) {
        next(err)
    }
}

/**
 * Validates the LLM configuration by sending a minimal test request.
 */
export const testLlmConnection = async (req, res) => {
    try {
        const { apiKey, baseURL, model } = req.body
        const cleanBaseUrl = baseURL ? baseURL.trim().replace(/\/$/, '') : 'https://api.openai.com/v1'
        const testUrl = cleanBaseUrl.includes('/chat/completions') 
            ? cleanBaseUrl 
            : `${cleanBaseUrl}/chat/completions`

        const response = await axios.post(testUrl,
            {
                model: model || 'gpt-4o',
                messages: [{ role: 'user', content: 'Connection Test' }],
                max_tokens: 5
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'AttendJS-Agentic-Canvas/1.0.0'
                },
                timeout: 10000 // 10s timeout
            }
        )
        if (response.status === 200) {
            res.status(200).json({ success: true, message: 'Connection Successful!' })
        } else {
            res.status(400).json({ success: false, message: `Status Code: ${response.status}` })
        }
    } catch (err) {
        console.error('LLM connection test error:', err.message)
        res.status(500).json({ success: false, message: err.response?.data?.error?.message || err.message })
    }
}
