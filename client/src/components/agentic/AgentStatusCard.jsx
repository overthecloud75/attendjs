import React from 'react'
import { Card, CardContent, Stack, Box, Typography, IconButton } from '@mui/material'
import { X } from 'lucide-react'

const AgentStatusCard = ({ id, title, status, icon: Icon, color, onHide }) => (
    <Card sx={{ 
        width: '100%', maxWidth: 280,
        borderRadius: 4, bgcolor: 'var(--card-bg)', border: '1px solid var(--border-color)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(0,0,0,0.1)', borderColor: color }
    }}>
        <CardContent sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Box sx={{ p: 1, bgcolor: `${color}15`, color: color, borderRadius: 2 }}>
                    <Icon size={20} />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight="800" sx={{ opacity: 0.9 }}>{title}</Typography>
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981' }} />
                        <Typography variant="caption" color="#10b981" fontWeight="700">{status}</Typography>
                    </Stack>
                </Box>
                <IconButton size="small" onClick={() => onHide(id)} sx={{ opacity: 0.3, '&:hover': { opacity: 1 } }}>
                    <X size={14} />
                </IconButton>
            </Stack>
        </CardContent>
    </Card>
)

export default AgentStatusCard
