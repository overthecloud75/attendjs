import { Box, Typography, Button } from '@mui/material'
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined'
import { useNavigate } from 'react-router-dom'
import Feature from '../components/Feature'
import Footer from '../components/Footer'

const CheckEmail = () => {
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
                <MarkEmailUnreadOutlinedIcon color='warning' sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant='h4' fontWeight='bold' gutterBottom>
                    이메일 인증 필요
                </Typography>
                <Typography variant='body1' color='text.secondary' mb={4}>
                    가입을 완료하려면 이메일로 전송된 인증 링크를 확인해 주세요.
                    <br />
                    이메일을 받지 못하셨다면 스팸함도 함께 확인해 주세요.
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
  
export default CheckEmail