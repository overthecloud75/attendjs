import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, AppBar, Toolbar, Avatar, Badge, Typography, Divider } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Menu, MessageSquare, ChevronDown, Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ProfileMenu from '../bar/ProfileMenu'
import { toggleTheme } from '../../storage/themeSlice'

const Navbar = ({ menu, setMenu }) => {
    const user = useSelector(state => state.user)
    const theme = useSelector(state => state.theme.mode)
    const dispatch = useDispatch()
    const { i18n } = useTranslation()
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
                background: 'var(--bg-primary)',
                backdropFilter: 'blur(8px)',
                borderBottom: '1px solid var(--border-color)'
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
                            {/* Language Toggle */}
                            <Box sx={{ display: 'flex', gap: 1, mr: 1 }}>
                                <LanguageButton
                                    active={i18n.language === 'ko' ? 1 : 0}
                                    onClick={() => i18n.changeLanguage('ko')}
                                >
                                    KOR
                                </LanguageButton>
                                <Divider orientation="vertical" flexItem sx={{ bgcolor: 'var(--border-color)', height: 16, my: 'auto' }} />
                                <LanguageButton
                                    active={i18n.language === 'en' ? 1 : 0}
                                    onClick={() => i18n.changeLanguage('en')}
                                >
                                    ENG
                                </LanguageButton>
                            </Box>

                            <IconItem onClick={() => dispatch(toggleTheme())}>
                                <IconWrapper>
                                    {theme === 'dark' ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
                                </IconWrapper>
                            </IconItem>
                            <IconItem>
                                <CustomBadge badgeContent={2} max={99}>
                                    <IconWrapper>
                                        <MessageSquare size={20} strokeWidth={2} />
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
    color: 'var(--text-secondary)',
    transition: 'all 0.2s ease',
    '&:hover': {
        background: 'var(--hover-bg)', // This is #f1f5f9 in light mode
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
        background: 'var(--hover-bg)',
        borderColor: 'var(--border-color)',
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
    color: 'var(--text-primary)',
    lineHeight: 1.2,
    marginBottom: '2px',
})

const UserRole = styled(Typography)({
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    lineHeight: 1,
    padding: '2px 6px',
    background: 'var(--bg-secondary)',
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
    background: 'var(--bg-primary)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-color)',
    marginRight: '20px',
    '&:hover': {
        background: 'var(--hover-bg)',
        color: '#4f46e5',
        borderColor: 'var(--border-color)',
        transform: 'translateY(-1px)',
    },
}))

const LanguageButton = styled(Typography)(({ active }) => ({
    fontSize: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    color: active ? '#4f46e5' : 'var(--text-secondary)',
    transition: 'all 0.2s',
    '&:hover': {
        color: '#4f46e5',
        background: 'var(--hover-bg)',
        borderRadius: '4px',
        padding: '2px 4px',
        margin: '-2px -4px' // Compensate padding
    }
}))