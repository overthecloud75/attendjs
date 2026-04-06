import BaseTool from '../../BaseTool.js'
import AttendanceService from '../../../services/AttendanceService.js'
import AttendanceSummaryService from '../../../services/AttendanceSummaryService.js'

/**
 * Attendance History Search Tool
 * Analyzes clock-in/out patterns and summarizes working hours per user.
 */
class GetAttendanceHistoryTool extends BaseTool {
    constructor() {
        const schema = {
            type: 'object',
            properties: {
                startDate: { type: 'string', description: '조회 시작일 (YYYY-MM-DD)' },
                endDate: { type: 'string', description: '조회 종료일 (YYYY-MM-DD)' }
            },
            required: ['startDate', 'endDate']
        }
        super('get_attendance_history', '특정 기간의 출퇴근 기록 및 근무 시간 분석 데이터를 조회합니다.', schema);
    }

    /**
     * Logic: Fetch and summarize attendance history
     */
    async run(user, { startDate, endDate }, sessionId) {
        const query = { name: user.name, startDate, endDate };
        const records = await AttendanceService.getAttends(query);

        if (!records || records.length === 0) {
            return {
                records: [],
                totalSummary: { workingDays: 0, totalWorkingHours: 0 },
                message: "해당 기간의 출퇴근 기록을 찾을 수 없습니다."
            };
        }

        const summary = AttendanceSummaryService.summarizeAttends(records);
        const userSummary = summary[user.employeeId] || {};

        return {
            records: records.map(r => ({
                date: r.date,
                clockIn: r.start,
                clockOut: r.end,
                workingHours: r.workingHours,
                status: r.status,
                reason: r.reason
            })),
            totalSummary: {
                workingDays: userSummary.days || 0,
                totalWorkingHours: Math.round((userSummary.workingHours || 0) * 10) / 10
            }
        };
    }
}

export default new GetAttendanceHistoryTool();
