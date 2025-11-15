import { useState } from 'react'
import { Container, Grid } from '@mui/material'
import MeetingRoomCalendar from './MeetingRoomCalendar'
import MeetingRoomButtons from './MeetingRoomButtons'

const MeetingRoomContainer = () => {

    const [eventsData, setEventsData] = useState([])

    return (
        <Container maxWidth='xl' sx={{ mt: 1 }}>
            <Grid container spacing={1}>
                <Grid size={{ xs: 12, md: 12}}>
                    <MeetingRoomButtons 
                        eventsData={eventsData}
                        setEventsData={setEventsData}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 12}}>
                    <MeetingRoomCalendar 
                        eventsData={eventsData}
                        setEventsData={setEventsData}
                    />
                </Grid>
            </Grid>
        </Container>
    )
}

export default MeetingRoomContainer