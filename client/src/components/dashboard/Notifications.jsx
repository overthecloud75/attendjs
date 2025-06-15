import { Card, CardContent, Typography, Alert, Stack } from '@mui/material'

const Notifications = () => {
    // 예시 알림 메시지
    const notifications = [
        {
        type: 'info',
        message: '이번 달 아직 연차를 사용하지 않으셨습니다.',
        },
        {
        type: 'warning',
        message: '최근 2주간 평균 출근 시간이 10분 늦어지고 있습니다.',
        },
        {
        type: 'success',
        message: '이번 주 근무 시간 목표를 초과 달성하셨습니다!',
        },
        {
        type: 'error',
        message: '6월 5일 결근 처리됨 – 사유 입력이 필요합니다.',
        },
    ]

    return (
        <Card>
            <CardContent>
                <Typography variant='h6' gutterBottom>
                    근태 알림 및 인사이트
                </Typography>

                <Stack spacing={1}>
                    {notifications.map((noti, index) => (
                        <Alert key={index} severity={noti.type}>
                        {noti.message}
                        </Alert>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    )
}

export default Notifications