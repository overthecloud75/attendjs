import { Dialog, DialogActions, DialogContent, DialogTitle, Drawer, useMediaQuery, useTheme, Box, IconButton, Typography, Stack } from '@mui/material'
import { X } from 'lucide-react'

/**
 * BaseDialog Component
 * 
 * A responsive wrapper that renders:
 * - A standard MUI Dialog on Desktop (sm and up)
 * - A Bottom Sheet (MUI Drawer) on Mobile (xs)
 * 
 * @param {boolean} open - Whether the dialog is open
 * @param {function} onClose - Function to call when closing
 * @param {string} title - The dialog title
 * @param {JSX.Element} titleIcon - Optional icon for the title
 * @param {JSX.Element} children - The main content
 * @param {JSX.Element} actions - The action buttons (DialogActions)
 * @param {string} maxWidth - MUI Dialog maxWidth (default: 'sm')
 */
const BaseDialog = ({ open, onClose, title, titleIcon, children, actions, maxWidth = 'sm' }) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    if (isMobile) {
        return (
            <Drawer
                anchor="bottom"
                open={open}
                onClose={onClose}
                slotProps={{
                    paper: {
                        sx: {
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            bgcolor: 'var(--card-bg)',
                            maxHeight: '90vh',
                            pb: 2
                        }
                    }
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Box sx={{ 
                        width: 40, 
                        height: 4, 
                        bgcolor: 'var(--border-color)', 
                        borderRadius: 2, 
                        mx: 'auto', 
                        mb: 2 
                    }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                            {titleIcon && <Box sx={{ color: 'var(--text-active)', display: 'flex' }}>{titleIcon}</Box>}
                            <Typography variant="h6" fontWeight="700" color="var(--text-primary)">
                                {title}
                            </Typography>
                        </Stack>
                        <IconButton onClick={onClose} size="small" sx={{ color: 'var(--text-secondary)' }}>
                            <X size={20} />
                        </IconButton>
                    </Box>

                    <Box sx={{ overflowY: 'auto', maxHeight: '60vh', px: 0.5 }}>
                        {children}
                    </Box>

                    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {actions}
                    </Box>
                </Box>
            </Drawer>
        )
    }

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            fullWidth 
            maxWidth={maxWidth}
            slotProps={{
                paper: { sx: { borderRadius: 3, bgcolor: 'var(--card-bg)', backgroundImage: 'none' } }
            }}
        >
            <DialogTitle sx={{ 
                bgcolor: 'var(--card-bg)', 
                color: 'var(--text-primary)', 
                borderBottom: '1px solid var(--border-color)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                py: 2 
            }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                    {titleIcon && <Box sx={{ color: 'var(--text-active)', display: 'flex' }}>{titleIcon}</Box>}
                    <Typography variant="h6" fontWeight="700" component="span">{title}</Typography>
                </Stack>
                <IconButton onClick={onClose} size="small" sx={{ color: 'var(--text-secondary)' }}>
                    <X size={20} />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ bgcolor: 'var(--card-bg)', color: 'var(--text-primary)', pt: 3 }}>
                {children}
            </DialogContent>
            {actions && (
                <DialogActions sx={{ p: 3, bgcolor: 'var(--card-bg)', borderTop: '1px solid var(--border-color)' }}>
                    {actions}
                </DialogActions>
            )}
        </Dialog>
    )
}

export default BaseDialog
