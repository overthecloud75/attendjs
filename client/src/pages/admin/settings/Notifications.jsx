import React from 'react'
import { Box, Typography, Divider } from '@mui/material'

const NotificationSettings = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: 'var(--text-primary)' }}>
                Notification Settings
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography sx={{ color: 'var(--text-secondary)' }}>
                Manage email templates and push notification preferences.
            </Typography>
        </Box>
    )
}

export default NotificationSettings
