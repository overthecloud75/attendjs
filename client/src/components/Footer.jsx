import Box from '@mui/material/Box'

const Footer = () => {
    return (
        <Box
            sx={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                fontSize: 12
            }}
        >
            Copyright © {new Date().getFullYear()} SmartWork.
        </Box>
    )
}

export default Footer