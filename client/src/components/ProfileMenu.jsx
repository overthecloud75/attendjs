import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { requestAuth } from '../utils/AuthUtil'
import { getUser } from '../storage/userSlice.js'

const ProfileMenu = ({anchorEl, setAnchorEl, setMenu}) => {
    // eslint-disable-next-line
    const [loading, setLoading] = useState(false)
    // eslint-disable-next-line
    const [errorMsg, setErrorMsg] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = getUser()
    const open = Boolean(anchorEl)
    const handleClose = () => {setAnchorEl(null)}
    const handleLogout = async () => {
        requestAuth('logout', 'get', '', dispatch, navigate, setErrorMsg, setLoading)
        setMenu(false)
        handleClose()
    }

    return (
        <Menu
            id='basic-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <Link to='/register' style={{ textDecoration: 'none' }}>
                <MenuItem onClick={handleClose}>Register</MenuItem>
            </Link>
            {user.isLogin?(
                <Link to='/' style={{ textDecoration: 'none' }}>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Link>):(
                <Link to='/login' style={{ textDecoration: 'none' }}>
                    <MenuItem onClick={handleClose}>Login</MenuItem>
                </Link>)
            }
        </Menu>
    )
}

export default ProfileMenu