import LeaveService from '../services/LeaveService.js'

/**
 * 에이전트 전용 지능형 도구 상자 (Tool Box)
 * definition: LLM에게 전달할 도구의 스펙 (JSON Schema)
 * handler: 실제 실행할 비즈니스 로직
 * isHITL: 사용자 확인(Human-in-the-loop)이 필요한 도구인지 여부
 */
export const tools = [
    {
        definition: {
            type: "function",
            function: {
                name: "get_leave_balance",
                description: "Retrieve the remaining annual leave days for the current user.",
                parameters: { type: "object", properties: {} }
            }
        },
        isHITL: false,
        handler: async (user) => {
            if (!user.beginDate) {
                return "현재 인사 시스템에 입사일 정보가 등록되어 있지 않습니다. 마이페이지에서 확인해 주세요."
            }
            const summary = await LeaveService.getLeftLeaveSummary({ 
                employeeId: user.employeeId, 
                name: user.name, 
                beginDate: user.beginDate 
            })
            if (!summary) return "연차 정보를 조회할 수 없습니다."
            return `현재 ${user.name}님의 남은 연차 정산 결과는 **${summary.leftAnnualLeave}일**입니다. (총 ${summary.defaultAnnualLeave}일 중 사용량 제외)`
        }
    },
    {
        definition: {
            type: "function",
            function: {
                name: "request_leave_application",
                description: "Start the process of applying for a leave. This requires user confirmation (HITL).",
                parameters: {
                    type: "object",
                    properties: {
                        date: { type: "string", description: "The date of leave (YYYY-MM-DD)" },
                        leaveType: { type: "string", enum: ["Full", "AM", "PM"], description: "Type of leave" },
                        reason: { type: "string", description: "Reason for taking leave" }
                    },
                    required: ["date", "leaveType", "reason"]
                }
            }
        },
        isHITL: true,
        handler: async (user, args) => {
            // HITL이 필요한 도구이므로, 실행 시점에 승인 요청 형식을 반환
            return {
                type: 'ACTION_REQUIRED',
                tool: 'request_leave_application',
                params: args,
                message: `**[상신 대기]** ${args.date}일(${args.leaveType})에 연차를 신청할까요? 사유: ${args.reason}`
            }
        }
    }
]
