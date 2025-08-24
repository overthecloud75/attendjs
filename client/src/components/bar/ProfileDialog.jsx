import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Avatar, Box, Typography, Divider } from '@mui/material'
import styled from 'styled-components'

const StyledDialog = styled(Dialog)`
    .MuiDialog-paper {
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
`

const StyledDialogTitle = styled(DialogTitle)`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
    font-weight: 600;
    padding: 16px;
`

const StyledDialogContent = styled(DialogContent)`
    padding: 16px;
    background: #fafafa;
`

const ProfileHeader = styled(Box)`
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
    padding: 16px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const StyledTextField = styled(TextField)`
    && {
        margin-bottom: 16px;
    }
    
    .MuiInputBase-root {
        background: white;
        border-radius: 8px;
        transition: all 0.3s ease;
        
        &:hover {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        &.Mui-focused {
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
        }
    }
    
    .MuiInputLabel-root {
        font-weight: 500;
        color: #666;
    }
    
    .MuiInputBase-input {
        font-weight: 500;
        color: #333;
    }
`

const StyledButton = styled(Button)`
    background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 10px 24px;
    border-radius: 8px;
    font-weight: 600;
    text-transform: none;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    transition: all 0.3s ease;
    
    &:hover {
        background: linear-gradient(45deg, #5a6fd8 0%, #6a4190 100%);
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
`

const ProfileDialog = ({user, open, handleClose}) => {

    const userKeys = Object.keys(user).slice(0, 4)
    const userValues = Object.values(user).slice(0, 4)

    const getFieldLabel = (key) => {
        const labels = {
            name: '이름',
            email: '이메일',
            department: '부서',
            position: '직책',
            id: '아이디',
            username: '사용자명'
        }
        return labels[key] || key
    }

    return (
        <StyledDialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
            <StyledDialogTitle>
                👤 프로필 상세 정보
            </StyledDialogTitle>
            <StyledDialogContent>
                <ProfileHeader>
                    <Avatar 
                        sx={{ 
                            width: 50, 
                            height: 50, 
                            background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                            fontSize: '24px',
                            fontWeight: 'bold'
                        }}
                    >
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                    <Box>
                        <Typography variant='h6' fontWeight='600' color='#333'>
                            {user.name || '사용자'}
                        </Typography>
                        <Typography variant='body2' color='#666'>
                            {user.position || '직책'} • {user.department || '부서'}
                        </Typography>
                    </Box>
                </ProfileHeader>
                
                <Divider sx={{ margin: '16px 10px' }} />
                
                {userKeys.map((item, index) => {
                    return (
                        <StyledTextField
                            key={index}
                            id={item}
                            name={item}
                            label={getFieldLabel(item)}
                            fullWidth
                            variant='outlined'
                            value={userValues[index] || ''}
                            readOnly
                            autoComplete='off'
                            size='medium'
                        />
                    )}
                )}
            </StyledDialogContent>
            <DialogActions sx={{ padding: '16px', background: '#fafafa' }}>
                <StyledButton onClick={handleClose} variant='contained'>
                    닫기
                </StyledButton>
            </DialogActions>
        </StyledDialog>
    )
}

export default ProfileDialog