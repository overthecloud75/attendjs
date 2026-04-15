import { Box, Stack } from '@mui/material'
import { useAuth } from '../../hooks/useAuth'
import { AdminEditablePages, UserEditablePages } from '../../configs/pages.js'
import { ApprovalActions, EditableActions } from './ActionGroups.jsx'

const getEditablePages = (user) => (user.isAdmin ? AdminEditablePages : UserEditablePages)

const CustomTableButtons = ({
    page,
    onWriteClick,
    onOpenApproval,
    onOpenPayment
}) => {
    const { user } = useAuth()
    const editablePages = getEditablePages(user)

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            py: 0.5,
            gap: 2
        }}>
            <Stack direction='row' spacing={1.5} sx={{ alignItems: 'center' }}>
                {/* 1. Page-specific Actions (Approval/Payment) */}
                {page === 'approval' && (
                    <ApprovalActions 
                        onOpenApproval={onOpenApproval} 
                        onOpenPayment={onOpenPayment} 
                    />
                )}

                {/* 2. Editable Content Actions (Write/Create) */}
                {editablePages.includes(page) && (
                    <EditableActions onWriteClick={onWriteClick} />
                )}
            </Stack>
        </Box>
    )
}

export default CustomTableButtons