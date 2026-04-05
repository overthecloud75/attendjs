import Approval from '../models/Approval.js'
import LeaveService from '../services/LeaveService.js'
import EventService from '../services/EventService.js'
import { DateUtil, sanitizeData } from '../utils/util.js'
import { createError } from '../utils/error.js'
import { APPROVAL_STATUS } from '../config/domain.js'

const LIMIT = 1000

const STATUS = {
    PENDING: APPROVAL_STATUS.PENDING,
    ACTIVE: APPROVAL_STATUS.ACTIVE,
    CANCEL: APPROVAL_STATUS.CANCEL
}

export const search = async (req, res, next) => {
    try {
        const approvalHistory = await getApprovalHistory(req)
        res.status(200).setHeader('csrftoken', req.csrfToken()).json(approvalHistory)
    } catch (err) {
        next(err)
    }
}

export const update = async (req, res, next) => {
    try {
        const { _id, status } = req.body
        if (!_id) return next(createError(404, 'Approval not found!'))
        const approval = await Approval.findOne({ _id })
        if (!approval) return next(createError(404, 'Approval not found!'))

        if (approval.status === status || approval.status === STATUS.CANCEL) {
            return next(createError(400, 'Invalid status change'))
        }
        const updatedApproval = await updateApprovalStatus(approval, status, req.user.isAdmin)
        res.status(200).json(updatedApproval)
    } catch (err) {
        next(err)
    }
}

const updateApprovalStatus = async (approval, newStatus, isAdmin) => {
    const today = DateUtil.today() // YYYY-MM-DD string
    if (isAdmin) {
        if ((approval.status === STATUS.PENDING || approval.status === STATUS.ACTIVE) && newStatus === STATUS.CANCEL) {
            await EventService.makeCancel(approval)
            // [New] 연차 취소 시 환급 (이미 차감된 경우 복구)
            await LeaveService.refundLeave(approval)
            approval.status = STATUS.CANCEL
        } else if (approval.status === STATUS.PENDING && newStatus === STATUS.ACTIVE) {
            await EventService.makeActive(approval)
            // [New] 과거 날짜에 대한 뒤늦은 승인 시, 스케줄러가 놓쳤으므로 즉시 차감
            // today는 string이므로 비교 주의. start도 YYYY-MM-DD string임.
            if (approval.start < today) {
                await LeaveService.deductLeaveForApproval(approval)
            }
            approval.status = STATUS.ACTIVE
        } else {
            throw createError(400, 'Invalid status change for admin')
        }
    } else if ((approval.status === STATUS.PENDING && newStatus === STATUS.CANCEL) ||
        (approval.status === STATUS.ACTIVE && newStatus === STATUS.CANCEL && approval.start > today)) {
        await EventService.makeCancel(approval)
        // User는 미래 연차만 취소 가능하므로 usedDays 환급 필요 없음 (항상 0임)
        // 하지만 혹시 모를 로직 변경 대비 호출해도 무방함 (usedDays=0이면 아무일도 안일어남)
        await LeaveService.refundLeave(approval)
        approval.status = STATUS.CANCEL
    } else {
        throw createError(400, 'Invalid status change for user')
    }
    return approval
}

const getApprovalHistory = async (req) => {
    const { name, startDate: startDateStr, endDate: endDateStr } = req.query
    const startDate = DateUtil.parse(sanitizeData(startDateStr, 'date'))
    const endDate = DateUtil.addDays(sanitizeData(endDateStr, 'date'), 1)
    const { isAdmin, employeeId } = req.user

    let query = { createdAt: { $gte: startDate, $lte: endDate } }
    if (isAdmin) {
        if (name) query.name = name
    } else {
        query.employeeId = employeeId
    }
    return Approval.find(query).sort({ createdAt: -1 }).limit(LIMIT)
}