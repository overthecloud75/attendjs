import { Grid, Container, Typography } from '@mui/material'
import UserInfoCard from './UserInfoCard'
import LeaveSummary from './LeaveSummary'
import WorkCalendar from './WorkCalendar'
import { useLeftLeave } from '../../hooks/useLeftLeave'

const DashboardContainer  = () => {

    const { leftLeave } = useLeftLeave() 

    return (
        <Container maxWidth='xl' sx={{ mt: 2 }}>
           <Typography
                variant='h4'
                gutterBottom
                sx={{
                    fontSize: {
                        xs: '1.3rem', // 모바일
                        sm: '1.5rem', // 태블릿
                        md: '1.8rem', // 데스크탑
                    },
                }}
            >
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