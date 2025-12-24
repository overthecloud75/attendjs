import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Avatar,
    Box,
    Typography,
    IconButton,
    Stack
} from '@mui/material'
import { X, Building, Briefcase, User as UserIcon } from 'lucide-react'

const ProfileDialog = ({ user, open, handleClose }) => {

    const fields = [
        { key: 'department', label: '부서 (Department)', icon: <Building size={18} /> },
        { key: 'rank', label: '직급 (Rank)', icon: <Briefcase size={18} /> },
    ]

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth='xs'
            fullWidth
            slotProps={{
                paper: {
                    sx: { borderRadius: 3, padding: 0 }
                }
            }}
        >
            <DialogTitle sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
                <Typography variant="h6" fontWeight={700}>
                    내 프로필
                </Typography>
                <IconButton onClick={handleClose} size="small">
                    <X size={20} />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
                {/* Header Banner Section */}
                <Box sx={{
                    background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
                    color: 'white',
                    px: 3,
                    py: 4,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: 1.5
                }}>
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            bgcolor: 'white',
                            color: 'primary.main',
                            fontSize: 32,
                            fontWeight: 'bold',
                            border: '4px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    >
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant='h5' fontWeight={600}>
                            {user.name || '사용자'}
                        </Typography>
                        <Typography variant='body2' sx={{ opacity: 0.8 }}>
                            {user.email || ''}
                        </Typography>
                    </Box>
                </Box>

                {/* Details Section */}
                <Box sx={{ px: 3, py: 4 }}>
                    <Stack spacing={2}>
                        {fields.map((field) => (
                            <Box key={field.key} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', justifyContent: 'center' }}>
                                    {field.icon}
                                    <Typography variant="caption" fontWeight={600}>
                                        {field.label}
                                    </Typography>
                                </Box>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    value={user[field.key] || '-'}
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                            sx: {
                                                bgcolor: '#f8f9fa',
                                                fontSize: '0.9rem',
                                                '& fieldset': { border: '1px solid #e0e0e0' },
                                            }
                                        },
                                        htmlInput: {
                                            style: { textAlign: 'center' }
                                        }
                                    }}
                                />
                            </Box>
                        ))}
                    </Stack>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={handleClose}
                    variant='outlined'
                    color="inherit"
                    sx={{ width: '100%' }}
                >
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ProfileDialog