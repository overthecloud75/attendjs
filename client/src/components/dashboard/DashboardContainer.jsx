import { Grid, Container, Box, Typography } from '@mui/material'
import UserInfoCard from './UserInfoCard'
import LeaveSummary from './LeaveSummary'
import WorkCalendar from './WorkCalendar'
import { useLeftLeave } from '../../hooks/useLeftLeave'
import { useAuth } from '../../hooks/useAuth'
import { LayoutDashboard } from 'lucide-react'
import PageHeader from '../common/PageHeader'
import { useTranslation } from 'react-i18next'
import { Receipt, ScanText } from 'lucide-react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import ReceiptScanner from '../expense/ReceiptScanner'
import { useState } from 'react'

const DashboardContainer = () => {
    const { leftLeave } = useLeftLeave()
    const { user } = useAuth()
    const { t } = useTranslation()
    const [scanOpen, setScanOpen] = useState(false)

    return (
        <Container maxWidth='xl' sx={{ mt: 1 }}>
            <PageHeader
                icon={LayoutDashboard}
                title={`${t('dashboard-welcome', '반가워요')}, ${user.name}${t('dashboard-suffix', '님')}! 👋`}
                subtitle={t('dashboard-subtitle', '오늘의 근태 현황을 한눈에 확인하세요.')}
                breadcrumbs={[
                    { label: 'Dashboard' }
                ]}
                extra={
                    <Button
                        variant="contained"
                        startIcon={<Receipt size={18} />}
                        onClick={() => setScanOpen(true)}
                        sx={{
                            borderRadius: 2,
                            bgcolor: 'var(--text-active)',
                            fontWeight: 700,
                            px: 3,
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                            '&:hover': { bgcolor: 'var(--text-active)', opacity: 0.9 }
                        }}
                    >
                        스마트 영수증 정산
                    </Button>
                }
            />

           <Grid container spacing={2}>
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

            {/* Smart Receipt Scan Dialog */}
            <Dialog 
                open={scanOpen} 
                onClose={() => setScanOpen(false)}
                maxWidth="sm"
                fullWidth
                slotProps={{
                    paper: { sx: { borderRadius: 4, bgcolor: 'var(--card-bg)', color: 'var(--text-primary)' } }
                }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 3 }}>
                    <Box sx={{ p: 1, bgcolor: 'var(--bg-active)', borderRadius: '50%', color: 'var(--text-active)', display: 'flex' }}>
                        <ScanText size={22} />
                    </Box>
                    <Typography variant="h6" fontWeight="800" component="span">스마트 영수증 정산</Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        AI가 영수증을 분석하고 법인카드 내역과 대조하여 지출 결재안을 작성합니다.
                    </Typography>
                    <ReceiptScanner onComplete={(data) => console.log('Scan Data:', data)} />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setScanOpen(false)} sx={{ color: 'var(--text-secondary)' }}>닫기</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default DashboardContainer