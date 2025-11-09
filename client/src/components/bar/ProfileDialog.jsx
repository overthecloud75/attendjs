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
    Divider 
} from '@mui/material'

const ProfileDialog = ({ user, open, handleClose }) => {

    console.log(user)
    const userKeys = Object.keys(user).slice(0, 4)
    const userValues = Object.values(user).slice(0, 4)

    const getFieldLabel = (key) => {
        const labels = {
            name: '이름',
            email: '이메일',
            department: '부서',
            rank: '직급',
            id: '아이디',
            username: '사용자명'
        }
        return labels[key] || key
    }

    return (
        <Dialog 
            open={open} 
            onClose={handleClose} 
            maxWidth='sm' 
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 2,
                        boxShadow: 3
                    }
                }
            }}
        >
            <DialogTitle
                sx={{
                bgcolor: 'primary.main',
                color: 'white',
                textAlign: 'center',
                fontWeight: 600,
                py: 2
                }}
            >
                👤 프로필 상세 정보
            </DialogTitle>

            <DialogContent sx={{ bgcolor: '#fafafa', p: 3 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 2,
                        p: 2,
                        bgcolor: 'white',
                        borderRadius: 2,
                        boxShadow: 1
                    }}
                >
                    <Avatar
                        sx={{
                        width: 50,
                        height: 50,
                        bgcolor: 'primary.main',
                        fontSize: 24,
                        fontWeight: 'bold'
                        }}
                    >
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                    <Box>
                        <Typography variant='h6' fontWeight={600} color='text.primary'>
                            {user.name || '사용자'}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            {user.rank || '직급'} • {user.department || '부서'}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {userKeys.map((item, index) => (
                    <TextField
                        key={index}
                        id={item}
                        name={item}
                        label={getFieldLabel(item)}
                        fullWidth
                        variant="outlined"
                        value={userValues[index] || ''}
                        slotProps={{
                            input: { readOnly: true }
                        }}
                        sx={{
                            mb: 2,
                            bgcolor: 'white',
                            borderRadius: 1,
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: 'primary.light',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'primary.main',
                                }
                            }
                        }}
                    />
                ))}
            </DialogContent>

            <DialogActions sx={{ bgcolor: '#fafafa', p: 2 }}>
                <Button 
                    onClick={handleClose} 
                    variant='contained' 
                    sx={{ 
                        textTransform: 'none', 
                        fontWeight: 600, 
                        px: 3 
                    }}
                >
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ProfileDialog