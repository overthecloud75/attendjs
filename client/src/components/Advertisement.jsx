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
                p: 4
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 800,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                }}
            >
                <Typography
                    component="h1"
                    sx={{
                        fontSize: { md: '3rem', lg: '3.5rem' },
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        textAlign: 'center',
                        lineHeight: 1.2,
                        letterSpacing: '-0.02em',
                        marginTop: '15px'
                    }}
                >
                    진정한 SmartWork의 시작
                </Typography>
                <Typography
                    sx={{
                        fontSize: { md: '1.5rem', lg: '1.8rem' },
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        fontWeight: 500,
                        letterSpacing: '-0.01em'
                    }}
                >
                    사람과 사람, 그 관계를 만드는
                </Typography>
            </Box>
        </Box>
    )
}

export default Advertisement