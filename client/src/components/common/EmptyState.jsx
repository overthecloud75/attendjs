import { Box, Typography, Button, Stack } from '@mui/material'
import { Plus } from 'lucide-react'

const EmptyState = ({ 
    icon: Icon, 
    title, 
    description, 
    actionLabel, 
    onAction, 
    iconColor = 'var(--text-active)',
    compact = false
}) => {
    return (
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                py: compact ? 4 : 10,
                px: 2,
                textAlign: 'center'
            }}
        >
            <Box 
                sx={{ 
                    p: compact ? 2 : 3, 
                    bgcolor: `${iconColor}15`, 
                    color: iconColor, 
                    borderRadius: '50%',
                    mb: 2,
                    display: 'flex'
                }}
            >
                <Icon size={compact ? 32 : 48} />
            </Box>
            
            <Typography variant={compact ? "subtitle1" : "h6"} fontWeight="700" color="var(--text-primary)" gutterBottom>
                {title}
            </Typography>
            
            <Typography variant="body2" color="var(--text-secondary)" sx={{ mb: onAction ? 3 : 0, maxWidth: 300, mx: 'auto' }}>
                {description}
            </Typography>
            
            {onAction && (
                <Button
                    variant="contained"
                    startIcon={<Plus size={18} />}
                    onClick={onAction}
                    sx={{ 
                        borderRadius: 3, 
                        px: 4, 
                        py: 1, 
                        bgcolor: iconColor,
                        '&:hover': { bgcolor: iconColor, opacity: 0.9 },
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                >
                    {actionLabel}
                </Button>
            )}
        </Box>
    )
}

export default EmptyState
