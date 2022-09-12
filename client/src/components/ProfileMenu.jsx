import { useSelector, useDispatch } from 'react-redux'
import { clearUser } from '../storage/userSlice.js'
import { Link } from 'react-router-dom'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

const ProfileMenu = ({anchorEl, setAnchorEl}) => {

    const user = useSelector(state => state.user)
    const dispatch = useDispatch()

    const open = Boolean(anchorEl)
    const handleClose = () => {setAnchorEl(null)}
    const handleLogout = () => {
        dispatch(clearUser(user))
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