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

const Calendar = () => {

    const navigate = useNavigate()

    const calendarRef = useRef()

    const [tapValue, setTapValue] = useState('team')
    const [weekends, setWeekends] = useState(true)
    const [headerToolbar, setHeaderToolbar] = useState({
        start: 'title', 
        center: '',
        end: 'today prev,next'
    })
    const [error, setError] = useState(false)
    const [openApproval, setOpenApproval] = useState(false)

    const handleTapChange = (event, newTapValue) => {
        if (tapValue !== newTapValue) {
            setTapValue(newTapValue)
            let calendarApi = calendarRef.current.getApi()
            calendarApi.refetchEvents()
        }
    }

    const handleApprovalClick = () => {
        setOpenApproval(true)
    }
    
    const initialEvents = async (args) => {
        // To Do 
        // tapValue is not changed. why? 
        const events = await getEvents(args, tapValue)
        setError(events.err)
        return events.data
    }

    useEffect(() => {
        const fetchData = () => {
            if (error) {
                const errorStatus = error.response.data.status
                if (errorStatus === 401) { 
                    navigate('/login')
                }
            } else {
                // eslint-disable-next-line
                const {width, height} = getWindowDimension()
                if (width < mobileSize) {
                    setWeekends(false)
                    setHeaderToolbar({start: '', center: '', end: 'today prev,next'})
                }
            }
        }
        fetchData()
    // eslint-disable-next-line
    }, [error])

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
    
    return (
        <Wrapper>
            {openApproval&&(
                <Approval
                    open={openApproval}
                    setOpen={setOpenApproval}
                />
            )}
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'right', alignItems: 'center' }}>
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
                <Button onClick={handleApprovalClick}>APPROVAL</Button>
            </Box>
            <FullCalendar
                ref={calendarRef}
                plugins={[ dayGridPlugin, interactionPlugin ]}
                initialView='dayGridMonth'
                headerToolbar={headerToolbar}
                editable={true}
                selectable={true}
                initialEvents={initialEvents}
                weekends={weekends}
                select={handleDateSelect}
                eventClick={handleEventClick}
                contentHeight='auto'
            />
        </Wrapper>
    )
}

export default Calendar