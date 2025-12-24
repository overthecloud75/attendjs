import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Box, Button, Stack, Typography } from '@mui/material'
import { FileCheck, CreditCard, Plus } from 'lucide-react'

import Approval from '../dashboard/Approval.jsx'
import Payment from './Payment.jsx'
import CsvDownload from './CsvDownload.jsx'
import { AdminEditablePages, UserEditablePages, pagesInfo } from '../../configs/pages.js'

const getEditablePages = (user) => (user.isAdmin ? AdminEditablePages : UserEditablePages)

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
    const user = useSelector(state => state.user)

    // Determine which pages are editable for the current user
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
                {page === 'approval' && (
                    <>
                        <Button
                            variant='contained'
                            color='primary'
                            startIcon={<FileCheck size={18} />}
                            onClick={() => setOpenApproval(true)}
                            sx={{ display: { xs: 'none', sm: 'flex' }, textTransform: 'none', borderRadius: 2, boxShadow: 'none' }}
                        >
                            근태 결재
                        </Button>
                        <Button
                            variant='contained'
                            color='secondary'
                            startIcon={<CreditCard size={18} />}
                            onClick={() => setOpenPayment(true)}
                            sx={{ display: { xs: 'none', sm: 'flex' }, textTransform: 'none', borderRadius: 2, boxShadow: 'none' }}
                        >
                            지출 결재
                        </Button>
                    </>
                )}

                {editablePages.includes(page) && (
                    <Button
                        variant='contained'
                        color='success'
                        startIcon={<Plus size={18} />}
                        onClick={handleWriteClick}
                        sx={{ display: { xs: 'none', sm: 'flex' }, textTransform: 'none', borderRadius: 2, boxShadow: 'none' }}
                    >
                        New
                    </Button>
                )}

                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <CsvDownload data={data} csvHeaders={csvHeaders} fileName={fileName} />
                </Box>
            </Stack>
        </Box>
    )
}

export default CustomTableButtons