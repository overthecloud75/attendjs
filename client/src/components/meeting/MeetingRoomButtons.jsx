import { useState } from 'react'
import { Box, Button } from '@mui/material'
import { CalendarPlus } from 'lucide-react'
import MeetingRoomBooking from './MeetingRoomBooking'

const MeetingRoomButtons = ({ setEventsData }) => {
    const [openReservation, setOpenReservation] = useState(false)

    const handleReservationClick = () => setOpenReservation(true)

    return (
        <>
            <Button
                variant='contained'
                startIcon={<CalendarPlus size={18} />}
                onClick={handleReservationClick}
                sx={{
                    bgcolor: 'var(--text-active)',
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 2,
                    py: 0.8,
                    boxShadow: 'none',
                    '&:hover': {
                        bgcolor: 'var(--text-active)',
                        opacity: 0.9,
                        boxShadow: 'none'
                    },
                    transition: 'all 0.2s'
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
        </>
    )
}

export default MeetingRoomButtons