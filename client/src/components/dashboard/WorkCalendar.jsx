import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Paper, Typography, FormControlLabel, Checkbox } from '@mui/material'
import { getEventsInCalendar } from '../../utils/EventUtil'
import { useWindowDimension } from '../../hooks/useWindowDimension'
import { MOBILE } from '../../configs/mobile'
import './Calendar.css'
import { useResponsive } from '../../hooks/useResponsive'

const WorkCalendar = () => {

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
        const calendarApiView = calendarRef.current?.getApi()?.view
        if (!calendarApiView) return

        const args = {start: calendarApiView.activeStart, end: calendarApiView.activeEnd}
        
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
                if (width < MOBILE.size) {
                    setWeekends(false)
                    setHeaderToolbar({start: '', center: '', end: 'today prev,next'})
                }
            }
        }
        if (thisMonth) {fetchData()}
    }, [thisMonth, selectedType])

    const handleDates = async (datesInfo) => {
        setThisMonth(datesInfo.view.title)
    }

    const handleTypeChange = (type) => {
        if (selectedType !== type) {
            setSelectedType(type)
        }
    }

    return (
        <Paper sx={{ px: 2, py: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                <Typography variant='h6'>
                    근무 캘린더
                </Typography>
                {!isMobile && (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedType === 'private'}
                                    onChange={() => handleTypeChange('private')}
                                />
                            }
                            label='개인'
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedType === 'team'}
                                    onChange={() => handleTypeChange('team')}
                                />
                            }
                            label='팀'
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedType === 'company'}
                                    onChange={() => handleTypeChange('company')}
                                />
                            }
                            label='회사'
                        />
                    </div>
                 )}
            </div>
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin]}
                headerToolbar={headerToolbar}
                initialView='dayGridMonth'
                events={eventsData}
                weekends={weekends}
                datesSet={handleDates}
                contentHeight={'auto'}
                locale='ko'
                dayMaxEventRows={2}   // 한 셀에 최대 2줄만 표시
            />
        </Paper>
    )
}

export default WorkCalendar