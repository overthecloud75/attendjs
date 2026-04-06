import BaseTool from '../../BaseTool.js'
import LeaveService from '../../../services/LeaveService.js'

/**
 * Leave Balance Retrieval Tool
 * Fetches remaining annual leave days for the employee.
 */
class GetLeaveBalanceTool extends BaseTool {
    constructor() {
        super(
            'get_leave_balance', 
            'Retrieve the remaining annual leave days for the current user.', 
            { type: 'object', properties: {} }
        );
    }

    async run(user, args, sessionId) {
        if (!user.beginDate) {
            return { error: 'Incomplete user profile (Missing beginDate)' };
        }

        const summary = await LeaveService.getLeftLeaveSummary({ 
            employeeId: user.employeeId, 
            name: user.name, 
            beginDate: user.beginDate 
        });

        if (!summary) return { error: 'No leave data found' };

        // Return Raw Data for the Agent to process
        return {
            userName: user.name,
            employeeId: user.employeeId,
            accruedDays: summary.defaultAnnualLeave,
            usedDays: summary.defaultAnnualLeave - summary.leftAnnualLeave,
            remainingDays: summary.leftAnnualLeave,
            unit: 'Days',
            summaryString: `Accrued: ${summary.defaultAnnualLeave}, Used: ${summary.defaultAnnualLeave - summary.leftAnnualLeave}`
        };
    }
}

export default new GetLeaveBalanceTool();
