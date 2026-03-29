import { Button } from '@mui/material'
import { FileCheck, CreditCard, Plus } from 'lucide-react'

/**
 * Approval-specific actions (Attendance & Expense)
 */
export const ApprovalActions = ({ onOpenApproval, onOpenPayment }) => (
    <>
        <Button
            variant='contained'
            color='primary'
            startIcon={<FileCheck size={18} />}
            onClick={onOpenApproval}
            sx={{ display: { xs: 'none', sm: 'flex' }, textTransform: 'none', borderRadius: 2, boxShadow: 'none' }}
        >
            근태 결재
        </Button>
        <Button
            variant='contained'
            color='secondary'
            startIcon={<CreditCard size={18} />}
            onClick={onOpenPayment}
            sx={{ display: 'flex', textTransform: 'none', borderRadius: 2, boxShadow: 'none' }}
        >
            지출 결재
        </Button>
    </>
)

/**
 * generic "New" action for editable pages
 */
export const EditableActions = ({ onWriteClick }) => (
    <Button
        variant='contained'
        color='success'
        startIcon={<Plus size={18} />}
        onClick={onWriteClick}
        sx={{ display: { xs: 'none', sm: 'flex' }, textTransform: 'none', borderRadius: 2, boxShadow: 'none' }}
    >
        New
    </Button>
)
