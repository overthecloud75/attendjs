import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Paper, Typography, Box, LinearProgress, Button, Stack, Grid } from '@mui/material'
import { FileSignature, Calculator, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

import Approval from './Approval'

// 커스텀 게이지 바
function LeaveProgressBar(props) {
    return (
        <Box sx={{ width: '100%', mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="var(--text-secondary)" fontWeight={500}>연차 사용률</Typography>
                <Typography variant="body2" color="#3b82f6" fontWeight={700}>{Math.round(props.value)}%</Typography>
            </Box>
            <LinearProgress
                variant='determinate'
                {...props}
                sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'var(--hover-bg)',
                    '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        backgroundColor: props.value > 80 ? '#ef4444' : '#3b82f6',
                    },
                }}
            />
        </Box>
    )
}

const StatItem = ({ icon: Icon, label, value, color }) => (
    <Box sx={{
        bgcolor: 'var(--bg-secondary)',
        p: 1.5,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5
    }}>
        <Box sx={{
            color: color || 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'var(--bg-primary)',
            p: 0.8,
            borderRadius: '50%',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        }}>
            <Icon size={16} strokeWidth={2} />
        </Box>
        <Box>
            <Typography variant="caption" display="block" color="var(--text-secondary)" fontWeight={500}>{label}</Typography>
            <Typography variant="body2" fontWeight={700} color="var(--text-primary)">{value}일</Typography>
        </Box>
    </Box>
)

const LeaveSummary = ({ leftLeave }) => {

    const [openApproval, setOpenApproval] = useState(false)
    const navigate = useNavigate()

    const usedHalfDays = leftLeave?.['반차'] || 0
    const usedFullDays = leftLeave?.['휴가'] || 0
    const totalUsedDays = usedHalfDays * 0.5 + usedFullDays
    const totalLeave = leftLeave?.defaultAnnualLeave || 0
    const usedRate = totalLeave ? (totalUsedDays / totalLeave) * 100 : 0

    const leftDays = leftLeave?.leftAnnualLeave || 0
    const pendingDays = leftLeave?.pending || 0

    const handleApplyClick = () => setOpenApproval(true)

    return (
        <>
            {openApproval && (
                <Approval
                    navigate={navigate}
                    open={openApproval}
                    setOpen={setOpenApproval}
                />
            )}
            <Paper
                elevation={0}
                sx={{
                    px: 3,
                    py: 1,
                    height: '100%',
                    borderRadius: 3,
                    border: '1px solid var(--border-color)',
                    bgcolor: 'var(--card-bg)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}
            >
                <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant='h6' fontWeight='700' color='var(--text-primary)'>
                            연차 사용 현황
                        </Typography>
                        <Button
                            variant='contained'
                            startIcon={<FileSignature size={16} />}
                            onClick={handleApplyClick}
                            sx={{
                                bgcolor: '#3b82f6',
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)',
                                '&:hover': {
                                    bgcolor: '#2563eb',
                                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.5)',
                                },
                            }}
                        >
                            휴가 신청
                        </Button>
                    </Box>

                    <Box mb={4}>
                        <LeaveProgressBar value={usedRate} />
                    </Box>

                    <Grid container spacing={2}>
                        <Grid size={6}>
                            <StatItem
                                icon={Calculator}
                                label="총 연차"
                                value={totalLeave}
                                color="#64748b"
                            />
                        </Grid>
                        <Grid size={6}>
                            <StatItem
                                icon={CheckCircle2}
                                label="사용 완료"
                                value={totalUsedDays}
                                color="#22c55e"
                            />
                        </Grid>
                        <Grid size={6}>
                            <StatItem
                                icon={Clock}
                                label="잔여 연차"
                                value={leftDays}
                                color="#3b82f6"
                            />
                        </Grid>
                        <Grid size={6}>
                            <StatItem
                                icon={AlertCircle}
                                label="승인 대기"
                                value={pendingDays}
                                color="#f59e0b"
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </>
    )
}

export default LeaveSummary