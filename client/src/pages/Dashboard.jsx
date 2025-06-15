import { Widget } from 'react-chat-widget-react-18'
import 'react-chat-widget-react-18/lib/styles.css'
import { Grid, Container, Typography } from '@mui/material'
import UserInfoCard from '../components/dashboard/UserInfoCard'
import TodayStatusCard from '../components/dashboard/TodayStatusCard'
import LeaveSummary from '../components/dashboard/LeaveSummary'
import WorkCalendar from '../components/dashboard/WorkCalendar'
import { useChat } from '../hooks/useChat'
import Sidebar from '../components/bar/Sidebar'
import Navbar from '../components/bar/Navbar'
import Footer from '../components/Footer'
import { useRedirectIfNotAuthenticated } from '../hooks/useRedirectIfNotAuthenticated'

const CHAT_CONFIG = {
    title: 'SmartWork Chat',
    subtitle: '',
    showTimeStamp: false
}

const Dashboard = ({menu, setMenu}) => {

    useRedirectIfNotAuthenticated()
    const { handleNewUserMessage } = useChat()

    return (
        <div className='container'>
            {menu && <Sidebar menu={menu} setMenu={setMenu}/>}
            <div className='wrapper'>
                <Navbar menu={menu} setMenu={setMenu}/> 
                <Container maxWidth='xl' sx={{ mt: 4 }}>
                    <Typography variant='h4' gutterBottom>
                        내 근태 현황
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <UserInfoCard />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <LeaveSummary />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <WorkCalendar />
                        </Grid>
                    </Grid>
                </Container>
                {menu && <Footer/>}
            </div>
            <Widget
                {...CHAT_CONFIG}
                handleNewUserMessage={handleNewUserMessage}
            />
        </div>
    )
}

export default Dashboard