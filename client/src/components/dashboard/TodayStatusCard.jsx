import { Card, CardContent, Typography } from '@mui/material'

const TodayStatusCard = () => {
    const checkInTime = '09:14'
    const checkOutTime = '18:02'
    const workHours = '7시간 48분'

    return (
        <Card>
            <CardContent>
                <Typography variant='h6' gutterBottom>
                    오늘의 출퇴근
                </Typography>
                <Typography>출근 시간: {checkInTime}</Typography>
                <Typography>퇴근 시간: {checkOutTime}</Typography>
                <Typography>총 근무 시간: {workHours}</Typography>
            </CardContent>
        </Card>
    )
}

export default TodayStatusCard