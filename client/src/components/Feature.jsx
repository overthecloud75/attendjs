import Box from '@mui/material/Box'

const Feature = () => {
    return (
        <Box 
            sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: -1,
                opacity: 0.2
            }}
        >
            <Box 
                component='img'
                src='/employees.webp'
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            />
        </Box>
    )
}

export default Feature