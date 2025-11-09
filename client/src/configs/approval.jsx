import { Chip } from '@mui/material'

const StatusBadge = ({ value }) => {
    const status = value?.toLowerCase()

    const colorMap = {
        active: { bg: '#166534' },
        pending: { bg: '#92400e' },
        inProgress: { bg: '#991b1b' },
        cancel: { bg: '#dc2626' },
    }

    const { bg } = colorMap[status] || { bg: '#f1f5f9'}

    return (
        <Chip
            label={value}
            sx={{
                fontSize: '10px',
                textTransform: 'uppercase',
                fontWeight: 600,
                backgroundColor: bg,
                color: 'white',
                borderRadius: '4px',
                height: 18,   
            }}
            onClick={() => {}}
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