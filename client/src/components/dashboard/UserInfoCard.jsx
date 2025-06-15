import { useMemo } from 'react'
import { Card, CardContent, Typography, Avatar, Box, Divider } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import { getUser } from '../../storage/userSlice'

const UserInfoCard = () => {

    const user = useMemo(() => getUser(), [])

    return (
        <Card sx={{ height: '100%' }}>
        <CardContent>
            <Box display='flex' alignItems='center' mb={2}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <PersonIcon />
            </Avatar>
            <Box>
                <Typography variant='h6'>{user.name}</Typography>
                <Typography color='text.secondary'>{user.position} · {user.department}</Typography>
            </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography variant='body2' gutterBottom>
                근무 형태: <strong>{user.workType}</strong>
            </Typography>
        </CardContent>
        </Card>
    )
}

export default UserInfoCard