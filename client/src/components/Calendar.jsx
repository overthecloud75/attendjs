import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import FullCalendar from '@fullcalendar/react' 
import dayGridPlugin from '@fullcalendar/daygrid' 
import interactionPlugin from '@fullcalendar/interaction'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { getEventsInCalendar, getWindowDimension } from '../utils/EventUtil'
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

const GetCalendar = ({navigate, weekends, setWeekends, tapValue}) => {

    const calendarRef = useRef()

    const [headerToolbar, setHeaderToolbar] = useState({
        start: 'title', 
        center: '',
        end: 'today prev,next'
    })
    const [eventsData, setEventsData] = useState([])
    const [thisMonth, setThisMonth] = useState('')

    useEffect(() => {
        const calendarApiView = calendarRef.current.getApi().view
        const args = {start: calendarApiView.activeStart, end: calendarApiView.activeEnd}
        
        const fetchData = async () => {
            const events = await getEventsInCalendar(args, tapValue)
            if (events.err) {
                const errorStatus = events.err.response.data.status
                if (errorStatus === 401) { 
                    navigate('/login')
                }
            } else {
                setEventsData(events.data)
                const {width} = getWindowDimension()
                if (width < mobileSize) {
                    setWeekends(false)
                    setHeaderToolbar({start: '', center: '', end: 'today prev,next'})
                }
            }
        }
        if (thisMonth) {fetchData()}
    // eslint-disable-next-line
    }, [thisMonth, tapValue])

    const handleDates = async (datesInfo) => {
        setThisMonth(datesInfo.view.title)
    }
    
    return (
        <FullCalendar
            ref={calendarRef}
            plugins={[ dayGridPlugin, interactionPlugin ]}
            initialView='dayGridMonth'
            headerToolbar={headerToolbar}
            editable={false}
            selectable={false}
            events={eventsData}
            weekends={weekends}
            select={false}
            eventClick={false}
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