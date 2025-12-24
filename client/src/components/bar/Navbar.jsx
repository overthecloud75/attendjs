import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Box, AppBar, Toolbar, Avatar, Badge, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Menu, MessageSquare, Bell, ChevronDown } from 'lucide-react'
import ProfileMenu from '../bar/ProfileMenu'

const Navbar = ({ menu, setMenu }) => {
    const user = useSelector(state => state.user)
    const [anchorEl, setAnchorEl] = useState(null)

    const handleMenu = () => {
        if (user.isLogin) setMenu(!menu)
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    return (
        <Box>
            <AppBar position='static' elevation={0} sx={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                borderBottom: '1px solid #f1f5f9'
            }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: '64px' }}>
                    {/* Left: Menu Toggle */}
                    <MenuToggleButton
                        menuOpen={!menu}
                        onClick={handleMenu}
                    >
                        <Menu size={20} strokeWidth={2.5} />
                    </MenuToggleButton>

                    {/* Center: Search Portal Target */}
                    <Box
                        id="navbar-search-portal"
                        sx={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            px: 2,
                            pointerEvents: 'none', // Allow clicks to pass through if empty
                            '& > *': { pointerEvents: 'auto' } // Re-enable clicks for children
                        }}
                    />

                    {/* Right: Icons & User Profile */}
                    <RightSection>
                        <IconsContainer>
                            <IconItem>
                                <CustomBadge badgeContent={2} max={99}>
                                    <IconWrapper>
                                        <MessageSquare size={20} strokeWidth={2} />
                                    </IconWrapper>
                                </CustomBadge>
                            </IconItem>
                            <IconItem>
                                <CustomBadge badgeContent={5} max={99}>
                                    <IconWrapper>
                                        <Bell size={20} strokeWidth={2} />
                                    </IconWrapper>
                                </CustomBadge>
                            </IconItem>
                        </IconsContainer>

                        <UserSection onClick={handleClick}>
                            <CustomAvatar src={user.profileImage}>
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </CustomAvatar>
                            <UserInfo>
                                <UserName>{user.name || '사용자'}</UserName>
                                <UserRole>{user.isAdmin ? '관리자' : '직원'}</UserRole>
                            </UserInfo>
                            <Box sx={{ color: '#94a3b8', display: { xs: 'none', md: 'block' } }}>
                                <ChevronDown size={16} />
                            </Box>
                        </UserSection>
                    </RightSection>
                </Toolbar>
            </AppBar>

            <ProfileMenu
                user={user}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                setMenu={setMenu}
            />
        </Box>
    )
}

export default Navbar

// --- Styled Components ---

const RightSection = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    marginLeft: 'auto',
})

const IconsContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
})

const IconItem = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    color: '#64748b',
    transition: 'all 0.2s ease',
    '&:hover': {
        background: '#f1f5f9',
        color: '#4f46e5',
        transform: 'translateY(-1px)',
    },
})

const IconWrapper = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
})

const CustomBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        background: '#ef4444',
        color: 'white',
        fontSize: '10px',
        fontWeight: 700,
        minWidth: '18px',
        height: '18px',
        padding: '0 4px',
        borderRadius: '10px',
        border: '2px solid white',
        boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)',
        top: 2,
        right: 2,
    },
}))

const UserSection = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '6px',
    paddingRight: '12px',
    borderRadius: '30px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid transparent',
    '&:hover': {
        background: '#fff',
        borderColor: '#e2e8f0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    },
})

const UserInfo = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: '4px',
    [theme.breakpoints.down('md')]: {
        display: 'none',
    },
}))

const UserName = styled(Typography)({
    fontSize: '14px',
    fontWeight: 600,
    color: '#1e293b',
    lineHeight: 1.2,
    marginBottom: '2px',
})

const UserRole = styled(Typography)({
    fontSize: '11px',
    fontWeight: 500,
    color: '#64748b',
    lineHeight: 1,
    padding: '2px 6px',
    background: '#f1f5f9',
    borderRadius: '4px',
})

const CustomAvatar = styled(Avatar)({
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
    fontSize: '15px',
    fontWeight: 600,
    border: '2px solid #fff',
    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
})

const MenuToggleButton = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'menuOpen'
})(({ menuOpen }) => ({
    display: menuOpen ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: '#fff',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    marginRight: '20px',
    '&:hover': {
        background: '#f8fafc',
        color: '#4f46e5',
        borderColor: '#cbd5e1',
        transform: 'translateY(-1px)',
    },
}))