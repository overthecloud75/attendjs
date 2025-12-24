import { useState } from 'react'
import { Box, Button } from '@mui/material'
import { CalendarPlus } from 'lucide-react'
import MeetingRoomBooking from './MeetingRoomBooking'

const MeetingRoomButtons = ({ setEventsData }) => {
    const [openReservation, setOpenReservation] = useState(false)

    const handleReservationClick = () => setOpenReservation(true)

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mb: 1
        }}>
            <Button
                variant='contained'
                startIcon={<CalendarPlus size={18} />}
                onClick={handleReservationClick}
                sx={{
                    bgcolor: '#3b82f6',
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 2.5,
                    py: 1,
                    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)',
                    '&:hover': {
                        bgcolor: '#2563eb',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.5)',
                        transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease-in-out'
                }}
            >
                회의실 예약
            </Button>

            {openReservation && (
                <MeetingRoomBooking
                    setEventsData={setEventsData}
                    open={openReservation}
                    setOpenReservation={setOpenReservation}
                />
            )}
        </Box>
    )
}

export default MeetingRoomButtons