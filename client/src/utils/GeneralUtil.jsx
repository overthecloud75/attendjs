import { Box, CircularProgress } from '@mui/material'

export const LoadingSpinner = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress/>
    </Box>
)