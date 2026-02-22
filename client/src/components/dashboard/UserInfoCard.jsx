import { Paper, Typography, Avatar, Box, Divider, Stack } from '@mui/material'
import { Briefcase, Calendar, Clock, User } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const UserInfoCard = ({ leftLeave }) => {

    const { user } = useAuth()

    return (
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
                justifyContent: 'center'
            }}
        >
            <Box display='flex' alignItems='flex-start' mb={3}>
                <Avatar
                    sx={{
                        width: 56,
                        height: 56,
                        bgcolor: 'var(--bg-active)',
                        color: 'var(--text-active)',
                        mr: 2.5
                    }}
                >
                    <User size={28} strokeWidth={1.5} />
                </Avatar>
                <Box sx={{ mt: 0.5 }}>
                    <Typography variant='h6' fontWeight='700' color='var(--text-primary)' lineHeight={1.2}>
                        {user.name} {user.rank}
                    </Typography>
                    <Typography variant='body2' color='var(--text-secondary)' mt={0.5} fontWeight={500}>
                        {user.position} {user.department && `· ${user.department}`}
                    </Typography>
                </Box>
            </Box>

            <Stack spacing={2}>
                <Box display="flex" alignItems="center">
                    <Box sx={{ minWidth: 24, display: 'flex', justifyContent: 'center', mr: 1.5, color: 'var(--text-secondary)' }}>
                        <Calendar size={18} />
                    </Box>
                    <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                        <Typography variant='body2' color='var(--text-secondary)'>입사일</Typography>
                        <Typography variant='body2' fontWeight='600' color='var(--text-primary)'>{user.beginDate}</Typography>
                    </Box>
                </Box>

                <Divider sx={{ borderColor: 'var(--border-color)' }} />

                <Box display="flex" alignItems="center">
                    <Box sx={{ minWidth: 24, display: 'flex', justifyContent: 'center', mr: 1.5, color: 'var(--text-secondary)' }}>
                        <Clock size={18} />
                    </Box>
                    <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                        <Typography variant='body2' color='var(--text-secondary)'>근속 기간</Typography>
                        <Typography variant='body2' fontWeight='600' color='var(--text-primary)'>
                            {leftLeave?.employeementPeriod}년 {leftLeave?.baseMonth}개월
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ borderColor: 'var(--border-color)' }} />

                <Box display="flex" alignItems="center">
                    <Box sx={{ minWidth: 24, display: 'flex', justifyContent: 'center', mr: 1.5, color: 'var(--text-secondary)' }}>
                        <Briefcase size={18} />
                    </Box>
                    <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                        <Typography variant='body2' color='var(--text-secondary)'>근무 형태</Typography>
                        <Typography variant='body2' fontWeight='600' color='var(--text-primary)'>
                            {user.regular}
                        </Typography>
                    </Box>
                </Box>
            </Stack>
        </Paper>
    )
}

export default UserInfoCard