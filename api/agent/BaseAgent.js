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

            // Extract reasoning/thought if available (Supported by Gemma 4:26b, GPT-4, etc.)
            const reasoning = message.reasoning || message.thought || "";

            agentLogger.info({
                message: `[${this.name}] LLM Response`,
                sessionId,
                agentTrail: [this.name],
                llmRaw: message,
                reasoning, // Explicitly log reasoning for audit
                durationMs: duration
            });

            // Return both message and its reasoning
            return { ...message, reasoning };
        } catch (error) {
            // [CRITICAL] Native Tools Support Check
            // Detect if the model fails because it doesn't support the 'tools' parameter
            const errorData = error.response?.data?.error || {};
            const errorMsg = errorData.message || "";
            
            if (error.response?.status === 400 && (errorMsg.includes("tools") || errorMsg.includes("functions") || errorMsg.includes("unsupported_parameter"))) {
                const toolError = new Error("현재 설정된 모델이 Native Tools(함수 호출) 기능을 지원하지 않아 지능형 에이전트 가동이 불가능합니다. 작업을 중단합니다.");
                toolError.code = "TOOLS_NOT_SUPPORTED";
                toolError.status = 400; 
                throw toolError;
            }

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
     * Implements Error Masking to prevent Information Leakage.
     */
    handleError(error, sessionId, userFriendlyMsg = null) {
        // Detailed log stays SECURE on the server
        agentLogger.error({
            message: `[${this.name}] Specialized Error: ${error.message}`,
            sessionId,
            code: error.code,
            errorStack: error.stack
        });

        // ONLY sanitized metadata is returned to Master AI / Client
        return this.wrapResponse(userFriendlyMsg || `[${this.name}] 요청하신 작업을 처리하는 중 기술적인 이슈가 발생했습니다.`, {
            type: 'ERROR',
            code: error.code || 'INTERNAL_ERROR'
            // [SECURITY] Removed 'originalError: error.message' to prevent leakage
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
