import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Stack } from '@mui/material'
import Approval from '../dashboard/Approval.jsx'
import Payment from './Payment.jsx'
import CsvDownload from './CsvDownload.jsx'
import { AdminEditablePages, UserEditablePages } from '../../configs/pages.js'
import { getUser } from '../../storage/userSlice.js'

const getEditablePages = (user) => (user.isAdmin ? AdminEditablePages : UserEditablePages)

const CustomTableButtons = ({
    url,
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
        if (['board', 'report'].includes(url)) {
        setOpenEditWrite(true)
        } else if (url === 'creditcard') {
        setSelectedRowData({ name: user.name, email: user.email, card: user.cardNo })
        setOpenUpdate(true)
        } else if (editablePages.includes(url)) {
        setOpenUpdate(true)
        }
    }

    const handleAttendClick = () => setOpenApproval(true)
    const handlePaymentClick = () => setOpenPayment(true)

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, m: 1 }}>
            {openApproval && (
                <Approval navigate={navigate} open={openApproval} setOpen={setOpenApproval} />
            )}
            {openPayment && (
                <Payment writeMode={writeMode} open={openPayment} setOpen={setOpenPayment} />
            )}

            <Stack direction='row' spacing={1} flexWrap='wrap' justifyContent='flex-end' sx={{ width: '100%' }}>
                {url === 'approval' && (
                <>
                    <Button variant='contained' color='primary' onClick={handleAttendClick}>
                        근태 결재
                    </Button>
                    <Button variant='contained' color='secondary' onClick={handlePaymentClick}>
                        지출 결재
                    </Button>
                </>
                )}

                {editablePages.includes(url) && (
                    <Button variant='contained' color='success' onClick={handleWriteClick}>
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