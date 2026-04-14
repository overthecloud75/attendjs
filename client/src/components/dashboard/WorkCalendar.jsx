import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Paper, Typography, Box, ToggleButton, ToggleButtonGroup, Stack, Chip } from '@mui/material'
import { Calendar as CalendarIcon, User, Users, Building2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

import { getColor, getSpecialHolidays, getEventsInCalendar, addEventInCalendar, deleteEventInCalendar } from '../../utils/EventUtil'
import { useWindowDimension } from '../../hooks/useWindowDimension'
import { MOBILE } from '../../configs/mobile'
import { useResponsive } from '../../hooks/useResponsive'
import './WorkCalendar.css'

const WorkCalendar = () => {

    const { user } = useAuth()
    const navigate = useNavigate()
    const { isMobile } = useResponsive()
    const calendarRef = useRef()

    const [eventsData, setEventsData] = useState([])
    const [weekends, setWeekends] = useState(true)
    const [thisMonth, setThisMonth] = useState('')
    const [headerToolbar, setHeaderToolbar] = useState({
        start: 'title',
        center: '',
        end: 'today prev,next'
    })

    // 일정 타입 선택: private, team, company
    const [selectedType, setSelectedType] = useState('private')
    const { width } = useWindowDimension()

    useEffect(() => {
        if (width < MOBILE.size) {
            setWeekends(false)
            setHeaderToolbar({ start: '', center: '', end: 'today prev,next' })
        } else {
            setWeekends(true)
            setHeaderToolbar({ start: 'title', center: '', end: 'today prev,next' })
        }
    }, [width])

    // Update to match new Calendar behavior - fetch events when month or type changes
    useEffect(() => {
        const calendarApiView = calendarRef.current?.getApi()?.view
        if (!calendarApiView) return

        const args = { start: calendarApiView.activeStart, end: calendarApiView.activeEnd }

        const fetchData = async () => {
            const events = await getEventsInCalendar(args, selectedType)
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

        if (thisMonth) { fetchData() }
        // Fetch initially if no month set yet but calendar handles dateSet immediately
    }, [thisMonth, selectedType])

    const handleDates = async (datesInfo) => {
        setThisMonth(datesInfo.view.title)
    }

    const handleTypeChange = (event, newAlignment) => {
        if (newAlignment !== null) {
            setSelectedType(newAlignment)
        }
    }

    const handleDateSelect = async (selectInfo) => {
        const specialHolidays = getSpecialHolidays()
        let title = prompt(`'${specialHolidays}' 중 하나만 입력 가능합니다.`)
        let calendarApi = selectInfo.view.calendar

        calendarApi.unselect() // clear date selection

        if (title) {
            let event = {
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr
            }
            const result = await addEventInCalendar(event)
            if (!result.err) {
                event = getColor(event)
                calendarApi.addEvent(event)
            }
        }
    }

    const handleEventClick = async (clickInfo) => {
        if (window.confirm(`'${clickInfo.event.title}' 일정을 삭제하시겠습니까?`)) {
            const result = await deleteEventInCalendar(clickInfo.event)
            if (!result.err) {
                clickInfo.event.remove()
            }
        }
    }

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                border: '1px solid var(--border-color)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                height: '100%',
                bgcolor: 'var(--card-bg)'
            }}
        >
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ 
                    justifyContent: "space-between", 
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    mb: 1 
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        bgcolor: '#e0e7ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#4f46e5'
                    }}>
                        <CalendarIcon size={20} />
                    </Box>
                    <Typography variant='h6' color="var(--text-primary)" sx={{ fontWeight: '600' }}>
                        근무 캘린더
                    </Typography>
                </Box>

                {!isMobile && (
                    <ToggleButtonGroup
                        value={selectedType}
                        exclusive
                        onChange={handleTypeChange}
                        aria-label="schedule type"
                        size="small"
                        sx={{
                            '& .MuiToggleButton-root': {
                                borderRadius: '8px !important',
                                border: '1px solid var(--border-color)',
                                mx: 0.5,
                                px: 2,
                                py: 0.5,
                                textTransform: 'none',
                                fontWeight: 500,
                                color: 'var(--text-secondary)'
                            },
                            '& .Mui-selected': {
                                bgcolor: '#eff6ff !important',
                                color: '#3b82f6 !important',
                                borderColor: '#3b82f6 !important',
                                fontWeight: 600
                            }
                        }}
                    >
                        <ToggleButton value="private">
                            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                <User size={14} />
                                <span>개인</span>
                            </Stack>
                        </ToggleButton>
                        <ToggleButton value="team">
                            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                <Users size={14} />
                                <span>팀</span>
                            </Stack>
                        </ToggleButton>
                        <ToggleButton value="company">
                            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                <Building2 size={14} />
                                <span>회사</span>
                            </Stack>
                        </ToggleButton>
                    </ToggleButtonGroup>
                )}
            </Stack>

            <Box
                sx={{
                    // Override FullCalendar styles
                    '& .fc': { fontFamily: 'inherit' },
                    '& .fc-col-header-cell-cushion': { color: 'var(--text-primary)', fontWeight: 600, py: 1.5 },
                    '& .fc-daygrid-day-number': { color: 'var(--text-secondary)', fontSize: '0.875rem', p: 1 },
                    '& .fc-theme-standard td, .fc-theme-standard th': { borderColor: 'var(--border-color)' },
                    '& .fc-header-toolbar': { mb: 2 },
                    '& .fc-button': {
                        bgcolor: 'var(--bg-primary)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-color)',
                        boxShadow: 'none',
                        textTransform: 'capitalize',
                        fontWeight: 500,
                        transition: 'all 0.2s'
                    },
                    '& .fc-button:hover': { bgcolor: 'var(--hover-bg)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' },
                    '& .fc-button-active': { bgcolor: 'var(--bg-active) !important', color: 'var(--text-active) !important', borderColor: 'var(--text-active) !important' },
                    '& .fc-today-button': { fontWeight: 600 },
                    '& .fc-day-today': { bgcolor: 'var(--hover-bg) !important' },
                    '& .fc-toolbar-title': { color: 'var(--text-primary)' },
                    '& .fc-event': { borderRadius: '4px', border: 'none', padding: '1px 3px', fontSize: '0.75rem' },
                    '& .fc-more-link': { color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.75rem' },
                    '& .fc-popover': {
                        bgcolor: 'var(--card-bg)',
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    },
                    '& .fc-popover-header': {
                        bgcolor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontWeight: 600,
                        borderBottom: '1px solid var(--border-color)'
                    },
                    '& .fc-popover-body': {
                        bgcolor: 'var(--card-bg)',
                    },
                    '& .fc-popover-title': {
                        color: 'var(--text-primary)'
                    }
                }}
            >
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    headerToolbar={headerToolbar}
                    initialView='dayGridMonth'
                    editable={user.isAdmin}
                    selectable={user.isAdmin}
                    events={eventsData}
                    weekends={weekends}
                    select={user.isAdmin ? handleDateSelect : false}
                    eventClick={user.isAdmin ? handleEventClick : false}
                    datesSet={handleDates}
                    contentHeight='auto'
                    locale='ko'
                    dayMaxEventRows={2}
                />
            </Box>
        </Paper >
    )
}

export default WorkCalendar