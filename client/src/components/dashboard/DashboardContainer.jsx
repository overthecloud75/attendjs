import { Grid, Container, Box } from '@mui/material'
import UserInfoCard from './UserInfoCard'
import LeaveSummary from './LeaveSummary'
import WorkCalendar from './WorkCalendar'
import { useLeftLeave } from '../../hooks/useLeftLeave'
import { useAuth } from '../../hooks/useAuth'
import { LayoutDashboard } from 'lucide-react'
import PageHeader from '../common/PageHeader'
import { useTranslation } from 'react-i18next'

const DashboardContainer = () => {
    const { leftLeave } = useLeftLeave()
    const { user } = useAuth()
    const { t } = useTranslation()

    return (
        <Container maxWidth='xl' sx={{ mt: 1 }}>
            <PageHeader
                icon={LayoutDashboard}
                title={`${t('dashboard-welcome', '반가워요')}, ${user.name}${t('dashboard-suffix', '님')}! 👋`}
                subtitle={t('dashboard-subtitle', '오늘의 근태 현황을 한눈에 확인하세요.')}
                breadcrumbs={[
                    { label: 'Dashboard' }
                ]}
            />

           <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <UserInfoCard
                        leftLeave={leftLeave}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <LeaveSummary
                        leftLeave={leftLeave}
                    />
                </Grid>
                <Grid size={12}>
                    <WorkCalendar />
                </Grid>
            </Grid>
        </Container>
    )
}

export default DashboardContainer