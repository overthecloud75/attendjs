import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import FullCalendar from '@fullcalendar/react' 
import dayGridPlugin from '@fullcalendar/daygrid' 
import interactionPlugin from '@fullcalendar/interaction'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { getColor, getEvents, addEvent, deleteEvent, getWindowDimension } from '../utils/EventUtil'
import Approval from './Approval'
import { getUser } from '../storage/userSlice.js'

const mobileSize = 800

const Wrapper = styled.div`
    padding: 10px;
`

const Button = styled.button`
    background-color: #0071c2;
    color: white;
    font-weight: 500;
    border: none;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
`

const GetCalendar = ({navigate, weekends, setWeekends, tapValue}) => {

    const calendarRef = useRef()
    const [headerToolbar, setHeaderToolbar] = useState({
        start: 'title', 
        center: '',
        end: 'today prev,next'
    })
    const [eventsData, setEventsData] = useState([])
    const [thisMonth, setThisMonth] = useState('')
    const user = getUser()

    useEffect(() => {
        const calendarApiView = calendarRef.current.getApi().view
        const args = {start: calendarApiView.activeStart, end: calendarApiView.activeEnd}
        
        const fetchData = async () => {
            const events = await getEvents(args, tapValue)
            if (events.err) {
                const errorStatus = events.err.response.data.status
                if (errorStatus === 401) { 
                    navigate('/login')
                }
            } else {
                setEventsData(events.data)
                // eslint-disable-next-line
                const {width, height} = getWindowDimension()
                if (width < mobileSize) {
                    setWeekends(false)
                    setHeaderToolbar({start: '', center: '', end: 'today prev,next'})
                }
            }
        }
        if (thisMonth!=='') {fetchData()}
    // eslint-disable-next-line
    }, [thisMonth, tapValue])

    const handleDateSelect = async (selectInfo) => {
        let title = prompt('Please enter a new title for your event')
        let calendarApi = selectInfo.view.calendar
    
        calendarApi.unselect() // clear date selection

        if (title) {
            let event = {
                id: Date.now(),
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr
            }
            const result = await addEvent(event)
            if (!result.err) {
                event = getColor(event)
                calendarApi.addEvent(event)
            }
        }
    }
    
    const handleEventClick = async (clickInfo) => {
        if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
            const result = await deleteEvent(clickInfo.event)
            if (!result.err) {
                clickInfo.event.remove()
            }
        }
    }

    const handleDates = async (datesInfo) => {
        setThisMonth(datesInfo.view.title)
    }
    
    return (
        <FullCalendar
            ref={calendarRef}
            plugins={[ dayGridPlugin, interactionPlugin ]}
            initialView='dayGridMonth'
            headerToolbar={headerToolbar}
            editable={user.isAdmin}
            selectable={user.isAdmin}
            events={eventsData}
            weekends={weekends}
            select={user.isAdmin?handleDateSelect:false}
            eventClick={user.isAdmin?handleEventClick:false}
            datesSet={handleDates}
            contentHeight='auto'
        />
    )
}

const Calendar = () => {

    const navigate = useNavigate()

    const [weekends, setWeekends] = useState(true)
    const [tapValue, setTapValue] = useState('team')
    const [openApproval, setOpenApproval] = useState(false)

    const handleTapChange = (event, newTapValue) => {
        if (tapValue !== newTapValue) {
            setTapValue(newTapValue)
        }
    }

    const handleApprovalClick = () => {
        setOpenApproval(true)
    }

    return (
        <Wrapper>
            {openApproval&&(
                <Approval
                    navigate={navigate}
                    open={openApproval}
                    setOpen={setOpenApproval}
                />
            )}
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'right', alignItems: 'center', marginBottom: '10px' }}>
                {weekends && (
                    <Tabs
                        value={tapValue}
                        onChange={handleTapChange}
                        textColor='secondary'
                        indicatorColor='secondary'
                    >
                        <Tab value='private' label='Private' />
                        <Tab value='team' label='Team' />
                        <Tab value='company' label='Company' />        
                    </Tabs>)
                }
                <Button onClick={handleApprovalClick}>근태 결재</Button>
            </Box>
            <GetCalendar
                navigate={navigate}
                weekends={weekends}
                setWeekends={setWeekends}
                tapValue={tapValue}
            />
        </Wrapper>
    )
}

export default Calendar