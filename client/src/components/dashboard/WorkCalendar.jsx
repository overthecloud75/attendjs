import { useState, useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Paper, Typography } from '@mui/material'
import { getEventsInCalendar } from '../../utils/EventUtil'
import { useWindowDimension } from '../../hooks/useWindowDimension'
import { MOBILE } from '../../configs/mobile'
import '../Calendar.css'
import { useResponsive } from '../../hooks/useResponsive'

const WorkCalendar = () => {

    const {isMobile} = useResponsive()
    const calendarRef = useRef()
    
    const [eventsData, setEventsData] = useState([])
    const [weekends, setWeekends] = useState(true)
    const [thisMonth, setThisMonth] = useState('')
    const [headerToolbar, setHeaderToolbar] = useState({
            start: 'title', 
            center: '',
            end: 'today prev,next'
        })
    const { width } = useWindowDimension()

    useEffect(() => {
        const calendarApiView = calendarRef.current.getApi().view
        const args = {start: calendarApiView.activeStart, end: calendarApiView.activeEnd}
        
        const fetchData = async () => {
            const events = await getEventsInCalendar(args, 'private')
            if (events.err) {
                const errorStatus = events.err.response.data.status
                if (errorStatus === 401) { 
                    sessionStorage.removeItem('user')
                    navigate('/login')
                }
            } else {
                setEventsData(events.data)
                if (width < MOBILE.size) {
                    setWeekends(false)
                    setHeaderToolbar({start: '', center: '', end: 'today prev,next'})
                }
            }
        }
        if (thisMonth) {fetchData()}
    }, [thisMonth])

    const handleDates = async (datesInfo) => {
        setThisMonth(datesInfo.view.title)
    }

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant='h6' gutterBottom>
                근무 캘린더
            </Typography>
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin]}
                headerToolbar={headerToolbar}
                initialView='dayGridMonth'
                events={eventsData}
                weekends={weekends}
                datesSet={handleDates}
                contentHeight={isMobile ? 400 : 'auto'}
                locale='ko'
            />
        </Paper>
    )
}

export default WorkCalendar