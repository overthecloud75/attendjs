import { agentLogger } from '../config/winston.js';

/**
 * [Core] Base Tool Infrastructure
 * Standardizes tool execution, automatic logging, and LLM schema definition.
 */
class BaseTool {
    constructor(name, description, schema, isHITL = false) {
        this.name = name;
        this.description = description;
        this.schema = schema; // JSON Schema for parameters
        this.isHITL = isHITL; // Human-In-The-Loop flag
    }

    /**
     * Returns the tool definition in the format expected by OpenAI/Gemma tools.
     */
    getDefinition() {
        return {
            type: 'function',
            function: {
                name: this.name,
                description: this.description,
                parameters: this.schema
            }
        };
    }

    /**
     * Wrapped execution that handles logging and error management.
     * @param {Object} user User context
     * @param {Object} args Tool arguments from LLM
     * @param {String} sessionId Tracing ID
     */
    async execute(user, args, sessionId) {
        const startTime = Date.now();

        // 1. Log Execution Start
        agentLogger.info({
            message: `[${this.name}] Executing Tool`,
            sessionId,
            toolUsed: this.name,
            toolArgs: args,
            intent: 'TOOL_EXEC'
        });

        try {
            // 2. Run the actual business logic (implemented in subclasses)
            const result = await this.run(user, args, sessionId);
            const durationMs = Date.now() - startTime;

            // 3. Log Execution Result (Observation)
            // This ensures tool data is captured in both text logs and DB trails
            agentLogger.info({
                message: `[${this.name}] Tool Result Received`,
                sessionId,
                toolUsed: this.name,
                observation: (typeof result === 'object') ? JSON.stringify(result) : result,
                durationMs,
                intent: 'TOOL_RES'
            });

            return result;
        } catch (error) {
            const durationMs = Date.now() - startTime;
            
            agentLogger.error({
                message: `[${this.name}] Tool Execution Failed: ${error.message}`,
                sessionId,
                toolUsed: this.name,
                errorStack: error.stack,
                durationMs
            });

            throw error; // Let the specialist agent or AgentService handle the fallback
        }
    }

    /**
     * Business logic implementation. Subclasses MUST override this.
     */
    async run(user, args, sessionId) {
        throw new Error(`Tool "${this.name}" does not have a run() implementation.`);
    }
}

export default BaseTool;
