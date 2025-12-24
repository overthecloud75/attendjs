import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Feature from '../components/Feature'
import Footer from '../components/Footer'

const TooManyRequests = () => {
    const navigate = useNavigate()

    return (
        <div>
            <Feature/>
            <Box
                display='flex'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                height='100vh'
                textAlign='center'
                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                px={2}
            >
                <div
                    style={{
                        fontSize: 60,     
                        marginBottom: '16px',
                    }}
                >
                    ⏳
                </div>
                <Typography variant='h4' fontWeight='bold' gutterBottom>
                    429 Too Many Requests
                </Typography>
                <Typography variant='body1' color='text.secondary' mb={4}>
                    요청이 너무 많습니다. 잠시 후 다시 시도해주세요.
                </Typography>
                <Button
                    variant='contained' 
                    color='primary' 
                    onClick={() => navigate('/')}
                    sx={{ textTransform: 'none' }}
                >
                    홈으로 이동
                </Button>
            </Box>
            <Footer/>
        </div>
    )
}

export default TooManyRequests