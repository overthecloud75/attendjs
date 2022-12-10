import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
import { getColor, getEvents, addEvent, deleteEvent } from '../utils/EventUtil'

const Wrapper = styled.div`
    padding: 30px;
`
const Calendar = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(false)

    const initialEvents = async (args) => {
        // const 
        const events = await getEvents(args)
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
            } 
        }
        fetchData()
    }, [error])

    const handleDateSelect = (selectInfo) => {
        let title = prompt('Please enter a new title for your event')
        let calendarApi = selectInfo.view.calendar
    
        calendarApi.unselect() // clear date selection

        if (title) {
            let event = {
                id: Date.now(),
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr}
            addEvent(event)
            event = getColor(event)
            calendarApi.addEvent(event)
        }
    }
    
    const handleEventClick = (clickInfo) => {
        if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
            deleteEvent(clickInfo.event)
            clickInfo.event.remove()
        }
    }
    
    return (
        <Wrapper>
            <FullCalendar
                plugins={[ dayGridPlugin, interactionPlugin ]}
                initialView='dayGridMonth'
                editable={true}
                selectable={true}
                aspectRatio={2.2}
                initialEvents={initialEvents}
                weekends={true}
                select={handleDateSelect}
                eventClick={handleEventClick}
            />
        </Wrapper>
    )
}

export default Calendar