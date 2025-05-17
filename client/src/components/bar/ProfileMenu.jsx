import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { Menu, MenuItem, Box } from '@mui/material'
import { requestAuth } from '../../utils/AuthUtil'
import ProfileDialog from '../bar/ProfileDialog' 
import APIDialog from './APIDialog'

const ProfileMenu = ({user, anchorEl, setAnchorEl, setMenu}) => {
    const [errorMsg, setErrorMsg] = useState('')
    const [openProfileDialog, setOpenProfileDialog] = useState(false)
    const [openAPIDialog, setOpenAPIDialog] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const open = Boolean(anchorEl)
    const handleClose = () => {setAnchorEl(null)}
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
                id='basic-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {
                        'aria-labelledby': 'basic-button',
                    }
                }}
            >
                <Box>
                    <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                    <MenuItem onClick={handleAPIClick}>API Key</MenuItem>
                    <MenuItem onClick={handleClose} component={Link} to='/auth/reset-password' style={{ textDecoration: 'none' }}>
                        Reset Password
                    </MenuItem>
                    <MenuItem onClick={handleLogout} component={Link} to='/auth/login' style={{ textDecoration: 'none' }}>
                        Logout
                    </MenuItem>
                </Box>
            </Menu>
            <ProfileDialog
                user={user}
                open={openProfileDialog}
                handleClose={handleCloseProfileDialog}
            />
            <APIDialog
                open={openAPIDialog}
                handleClose={handleCloseAPIDialog}
            />
        </>
    )
}

export default ProfileMenu