import axios from 'axios'
import { agentLogger } from '../config/winston.js'

/**
 * [Base Class] Agent Infrastructure
 * Standardizes LLM communication, log traceability, and response structure.
 */
class BaseAgent {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    /**
     * Define agent-specific tools. Should be overridden by subclasses.
     */
    getTools() {
        return [];
    }

    /**
     * Standard internal LLM call with built-in logging.
     * @param {Object} options { user, command, messages, llmConfig, sessionId, tools, toolChoice }
     */
    async callLLM({ command, messages, llmConfig, sessionId, tools, toolChoice = "auto" }) {
        const payload = {
            model: llmConfig.model,
            messages,
            tools: tools || this.getTools(),
            tool_choice: toolChoice
        };

        agentLogger.info({
            message: `[${this.name}] LLM Request`,
            sessionId,
            agentTrail: [this.name],
            command,
            requestPayload: payload
        });

        const startTime = Date.now();
        try {
            const response = await axios.post(`${llmConfig.baseURL}/chat/completions`, payload, {
                headers: { 
                    'Authorization': `Bearer ${llmConfig.apiKey}`, 
                    'Content-Type': 'application/json' 
                }
            });

            const duration = Date.now() - startTime;
            const message = response.data.choices[0].message;

            agentLogger.info({
                message: `[${this.name}] LLM Response`,
                sessionId,
                agentTrail: [this.name],
                llmRaw: message,
                durationMs: duration
            });

            return message;
        } catch (error) {
            agentLogger.error({
                message: `[${this.name}] LLM Error: ${error.message}`,
                sessionId,
                errorStack: error.stack
            });
            throw error;
        }
    }

    /**
     * Standard response factory.
     */
    wrapResponse(content, metadata = {}) {
        return {
            agent: this.name,
            content,
            ...metadata,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Standard error handler for specialists.
     * Reports errors in a way the Master AI can synthesize gracefully.
     */
    handleError(error, sessionId, userFriendlyMsg = null) {
        agentLogger.error({
            message: `[${this.name}] Specialized Error: ${error.message}`,
            sessionId,
            errorStack: error.stack
        });

        return this.wrapResponse(userFriendlyMsg || `[${this.name}] 요청을 처리하는 과정에서 기술적인 오류가 발생했습니다.`, {
            type: 'ERROR',
            code: error.code || 'INTERNAL_ERROR',
            originalError: error.message
        });
    }

    /**
     * Common security & existence check.
     */
    validateTarget(target, name = '정보') {
        if (!target) {
            const error = new Error(`${name}를 찾을 수 없습니다.`);
            error.code = 'NOT_FOUND';
            throw error;
        }
        return true;
    }
}

export default BaseAgent;
