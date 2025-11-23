import { useState } from 'react'
import { Box, Button, Stack } from '@mui/material'
import MeetingRoomBooking from './MeetingRoomBooking'

const MeetingRoomButtons = ({setEventsData}) => {
    const [openReservation, setOpenReservation] = useState(false)

    const handleReservationClick = () => setOpenReservation(true)

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, m: 1 }}>
            {openReservation && (
                <MeetingRoomBooking 
                    setEventsData={setEventsData}
                    open={openReservation} 
                    setOpenReservation={setOpenReservation} 
                />
            )}
            <Stack direction='row' spacing={1} flexWrap='wrap' justifyContent='flex-end' sx={{ width: '100%' }}>
                <Box sx={{ display: { sm: 'block' } }}>
                    <Button
                        variant='outlined'
                        color='info'
                        sx={{
                            textTransform: 'none',
                            px: 2,
                            py: 1,
                        }}
                        onClick={handleReservationClick}
                    >
                        회의실 예약하기
                    </Button>
                </Box>
            </Stack>
        </Box>
    )
}

export default MeetingRoomButtons