import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Stack, Typography } from '@mui/material'
import { FileCheck, CreditCard, Plus } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

import Approval from '../dashboard/Approval.jsx'
import Payment from './Payment.jsx'
import CsvDownload from './CsvDownload.jsx'
import { AdminEditablePages, UserEditablePages, pagesInfo } from '../../configs/pages.js'

const getEditablePages = (user) => (user.isAdmin ? AdminEditablePages : UserEditablePages)

import { ApprovalActions, EditableActions } from './ActionGroups.jsx'

const CustomTableButtons = ({
    page,
    data,
    csvHeaders,
    fileName,
    writeMode,
    setWriteMode,
    setOpenEditWrite,
    setSelectedRowData,
    setOpenUpdate,
}) => {
    const navigate = useNavigate()
    const { user } = useAuth()

    const editablePages = useMemo(() => getEditablePages(user), [user])

    const [openApproval, setOpenApproval] = useState(false)
    const [openPayment, setOpenPayment] = useState(false)

    const handleWriteClick = () => {
        setSelectedRowData({})
        setWriteMode(true)

        if (['board', 'report'].includes(page)) {
            setOpenEditWrite(true)
            return
        }

        if (page === 'creditcard') {
            setSelectedRowData({
                name: user.name,
                email: user.email,
                card: user.cardNo
            })
        }

        if (editablePages.includes(page)) {
            setOpenUpdate(true)
        }
    }

    const currentPageInfo = pagesInfo[page] || {}

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 0.5,
            px: 1,
            py: 0.5,
            gap: 2
        }}>
            {/* Modals */}
            {openApproval && (
                <Approval navigate={navigate} open={openApproval} setOpen={setOpenApproval} />
            )}
            {openPayment && (
                <Payment writeMode={writeMode} open={openPayment} setOpen={setOpenPayment} />
            )}

            {/* Page Title */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant='h5' sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{currentPageInfo.emoji}</span>
                    {currentPageInfo.title}
                </Typography>
            </Box>

            {/* Action Buttons */}
            <Stack direction='row' spacing={1.5} sx={{ alignItems: 'center' }}>
                {/* 1. Page-specific Actions */}
                {page === 'approval' && (
                    <ApprovalActions 
                        onOpenApproval={() => setOpenApproval(true)} 
                        onOpenPayment={() => setOpenPayment(true)} 
                    />
                )}

                {/* 2. Editable Content Actions */}
                {editablePages.includes(page) && (
                    <EditableActions onWriteClick={handleWriteClick} />
                )}

                {/* 3. Global Tools (Download, etc.) */}
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <CsvDownload data={data} csvHeaders={csvHeaders} fileName={fileName} />
                </Box>
            </Stack>
        </Box>
    )
}

export default CustomTableButtons