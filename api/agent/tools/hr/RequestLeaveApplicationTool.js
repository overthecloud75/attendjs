import BaseTool from '../../BaseTool.js'

/**
 * Leave Application (HITL) Tool
 * Prepares a leave application request that requires user confirmation.
 */
class RequestLeaveApplicationTool extends BaseTool {
    constructor() {
        const schema = {
            type: "object",
            properties: {
                date: { type: "string", description: "The date of leave (YYYY-MM-DD)" },
                leaveType: { type: "string", enum: ["Full", "AM", "PM"], description: "Type of leave" },
                reason: { type: "string", description: "Reason for taking leave" }
            },
            required: ["date", "leaveType", "reason"]
        }
        super('request_leave_application', 'Start the process of applying for a leave. This requires user confirmation (HITL).', schema, true);
    }

    async run(user, args, sessionId) {
        // Return Raw Action Parameters for the Agent to process
        return {
            status: 'PREPARED',
            action: 'LEAVE_APPLICATION',
            date: args.date,
            leaveType: args.leaveType,
            reason: args.reason,
            confirmationRequired: true
        };
    }
}

export default new RequestLeaveApplicationTool();
