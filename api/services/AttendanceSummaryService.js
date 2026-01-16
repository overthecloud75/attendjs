import { WORKING } from '../config/working.js'

export default class AttendanceSummaryService {

    static summarizeAttends(attends) {
        const summary = {}
        for (const attend of attends) {
            const { employeeId, name, workingHours, status, reason } = attend
            if (!(String(employeeId) in summary)) {
                summary[employeeId] = this.initializeSummary(employeeId, name)
            }
            this.updateSummary(summary[employeeId], workingHours, status, reason)
        }
        return summary
    }

    static initializeSummary(employeeId, name) {
        const summary = { employeeId, name, days: 0, workingHours: 0 }
        WORKING.inStatus.forEach(inStatus => { summary[inStatus] = 0 })
        Object.keys(WORKING.outStatus).forEach(outStatus => { summary[outStatus] = 0 })
        return summary
    }

    static updateSummary(summary, workingHours, status, reason) {
        summary.days++
        summary.workingHours += workingHours
        if (status) summary[status]++
        if (reason === '출근') summary['정상출근']++
        else if (reason) summary[reason]++
    }

    static summaryWorkingHours(summary) {
        let summaryList = []
        for (const id in summary) {
            summary[id].workingHours = Math.round(summary[id].workingHours * 10) / 10
            summary[id].workingDays = summary[id].days
            for (const key in summary[id]) {
                if (key in WORKING.offDay) {
                    summary[id].workingDays = summary[id].workingDays - summary[id][key] * WORKING.offDay[key]
                }
            }
            summary[id].workingDays = Math.round(summary[id].workingDays * 100) / 100
            summaryList.push(summary[id])
        }
        return summaryList
    }
}
