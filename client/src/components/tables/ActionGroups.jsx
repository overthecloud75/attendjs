import { Button } from '@mui/material'
import { FileCheck, CreditCard, Plus } from 'lucide-react'

/**
 * Approval-specific actions (Attendance & Expense)
 */
import { Camera } from 'lucide-react'

export const ApprovalActions = ({ 
    onOpenApproval, 
    onOpenPayment, 
    onOpenScan,
    showApproval = true, 
    showPayment = true,
    showScan = false 
}) => (
    <>
        {showScan && (
            <Button
                variant='contained'
                onClick={onOpenScan}
                startIcon={<Camera size={18} />}
                sx={{ 
                    display: 'flex', 
                    textTransform: 'none', 
                    borderRadius: 2, 
                    boxShadow: 'none',
                    bgcolor: '#8b5cf6', // Violet color for AI feature
                    '&:hover': { bgcolor: '#7c3aed' }
                }}
            >
                영수증 스캔
            </Button>
        )}
        {showApproval && (
            <Button
                variant='contained'
                color='primary'
                startIcon={<FileCheck size={18} />}
                onClick={onOpenApproval}
                sx={{ display: 'flex', textTransform: 'none', borderRadius: 2, boxShadow: 'none' }}
            >
                근태 결재
            </Button>
        )}
        {showPayment && (
            <Button
                variant='contained'
                color='secondary'
                startIcon={<CreditCard size={18} />}
                onClick={onOpenPayment}
                sx={{ display: 'flex', textTransform: 'none', borderRadius: 2, boxShadow: 'none' }}
            >
                지출 결재
            </Button>
        )}
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
