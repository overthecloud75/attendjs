import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { Menu, MenuItem, Box, ListItemIcon, ListItemText, Divider, Avatar } from '@mui/material'
import { User, Key, Lock, LogOut } from 'lucide-react'
import { requestAuth } from '../../utils/AuthUtil'
import ProfileDialog from '../bar/ProfileDialog'
import APIDialog from './APIDialog'

const ProfileMenu = ({ user, anchorEl, setAnchorEl, setMenu }) => {
    const [errorMsg, setErrorMsg] = useState('')
    const [openProfileDialog, setOpenProfileDialog] = useState(false)
    const [openAPIDialog, setOpenAPIDialog] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const open = Boolean(anchorEl)

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleLogout = async () => {
        await requestAuth('logout', 'GET', '', dispatch, navigate, setErrorMsg)
        setMenu(false)
        handleClose()
        if (errorMsg) {
            alert(errorMsg)
        }
    }

    const handleProfileClick = () => {
        handleClose()
        setOpenProfileDialog(true)
    }

    const handleAPIClick = () => {
        handleClose()
        setOpenAPIDialog(true)
    }

    const handleCloseProfileDialog = () => {
        setOpenProfileDialog(false)
    }

    const handleCloseAPIDialog = () => {
        setOpenAPIDialog(false)
    }

    return (
        <>
            <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                            mt: 1.5,
                            minWidth: 240,
                            borderRadius: 3,
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
            >
                <Box sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                        sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontWeight: 'bold' }}
                    >
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                        <Box sx={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user.name || 'User'}
                        </Box>
                        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user.email || ''}
                        </Box>
                    </Box>
                </Box>

                <Divider />

                <MenuItem onClick={handleProfileClick} sx={{ py: 1.5 }}>
                    <ListItemIcon>
                        <User size={18} />
                    </ListItemIcon>
                    <ListItemText primary="내 프로필 (Profile)" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </MenuItem>

                <MenuItem onClick={handleAPIClick} sx={{ py: 1.5 }}>
                    <ListItemIcon>
                        <Key size={18} />
                    </ListItemIcon>
                    <ListItemText primary="API Key 관리" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </MenuItem>

                <MenuItem component={Link} to="/auth/reset-password" sx={{ py: 1.5 }}>
                    <ListItemIcon>
                        <Lock size={18} />
                    </ListItemIcon>
                    <ListItemText primary="비밀번호 변경" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
                    <ListItemIcon sx={{ color: 'error.main' }}>
                        <LogOut size={18} />
                    </ListItemIcon>
                    <ListItemText primary="로그아웃" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </MenuItem>
            </Menu>

            <ProfileDialog
                user={user}
                open={openProfileDialog}
                handleClose={handleCloseProfileDialog}
            />

            <APIDialog
                open={openAPIDialog}
                apiKey={''}
                handleClose={handleCloseAPIDialog}
            />
        </>
    )
}

export default ProfileMenu