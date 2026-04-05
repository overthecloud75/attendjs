import { Chip, Button, Tooltip, IconButton } from '@mui/material'
import { X as XIcon } from 'lucide-react'
import axios from 'axios'
import { getToday } from '../utils/DateUtil'
import { APPROVAL_STATUS } from '../configs/domain'

const CancelRequestButton = ({ row }) => {
    const today = getToday()
    const status = row.status // 'Pending', 'Active', 'Cancel', etc.
    const isCancelable = (status === APPROVAL_STATUS.PENDING || status === APPROVAL_STATUS.ACTIVE) && row.start >= today

    if (!isCancelable || status === APPROVAL_STATUS.CANCEL) return null

    const handleCancel = async (e) => {
        e.stopPropagation() // 상세 모달이 뜨는 것을 방지

        const confirmMsg = status === APPROVAL_STATUS.ACTIVE
            ? "승인 완료된 신청입니다. 취소 시 관리자에게 알림이 전송됩니다.\n정말로 이 결재 신청을 취소하시겠습니까? 취소된 내용은 복구할 수 없습니다."
            : "정말로 이 결재 신청을 취소하시겠습니까? 취소된 내용은 복구할 수 없습니다."

        if (!window.confirm(confirmMsg)) return

        try {
            await axios.post(`/api/event/approval/cancel-by-user/${row._id}`)
            alert('결재 신청이 취소되었습니다.')
            window.location.reload()
        } catch (err) {
            console.error('Cancel Error:', err)
            alert('취소 처리 중 오류가 발생했습니다.')
        }
    }

    return (
        <Tooltip title="결재 신청 취소">
            <IconButton
                size="small"
                color="error"
                onClick={handleCancel}
                sx={{
                    width: 28,
                    height: 28,
                    bgcolor: 'rgba(239, 68, 68, 0.08)',
                    '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.15)' }
                }}
            >
                <XIcon size={16} />
            </IconButton>
        </Tooltip>
    )
}

