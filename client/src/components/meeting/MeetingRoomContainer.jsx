import { Box } from '@mui/material'
import MeetingRoomCalendar from './MeetingRoomCalendar'

const MeetingRoomContainer = ({ eventsData, setEventsData }) => {
    return (
        <Box sx={{ mt: 2 }}>
            <MeetingRoomCalendar 
                eventsData={eventsData} 
                setEventsData={setEventsData} 
            />
        </Box>
    )
}

export default MeetingRoomContainer