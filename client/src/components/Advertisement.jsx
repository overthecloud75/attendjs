import { Box, Typography } from '@mui/material'

const Advertisement = () => {
    return (
        <Box
            sx={{
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                flex: 1,
        }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 1024,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <h1 style={{ fontSize: '40px', marginTop: '15px', textAlign: 'center' }}>
                    진정한 SmartWork의 시작
                </h1>
                <Typography sx={{ fontSize: 25, textAlign: 'center' }}>
                    사람과 사람, 그 관계를 만드는
                </Typography>
            </Box>
        </Box>
    )
}

export default Advertisement