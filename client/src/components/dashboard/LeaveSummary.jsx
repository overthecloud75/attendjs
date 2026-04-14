import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Paper, Typography, Box, LinearProgress, Button, Stack, Grid } from '@mui/material'
import { FileSignature, Calculator, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

import Approval from './Approval'
import { LEAVE_TYPE } from '../../configs/domain'

// 커스텀 게이지 바
function LeaveProgressBar(props) {
    return (
        <Box sx={{ width: '100%', mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="var(--text-secondary)" sx={{ fontWeight: 500 }}>연차 사용률</Typography>
                <Typography variant="body2" color="var(--info)" sx={{ fontWeight: 700 }}>{Math.round(props.value)}%</Typography>
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
                        backgroundColor: props.value > 80 ? 'var(--danger)' : 'var(--info)',
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
            <Typography variant="caption" display="block" color="var(--text-secondary)" sx={{ fontWeight: 500 }}>{label}</Typography>
            <Typography variant="body2" color="var(--text-primary)" sx={{ fontWeight: 700 }}>{value}일</Typography>
        </Box>
    </Box>
)

const LeaveSummary = ({ leftLeave }) => {

    const [openApproval, setOpenApproval] = useState(false)
    const navigate = useNavigate()

    const usedHalfDays = leftLeave?.[LEAVE_TYPE.HALF] || 0
    const usedFullDays = leftLeave?.[LEAVE_TYPE.ANNUAL] || 0
    const usedSickDays = leftLeave?.[LEAVE_TYPE.SICK] || 0
    const totalUsedDays = usedHalfDays * 0.5 + usedFullDays + usedSickDays
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
                    width: '100%',
                    boxSizing: 'border-box',
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
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <Typography variant='h6' color='var(--text-primary)' sx={{ fontWeight: '700' }}>
                            연차 사용 현황
                        </Typography>
                        <Button
                            variant='contained'
                            startIcon={<FileSignature size={16} />}
                            onClick={handleApplyClick}
                            sx={{
                                bgcolor: 'var(--text-active)',
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)',
                                '&:hover': {
                                    bgcolor: 'var(--text-active)',
                                    opacity: 0.9,
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
                                color="var(--text-secondary)"
                            />
                        </Grid>
                        <Grid size={6}>
                            <StatItem
                                icon={CheckCircle2}
                                label="사용 완료"
                                value={totalUsedDays}
                                color="var(--success)"
                            />
                        </Grid>
                        <Grid size={6}>
                            <StatItem
                                icon={Clock}
                                label="잔여 연차"
                                value={leftDays}
                                color="var(--info)"
                            />
                        </Grid>
                        <Grid size={6}>
                            <StatItem
                                icon={AlertCircle}
                                label="승인 대기"
                                value={pendingDays}
                                color="var(--warning)"
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </>
    )
}

export default LeaveSummary