import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography, Box, LinearProgress, Button } from '@mui/material'

import Approval from './Approval'

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

    const [openApproval, setOpenApproval] = useState(false)
    const navigate = useNavigate()

    const usedHalfDays = leftLeave?.['반차'] || 0
    const usedFullDays = leftLeave?.['휴가'] || 0
    const totalUsedDays = usedHalfDays * 0.5 + usedFullDays
    const totalLeave = leftLeave?.defaultAnnualLeave || 0
    const usedRate = totalLeave ? (totalUsedDays / totalLeave) * 100 : 0

    const leftDays = leftLeave?.leftAnnualLeave || 0
    const notUsedDays = leftLeave?.notUsed || 0
    const pendingDays = leftLeave?.pending || 0

    const leaveItems = [
        { label: '총 연차', value: totalLeave },
        { label: '사용한 연차', value: totalUsedDays },
        { label: '남은 연차', value: leftDays },
        { label: '사용 대기 연차', value: notUsedDays },
        { label: '승인 대기', value: pendingDays },
    ]

    const handleApplyClick = () => setOpenApproval(true)

    return (
        <div>
            {openApproval&&(
                <Approval
                    navigate={navigate}
                    open={openApproval}
                    setOpen={setOpenApproval}
                />
            )}
            <Card>
                <CardContent>
                    <Typography variant='h6' gutterBottom>
                        연차 사용 요약
                    </Typography>
                    {leaveItems.map(item => (
                        <Typography key={item.label} variant='body2'>
                            {item.label}: <strong>{item.value}일</strong>
                        </Typography>
                    ))}

                    <Box mt={1}>
                        <LeaveProgressBar value={usedRate} color='#4caf50' />
                        <Typography variant='caption' color='text.secondary'>
                            연차 사용률: {usedRate.toFixed(1)}%
                        </Typography>
                    </Box>
                    {/* 연차 신청 버튼 */}
                    <Box display='flex' justifyContent='flex-end'>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={handleApplyClick}
                        >
                            근태 신청
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </div>
    )
}

export default LeaveSummary