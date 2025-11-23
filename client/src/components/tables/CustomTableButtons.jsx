import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Stack, Typography } from '@mui/material'
import Approval from '../dashboard/Approval.jsx'
import Payment from './Payment.jsx'
import CsvDownload from './CsvDownload.jsx'
import { AdminEditablePages, UserEditablePages } from '../../configs/pages.js'
import { getUser } from '../../storage/userSlice.js'
import { pagesInfo } from '../../configs/pages.js'

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
    const user = useMemo(() => getUser(), [])
    const editablePages = useMemo(() => getEditablePages(user), [user])
    const navigate = useNavigate()
    const [openApproval, setOpenApproval] = useState(false)
    const [openPayment, setOpenPayment] = useState(false)

    const handleWriteClick = () => {
        setSelectedRowData({})
        setWriteMode(true)
        if (['board', 'report'].includes(page)) {
        setOpenEditWrite(true)
        } else if (page === 'creditcard') {
        setSelectedRowData({ name: user.name, email: user.email, card: user.cardNo })
        setOpenUpdate(true)
        } else if (editablePages.includes(page)) {
        setOpenUpdate(true)
        }
    }

    const handleAttendClick = () => setOpenApproval(true)
    const handlePaymentClick = () => setOpenPayment(true)

    return (
        <Box sx={{ display: 'flex', gap: 2, m: 1 }}>
            {openApproval && (
                <Approval navigate={navigate} open={openApproval} setOpen={setOpenApproval} />
            )}
            {openPayment && (
                <Payment writeMode={writeMode} open={openPayment} setOpen={setOpenPayment} />
            )}
            <Stack direction='row' spacing={1} ml={2} sx={{ width: '100%', alignItems: 'center' }}>
                <Typography variant='h6' sx={{ textTransform: 'none' }}>{`${pagesInfo[page].emoji} ${pagesInfo[page].title}`}</Typography>
            </Stack>
            <Stack direction='row' spacing={1} justifyContent='flex-end' sx={{ width: '100%', alignItems: 'center' }}>
                {page === 'approval' && (
                    <>
                        <Button 
                            variant='contained' 
                            color='primary' 
                            onClick={handleAttendClick} 
                            sx={{ display: { xs: 'none', sm: 'block' }, py: 0.7 }}
                        >
                            근태 결재
                        </Button>
                        <Button 
                            variant='contained' 
                            color='secondary' 
                            onClick={handlePaymentClick}
                            sx={{ py: 0.7 }}
                        >
                            지출 결재
                        </Button>
                    </>
                )}

                {editablePages.includes(page) && (
                    <Button 
                        variant='contained' 
                        color='success' 
                        onClick={handleWriteClick} 
                        sx={{ display: { xs: 'none', sm: 'block' }, py: 0.7 }}
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