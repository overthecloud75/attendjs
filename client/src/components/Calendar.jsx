import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
import { getEvents, addEvent, deleteEvent } from '../utils/EventUtil';

const Calendar = () => {

    const initialEvents = (args) => {
        const events = getEvents(args)
        return events
    }

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
            console.log('event', event)
            addEvent(event)
            calendarApi.addEvent(event)
        }
    }
    
    const handleEventClick = (clickInfo) => {
        console.log('clickInfo', clickInfo.event)
        if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
            deleteEvent(clickInfo.event)
            clickInfo.event.remove()
        }
    }
    
    return (
        <FullCalendar
            plugins={[ dayGridPlugin, interactionPlugin ]}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            aspectRatio={2}
            initialEvents={initialEvents}
            weekends={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
        />
    )
}

export default Calendar