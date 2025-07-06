import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material'

// 커스텀 게이지 바
function LeaveProgressBar(props) {
    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgress
                variant='determinate'
                {...props}
                sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#eee',
                    '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        backgroundColor: props.color || '#1976d2',
                    },
                }}
            />
        </Box>
    )
}

const LeaveSummary = ({leftLeave}) => {
    const used = leftLeave['반차'] * 0.5 + leftLeave['휴가']
    const usedPercentage = (used / leftLeave.defaultAnnualLeave) * 100

    return (
        <Card>
            <CardContent>
                <Typography variant='h6' gutterBottom>
                    연차 사용 요약
                </Typography>
                <Typography variant='body2' gutterBottom>
                    총 연차: <strong>{leftLeave.defaultAnnualLeave}일</strong>
                </Typography>
                <Typography variant='body2' gutterBottom>
                    사용한 연차: <strong>{used}일</strong>
                </Typography>
                <Typography variant='body2' gutterBottom>
                    남은 연차: <strong>{leftLeave.leftAnnualLeave}일</strong>
                </Typography>
                <Typography variant='body2' gutterBottom>
                    사용 대기 연차: <strong>{leftLeave.notUsed}일</strong>
                </Typography>
                <Typography variant='body2' gutterBottom>
                    승인 대기: <strong>{leftLeave.pending}일</strong>
                </Typography>

                <Box mt={2}>
                <LeaveProgressBar value={usedPercentage} color='#4caf50' />
                <Typography variant='caption' color='text.secondary'>
                    연차 사용률: {usedPercentage.toFixed(1)}%
                </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}

export default LeaveSummary