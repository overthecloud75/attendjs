import mongoose from 'mongoose'

const LeaveHistorySchema = new mongoose.Schema({
    employeeId: { type: Number, required: true, ref: 'Employee' },

    // 귀속 기간 (입사일 기준 N년차)
    // 예: 2023-05-01 입사자 -> 2024-05-01에 2년차 연차 발생 (nthYear: 2)
    nthYear: { type: Number, required: true },

    // 종류: '1년미만'(월차개념) / '1년이상'(연차)
    type: { type: String, enum: ['monthly', 'annual'], required: true },

    totalDays: { type: Number, required: true }, // 발생 일수
    usedDays: { type: Number, default: 0 }, // 사용 일수

    grantDate: { type: Date, required: true }, // 발생일 (예: 매월 개근일 or 1년 되는 날)
    expiryDate: { type: Date, required: true } // 소멸일 (발생일로부터 1년)
})

// 특정 사원의 특정 연차 찾기용 인덱스
LeaveHistorySchema.index({ employeeId: 1, nthYear: 1, type: 1 })

export default mongoose.model('LeaveHistory', LeaveHistorySchema)
