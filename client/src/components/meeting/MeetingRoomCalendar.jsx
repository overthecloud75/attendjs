import { useState, useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Box, Typography, Paper, Stack, FormControlLabel, Switch } from '@mui/material'
import { format } from 'date-fns'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

import { useWindowDimension } from '../../hooks/useWindowDimension'
import { MOBILE } from '../../configs/mobile'
import { getMeetingsInCalendar, deleteMeetingInCalendar } from '../../utils/EventUtil'
import SmallMeetingRoomForm from './SmallMeetingRoomForm'
import './MeetingRoomCalendar.css'

const MeetingRoomCalendar = ({ eventsData, setEventsData }) => {

    const { user } = useAuth()

    const { width } = useWindowDimension()
    const calendarRef = useRef()

    const [weekends, setWeekends] = useState(false)
    const [thisWeek, setThisWeek] = useState('')
    const [headerToolbar, setHeaderToolbar] = useState({
        start: 'prev,next today',
        center: 'title',
        right: ''
    })
    const [room, setRoom] = useState('대회의실')

    useEffect(() => {
        const calendarApi = calendarRef.current?.getApi()
        if (width < MOBILE.size) {
            setHeaderToolbar({
                left: 'prev,next today',
                center: '',
                right: ''
            })
            if (calendarApi) calendarApi.changeView('timeGridDay')
        } else {
            setHeaderToolbar({
                left: 'prev,next today',
                center: 'title',
                right: ''
            })
            if (calendarApi) calendarApi.changeView('timeGridWeek')
        }
    }, [width])

    const handleDates = async (datesInfo) => {
        setThisWeek(datesInfo.view.title)
    }

    useEffect(() => {
        const calendarApiView = calendarRef.current?.getApi()?.view
        if (!calendarApiView) return

        const args = { start: calendarApiView.activeStart, end: calendarApiView.activeEnd }

        const fetchData = async () => {
            const events = await getMeetingsInCalendar(args, room)
            if (events.err) {
                const errorStatus = events.err.response.data.status
                if (errorStatus === 401) {
                    sessionStorage.removeItem('user')
                    window.location.href = '/login'
                }
            } else {
                setEventsData(events.data)
            }
        }
        fetchData()
    }, [thisWeek, room])

    const handleEventClick = async (clickInfo) => {
        // Microsoft 365 동기화 일정은 삭제 처리 방지
        const isGraphEvent = clickInfo.event.extendedProps.source === 'graph'
        if (isGraphEvent) {
            alert('Microsoft 365에서 동기화된 외부 일정은 이 시스템에서 삭제할 수 없습니다. Outlook에서 관리해 주세요.')
            return
        }

        if (window.confirm(`'${clickInfo.event.title}' 회의실 예약을 삭제하시겠습니까?`)) {
            const result = await deleteMeetingInCalendar(clickInfo.event)
            if (!result.err) {
                clickInfo.event.remove()
            }
        }
    }

    return (
        <Paper
            elevation={0}
            sx={{
                px: { xs: 1, sm: 3 },
                py: { xs: 1, sm: 2 },
                borderRadius: 3,
                border: '1px solid var(--border-color)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                bgcolor: 'var(--card-bg)'
            }}
        >
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                sx={{ 
                    justifyContent: "space-between", 
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    mb: 1, 
                    gap: 2 
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        bgcolor: '#eff6ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#3b82f6'
                    }}>
                        <CalendarIcon size={20} />
                    </Box>
                    <Typography variant='h6' fontWeight='600' color="var(--text-primary)">
                        회의실 예약 현황
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControlLabel
                        control={
                            <Switch 
                                checked={weekends} 
                                onChange={(e) => setWeekends(e.target.checked)}
                                size="small"
                                sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#3b82f6' },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#3b82f6' }
                                }}
                            />
                        }
                        label={
                            <Typography variant="body2" fontWeight="500" color="var(--text-secondary)">
                                주말 표시
                            </Typography>
                        }
                    />
                    <Box sx={{ minWidth: 200 }}>
                        <SmallMeetingRoomForm
                            room={room}
                            setRoom={setRoom}
                        />
                    </Box>
                </Box>
            </Stack>

            <Box
                sx={{
                    '& .fc': { fontFamily: 'inherit' },
                    '& .fc-col-header-cell-cushion': { color: 'var(--text-secondary)', fontWeight: 600, py: 1 },
                    '& .fc-timegrid-slot-label-cushion': { color: 'var(--text-secondary)', fontSize: '0.85rem' },
                    '& .fc-theme-standard td, .fc-theme-standard th': { borderColor: 'var(--border-color)' },
                    '& .fc-header-toolbar': { mb: 3 },
                    '& .fc-buttons .fc-button': { // Added .fc-buttons to be more specific if possible, but keeping .fc-button is fine
                        bgcolor: 'var(--bg-primary)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-color)',
                        boxShadow: 'none',
                        textTransform: 'capitalize',
                        fontWeight: 500
                    },
                    '& .fc-button': {
                        bgcolor: 'var(--bg-primary)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-color)',
                        boxShadow: 'none',
                        textTransform: 'capitalize',
                        fontWeight: 500
                    },
                    '& .fc-button:hover': { bgcolor: 'var(--hover-bg)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' },
                    '& .fc-button-active': { bgcolor: '#eff6ff !important', color: '#3b82f6 !important', borderColor: '#3b82f6 !important' },
                    '& .fc-today-button': { fontWeight: 600 },
                    '& .fc-toolbar-title': { color: 'var(--text-primary)' },
                    '& .fc-event': { borderRadius: '6px', border: 'none', padding: '2px' }
                }}
            >
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={headerToolbar}
                    initialView='timeGridWeek'
                    datesSet={handleDates}
                    editable={user.isAdmin}
                    selectable={user.isAdmin}
                    events={eventsData}
                    eventContent={(arg) => {
                        const { event } = arg
                        const { title, extendedProps, start, end } = event
                        const timeText = `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`

                        return (
                            <Box sx={{ p: '4px 6px', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <Stack spacing={0}>
                                    <Typography variant="caption" noWrap sx={{ fontSize: '0.7rem', opacity: 0.9, color: 'rgba(255,255,255,0.9)' }}>
                                        {`${title} - ${timeText}`}
                                    </Typography>
                                    <Typography variant="caption" noWrap sx={{ fontSize: '0.7rem', opacity: 0.8, color: 'rgba(255,255,255,0.8)' }}>
                                        {extendedProps.name}
                                    </Typography>
                                </Stack>
                            </Box>
                        )
                    }}
                    eventClick={user.isAdmin ? handleEventClick : undefined}
                    eventDidMount={(info) => {
                        const { title, start, end, extendedProps } = info.event
                        const name = extendedProps.name || ''
                        const meetingType = extendedProps.meetingType || ''
                        const timeRange = `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`
                        if (title) {
                            tippy(info.el, {
                                content: `
                                    <div style="padding: 4px;">
                                        <div style="margin-bottom: 2px;">출처: <span style="font-weight: 600; color: ${extendedProps.source === 'graph' ? '#8b5cf6' : '#3b82f6'}">${extendedProps.source === 'graph' ? 'MS Outlook' : '사내 예약 시스템'}</span></div>
                                        <div style="margin-bottom: 2px;">신청자: <span style="font-weight: 600;">${name}</span></div>
                                        <div style="margin-bottom: 2px;">주제: <span style="font-weight: 600;">${title}</span></div>
                                        <div style="margin-bottom: 2px;">시간: <span style="font-weight: 600;">${timeRange}</span></div>
                                        <div>종류: <span style="font-weight: 600;">${meetingType}</span></div>
                                    </div>
                                `,
                                allowHTML: true,
                                placement: 'top',
                                theme: 'light-border',
                            })
                        }
                    }}
                    contentHeight='auto'
                    locale='ko'
                    weekends={weekends}
                    allDaySlot={false}
                    expandRows={false}
                    slotMinTime='08:00:00'
                    slotMaxTime='20:00:00'
                    slotDuration='00:30:00'
                />
            </Box>
        </Paper>
    )
}

export default MeetingRoomCalendar