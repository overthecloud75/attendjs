import { Grid, Container, Typography } from '@mui/material'
import UserInfoCard from './UserInfoCard'
import TodayStatusCard from './TodayStatusCard'
import LeaveSummary from './LeaveSummary'
import WorkCalendar from './WorkCalendar'
import { useResponsive } from '../../hooks/useResponsive'
import { useLeftLeave } from '../../hooks/useLeftLeave'

const DashboardContainer  = () => {

    const {isMobile} = useResponsive()
    const { leftLeave } = useLeftLeave() 

    return (
        <Container maxWidth='xl' sx={{ mt: 1 }}>
            <Typography variant='h4' gutterBottom sx={{fontSize: isMobile ? '1.5rem' : '2.5rem'}}>
                내 근태 현황
            </Typography>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <UserInfoCard 
                        leftLeave = {leftLeave}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <LeaveSummary 
                        leftLeave = {leftLeave}    
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <WorkCalendar />
                </Grid>
            </Grid>
        </Container>
    )
}

export default DashboardContainer 