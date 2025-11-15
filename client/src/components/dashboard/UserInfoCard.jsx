import { useMemo } from 'react'
import { Card, CardContent, Typography, Avatar, Box, Divider } from '@mui/material'
import { getUser } from '../../storage/userSlice'

const UserInfoCard = ({leftLeave}) => {

    const user = useMemo(() => getUser(), [])

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box display='flex' alignItems='center' mb={2}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        🧑
                    </Avatar>
                    <Box>
                        <Typography variant='h6'>{user.name} {user.rank}</Typography>
                        <Typography color='text.secondary'>{user.position} · {user.department}</Typography>
                    </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />
                <Typography variant='body2' gutterBottom>
                    입사일: <strong>{user.beginDate}</strong>
                </Typography>
                <Typography variant='body2' gutterBottom>
                    근무 일수: <strong>{leftLeave.employeementPeriod}년 {leftLeave.baseMonth}월</strong>
                </Typography>
                <Typography variant='body2' gutterBottom>
                    근무 형태: <strong>{user.regular}</strong>
                </Typography>
            </CardContent>
        </Card>
    )
}

export default UserInfoCard