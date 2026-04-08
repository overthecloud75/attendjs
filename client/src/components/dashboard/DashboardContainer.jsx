import { Grid, Container, Typography, Box } from '@mui/material'
import UserInfoCard from './UserInfoCard'
import LeaveSummary from './LeaveSummary'
import WorkCalendar from './WorkCalendar'
import { useLeftLeave } from '../../hooks/useLeftLeave'
import { useAuth } from '../../hooks/useAuth'

const DashboardContainer = () => {

    const { leftLeave } = useLeftLeave()
    const { user } = useAuth()

    return (
        <Container maxWidth='xl' sx={{ mt: { xs: 0, md: 1 }, px: { xs: 2, sm: 3 } }}>
            <Box sx={{ mb: { xs: 2, md: 1 }, mt: { xs: 1, md: 0 } }}>
                <Typography
                    variant='h4'
                    fontWeight='900'
                    sx={{
                        color: 'var(--text-primary)',
                        fontSize: { xs: '1.25rem', md: '2rem' },
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        mb: 0.5,
                        letterSpacing: '-0.5px'
                    }}
                >
                    반가워요, {user.name}님! 👋
                </Typography>
                <Typography variant='subtitle1' sx={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                    오늘의 근태 현황을 한눈에 확인하세요.
                </Typography>
            </Box>

            <Grid container spacing={{ xs: 2, md: 4 }}>
                <Grid item xs={12} md={6}>
                    <UserInfoCard
                        leftLeave={leftLeave}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <LeaveSummary
                        leftLeave={leftLeave}
                    />
                </Grid>
                <Grid item xs={12}>
                    <WorkCalendar />
                </Grid>
            </Grid>
        </Container>
    )
}

export default DashboardContainer