const StatusBadge = ({ value }) => {
    // value가 없을 경우 처리
    if (!value) return null;

    const status = value.toLowerCase()

    const statusConfig = {
        // 승인됨/완료
        active: { label: '승인', bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
        approved: { label: '승인', bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },

        // 대기중
        pending: { label: '대기', bg: '#fef9c3', color: '#854d0e', border: '#fde047' },
        wait: { label: '대기', bg: '#fef9c3', color: '#854d0e', border: '#fde047' },

        // 진행중
        inprogress: { label: '진행중', bg: '#e0f2fe', color: '#075985', border: '#bae6fd' },

        // 반려/취소/거절
        cancel: { label: '취소', bg: '#fee2e2', color: '#991b1b', border: '#fecaca' },
        rejected: { label: '반려', bg: '#fee2e2', color: '#991b1b', border: '#fecaca' },

        // 기본
        default: { label: value, bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' }
    }

    const config = statusConfig[status] || statusConfig.default

    return (
        <Chip
            label={config.label}
            size="small"
            sx={{
                height: 24,
                fontSize: '0.75rem',
                fontWeight: 600,
                bgcolor: config.bg,
                color: config.color,
                border: `1px solid ${config.border}`,
                borderRadius: '6px',
                '& .MuiChip-label': { px: 1 }
            }}
        />
    )
}

export const columnHeaders = [
    {
        accessorKey: 'approvalType',
        header: 'Type',
        enableSorting: true,
    },
    {
        accessorKey: 'name',
        header: '이름',
        enableSorting: true,
    },
    {
        accessorKey: 'email',
        header: 'Email',
        enableSorting: true,
    },
    {
        accessorKey: 'department',
        header: '부서',
        enableSorting: true,
    },
    {
        accessorKey: 'start',
        header: '시작일',
        enableSorting: true,
    },
    {
        accessorKey: 'end',
        header: '종료일',
        enableSorting: true,
    },
    {
        accessorKey: 'reason',
        header: '사유',
        enableSorting: true,
    },
    {
        accessorKey: 'etc',
        header: '기타',
        enableSorting: true,
    },
    {
        accessorKey: 'status',
        header: '상태',
        enableSorting: true,
        cell: ({ getValue }) => <StatusBadge value={getValue()} />
    },
    {
        id: 'cancel',
        header: '취소',
        cell: ({ row }) => <CancelRequestButton row={row.original} />
    },
    {
        accessorKey: 'createdAt',
        header: 'CreatedAt',
        enableSorting: true,
    },
]

export const mobileColumnHeaders = [
    {
        accessorKey: 'approvalType',
        header: 'Type',
        enableSorting: true,
    },
    {
        accessorKey: 'name',
        header: '이름',
        enableSorting: true,
    },
    {
        accessorKey: 'start',
        header: '시작일',
        enableSorting: true,
    },
    {
        accessorKey: 'end',
        header: '종료일',
        enableSorting: true,
    },
    {
        accessorKey: 'reason',
        header: '사유',
        enableSorting: true,
    },
    {
        accessorKey: 'etc',
        header: '기타',
        enableSorting: true,
    },
    {
        accessorKey: 'status',
        header: '상태',
        enableSorting: true,
        cell: ({ getValue }) => <StatusBadge value={getValue()} />
    },
    {
        id: 'cancel',
        header: '취소',
        cell: ({ row }) => <CancelRequestButton row={row.original} />
    },
]

export const attendUpdateColumnHeaders = [
    {
        accessorKey: 'approvalType',
        header: 'Type',
        enableSorting: true,
    },
    {
        accessorKey: 'name',
        header: '이름',
        enableSorting: true,
    },
    {
        accessorKey: 'email',
        header: 'Email',
        enableSorting: true,
    },
    {
        accessorKey: 'start',
        header: '시작일',
        enableSorting: true,
    },
    {
        accessorKey: 'end',
        header: '종료일',
        enableSorting: true,
    },
    {
        accessorKey: 'reason',
        header: '사유',
        enableSorting: true,
    },
    {
        accessorKey: 'etc',
        header: '기타',
        enableSorting: true,
    },
    {
        accessorKey: 'status',
        header: '상태',
        enableSorting: true,
    },
    {
        accessorKey: 'createdAt',
        header: '작성',
        enableSorting: true,
    },
]

export const paymentUpdateColumnHeaders = [
    {
        accessorKey: 'approvalType',
        header: 'Type',
        enableSorting: true,
    },
    {
        accessorKey: 'name',
        header: '이름',
        enableSorting: true,
    },
    {
        accessorKey: 'email',
        header: 'Email',
        enableSorting: true,
    },
    {
        accessorKey: 'start',
        header: '시작일',
        enableSorting: true,
    },
    {
        accessorKey: 'cardNo',
        header: '카드번호',
        enableSorting: true,
    },
    {
        accessorKey: 'reason',
        header: '사유',
        enableSorting: true,
    },
    {
        accessorKey: 'etc',
        header: '기타',
        enableSorting: true,
    },
    {
        accessorKey: 'status',
        header: '상태',
        enableSorting: true,
    },
    {
        accessorKey: 'content',
        header: '증빙',
        enableSorting: true,
    },
    {
        accessorKey: 'createdAt',
        header: '작성',
        enableSorting: true,
    }
]

export const csvHeaders = [
    {
        key: 'approvalType',
        label: 'Type',
    },
    {
        key: 'name',
        label: '이름',
    },
    {
        key: 'email',
        label: 'Email',
    },
    {
        key: 'department',
        label: '부서',
    },
    {
        key: 'start',
        label: '시작일',
    },
    {
        key: 'end',
        label: '종료일',
    },
    {
        key: 'reason',
        label: '사유',
    },
    {
        key: 'etc',
        label: '기타',
    },
    {
        key: 'status',
        label: '상태',
    },
    {
        key: 'approverName',
        label: '결재자',
    },
    {
        key: 'createdAt',
        label: 'CreatedAt',
    },
]