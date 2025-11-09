import { useState, useEffect, useMemo, useRef} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Box, Typography } from '@mui/material'
import { format } from 'date-fns'
import { useWindowDimension } from '../../hooks/useWindowDimension'
import { MOBILE } from '../../configs/mobile'
import { getUser } from '../../storage/userSlice'
import { getMeetingsInCalendar, deleteMeetingInCalendar } from '../../utils/EventUtil'
import MeetingRoomForm from './MeettngRoomForm'

const MeetingRoomCalendar = ({eventsData, setEventsData}) => {

    const user = useMemo(() => getUser(), [])

    const { width } = useWindowDimension()
    const calendarRef = useRef()

    const [weekends, setWeekends] = useState(false)
    const [headerToolbar, setHeaderToolbar] = useState({
        start: 'prev,next today', 
        center: 'title',
        right: ''
    })
    const [room, setRoom] = useState('대회의실')

    useEffect(() => {
        if (width < MOBILE.size) {
            setWeekends(false)
            setHeaderToolbar({ 
                left: 'prev,next today',
                center: '',
                right: '' 
            })
        } else {
            setWeekends(true)
            setHeaderToolbar({
                left: 'prev,next today',
                center: 'title',
                right: '' 
            })
        }
    }, [width])

    useEffect(() => {
        const calendarApiView = calendarRef.current?.getApi()?.view
        if (!calendarApiView) return

        const args = {start: calendarApiView.activeStart, end: calendarApiView.activeEnd}
        
        const fetchData = async () => {
            const events = await getMeetingsInCalendar(args, room)
            if (events.err) {
                const errorStatus = events.err.response.data.status
                if (errorStatus === 401) { 
                    sessionStorage.removeItem('user')
                    navigate('/login')
                }
            } else {
                setEventsData(events.data)
            }
        }
        {fetchData()}
    }, [room])

    const handleEventClick = async (clickInfo) => {
        if (window.confirm(`'${clickInfo.event.title}' 정말로 event를 지우기를 원하시나요?`)) {
            const result = await deleteMeetingInCalendar(clickInfo.event)
            if (!result.err) {
                clickInfo.event.remove()
            }
        }
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Typography variant='h5' fontWeight='bold' mb={2} sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                <MeetingRoomForm
                    room={room}
                    setRoom={setRoom}
                /> 예약 현황 📅
            </Typography>
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={headerToolbar}
                initialView='timeGridWeek'
                editable={user.isAdmin}
                selectable={user.isAdmin}
                events={eventsData}
                eventContent={(arg) => {
                    const { title, start, end, extendedProps } = arg.event
                    const name = extendedProps.name || ''
                    const timeRange = `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`
                    return {
                        html: `
                        <small>신청자 : <strong>${name}</strong></small><br>
                        <small>주제 : <strong>${title}</strong></small><br>
                        <small>시간 : <strong>${timeRange}</strong></small>
                        `
                    }
                }}
                eventClick={user.isAdmin?handleEventClick:false}
                contentHeight='auto'
                locale='ko'
                weekends={weekends}
                allDaySlot={false}
                slotMinTime='09:00:00'
                slotMaxTime='18:00:00'
                slotDuration='00:20:00'
            />
        </Box>
    )
}

export default MeetingRoomCalendar