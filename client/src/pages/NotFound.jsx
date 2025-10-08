import { Box, Typography, Button } from '@mui/material'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
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
            <ReportProblemOutlinedIcon color='warning' sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant='h3' fontWeight='bold' gutterBottom>
                404 Not Found
            </Typography>
            <Typography variant='body1' color='text.secondary' mb={4}>
                요청하신 페이지를 찾을 수 없습니다. URL을 확인하시거나 홈으로 돌아가세요.
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

export default NotFound