import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { Menu, MenuItem, Box } from '@mui/material'
import { requestAuth } from '../../utils/AuthUtil'
import ProfileDialog from '../bar/ProfileDialog' 

const ProfileMenu = ({user, anchorEl, setAnchorEl, setMenu}) => {
    // eslint-disable-next-line
    const [errorMsg, setErrorMsg] = useState('')
    const [openDialog, setOpenDialog] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const open = Boolean(anchorEl)
    const handleClose = () => {setAnchorEl(null)}
    const handleLogout = async () => {
        requestAuth('logout', 'GET', '', dispatch, navigate, setErrorMsg)
        setMenu(false)
        handleClose()
    }
    const handleProfileClick = () => {
        handleClose()
        setOpenDialog(true)
    }
    const handleCloseDialog = () => {
        setOpenDialog(false)
    }

    return (
        <>
            <Menu
                id='basic-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {user.isLogin?(
                    <Box>
                        <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                        <MenuItem onClick={handleClose} component={Link} to='/auth/reset-password' style={{ textDecoration: 'none' }}>
                            Reset Password
                        </MenuItem>
                        <MenuItem onClick={handleLogout} component={Link} to='/' style={{ textDecoration: 'none' }}>
                            Logout
                        </MenuItem>
                    </Box>
                ):(<Box>
                        <MenuItem onClick={handleClose} component={Link} to='/auth/register' style={{ textDecoration: 'none' }}>
                            Register
                        </MenuItem>
                        <MenuItem onClick={handleClose} component={Link} to='/auth/login' style={{ textDecoration: 'none' }}>
                            Login
                        </MenuItem>
                    </Box>
                )}
            </Menu>
            <ProfileDialog
                user={user}
                openDialog={openDialog}
                handleCloseDialog={handleCloseDialog}
            />
        </>
    )
}

export default ProfileMenu