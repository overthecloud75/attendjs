import { useSelector } from 'react-redux'
import { Paper, Typography, Avatar, Box, Divider, Stack } from '@mui/material'
import { Briefcase, Calendar, Clock, User } from 'lucide-react'

const UserInfoCard = ({ leftLeave }) => {

    const user = useSelector(state => state.user)

    return (
        <Paper
            elevation={0}
            sx={{
                px: 3,
                py: 1,
                height: '100%',
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                bgcolor: 'white',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}
        >
            <Box display='flex' alignItems='flex-start' mb={3}>
                <Avatar
                    sx={{
                        width: 56,
                        height: 56,
                        bgcolor: '#eff6ff',
                        color: '#3b82f6',
                        mr: 2.5
                    }}
                >
                    <User size={28} strokeWidth={1.5} />
                </Avatar>
                <Box sx={{ mt: 0.5 }}>
                    <Typography variant='h6' fontWeight='700' color='#1e293b' lineHeight={1.2}>
                        {user.name} {user.rank}
                    </Typography>
                    <Typography variant='body2' color='#64748b' mt={0.5} fontWeight={500}>
                        {user.position} {user.department && `· ${user.department}`}
                    </Typography>
                </Box>
            </Box>

            <Stack spacing={2}>
                <Box display="flex" alignItems="center">
                    <Box sx={{ minWidth: 24, display: 'flex', justifyContent: 'center', mr: 1.5, color: '#94a3b8' }}>
                        <Calendar size={18} />
                    </Box>
                    <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                        <Typography variant='body2' color='#64748b'>입사일</Typography>
                        <Typography variant='body2' fontWeight='600' color='#334155'>{user.beginDate}</Typography>
                    </Box>
                </Box>

                <Divider sx={{ borderColor: '#f1f5f9' }} />

                <Box display="flex" alignItems="center">
                    <Box sx={{ minWidth: 24, display: 'flex', justifyContent: 'center', mr: 1.5, color: '#94a3b8' }}>
                        <Clock size={18} />
                    </Box>
                    <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                        <Typography variant='body2' color='#64748b'>근속 기간</Typography>
                        <Typography variant='body2' fontWeight='600' color='#334155'>
                            {leftLeave?.employeementPeriod}년 {leftLeave?.baseMonth}개월
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ borderColor: '#f1f5f9' }} />

                <Box display="flex" alignItems="center">
                    <Box sx={{ minWidth: 24, display: 'flex', justifyContent: 'center', mr: 1.5, color: '#94a3b8' }}>
                        <Briefcase size={18} />
                    </Box>
                    <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                        <Typography variant='body2' color='#64748b'>근무 형태</Typography>
                        <Typography variant='body2' fontWeight='600' color='#334155'>
                            {user.regular}
                        </Typography>
                    </Box>
                </Box>
            </Stack>
        </Paper>
    )
}

export default UserInfoCard