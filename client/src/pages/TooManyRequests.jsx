import { Box, Typography, Button } from '@mui/material'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import { useNavigate } from 'react-router-dom'

const TooManyRequests = () => {
    const navigate = useNavigate()

    return (
        <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            height='100vh'
            textAlign='center'
            bgcolor='#f9fafb'
            px={2}
        >
            <HourglassEmptyOutlinedIcon color='warning' sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant='h3' fontWeight='bold' gutterBottom>
                429 Too Many Requests
            </Typography>
            <Typography variant='body1' color='text.secondary' mb={4}>
                요청이 너무 많습니다. 잠시 후 다시 시도해주세요.
            </Typography>
            <Button
                variant='outlined'
                color='warning'
                onClick={() => navigate('/')}
                sx={{ textTransform: 'none' }}
            >
                홈으로 이동
            </Button>
        </Box>
    )
}

export default TooManyRequests