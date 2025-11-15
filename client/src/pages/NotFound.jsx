import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Feature from '../components/Feature'
import Footer from '../components/Footer'

const NotFound = () => {
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
                    ⚠️
                </div>
                <Typography variant='h4' fontWeight='bold' gutterBottom>
                    404 Not Found
                </Typography>
                <Typography variant='body1' color='text.secondary' mb={4}>
                    요청하신 페이지를 찾을 수 없습니다. URL을 확인하시거나 홈으로 돌아가세요.
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

export default NotFound