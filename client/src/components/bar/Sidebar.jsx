import { Box, AppBar, Toolbar, List, Typography, ListItemButton, Tooltip, Collapse, Drawer, useTheme, useMediaQuery } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Link, useLocation } from 'react-router-dom'
import { pagesInfo } from '../../configs/pages'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'
import { ChevronUp, ChevronDown, CalendarDays, BarChart3, Users, MessageSquare, Bot, ShieldCheck } from 'lucide-react'

const itemDict = {
    Attendance: {
        icon: CalendarDays,
        items: [
            pagesInfo['dashboard'],
            pagesInfo['attend'],
            pagesInfo['wifi'],
            pagesInfo['gps']
        ]
    },
    Management: {
        icon: Users,
        items: [
            pagesInfo['employee'],
            pagesInfo['meetings'],
            pagesInfo['device'],
            pagesInfo['creditcard']
        ]
    },
    Community: {
        icon: MessageSquare,
        items: [
            pagesInfo['approval'],
            pagesInfo['board'],
        ]
    },
    'AI Workspace': {
        icon: Bot,
        items: [
            pagesInfo['agentic-smartwork'],
        ]
    },
    Admin: {
        icon: ShieldCheck,
        items: [
            pagesInfo['summary'],
            pagesInfo['settings'],
            pagesInfo['loginhistory'],
        ]
    }
}

const SidebarItems = ({ itemList }) => {
    return (
        <>
            {itemList.map((item, itemIndex) => (
                <SidebarItem key={itemIndex} item={item} />
            ))}
        </>
    )
}

const SidebarItem = ({ item }) => {
    const { user } = useAuth()
    const location = useLocation()
    const [open, setOpen] = useState(false)
    const { t } = useTranslation()

    const hasAccess = user.isLogin && (item.auth || user.isAdmin)
    if (!hasAccess) return null

    // ... (rest of logic) ...
    const displayTitle = t(`sidebar-${item.id}`, item.id)

    const hasChildren = item.children && item.children.length > 0
    const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))

    useEffect(() => {
        if (hasChildren && isActive) {
            setOpen(true)
        }
    }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleClick = (e) => {
        if (hasChildren) {
            // e.preventDefault() // Allow navigation
            setOpen(!open)
        }
    }

    const Icon = item.icon

    return (
        <>
            <StyledListItemButton
                component={item.to ? Link : 'div'}
                to={item.to}
                active={isActive ? 1 : 0}
                sx={{ display: item.visible ? 'flex' : 'none' }}
                onClick={handleClick}
                disableRipple
            >
                <Tooltip
                    title={displayTitle}
                    placement='right'
                    arrow
                >
                    <IconWrapper active={isActive ? 1 : 0}>
                        {Icon && <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />}
                    </IconWrapper>
                </Tooltip>
                <ItemText active={isActive ? 1 : 0}>
                    {displayTitle}
                </ItemText>
                {hasChildren && (
                    <Box sx={{ ml: 'auto' }}>
                        {open ? <ChevronUp size={20} color='var(--text-secondary)' /> : <ChevronDown size={20} color='var(--text-secondary)' />}
                    </Box>
                )}
            </StyledListItemButton>

            {hasChildren && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 2.5 }}>
                        {item.children.map((child, index) => (
                            <SidebarItem key={index} item={child} />
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    )
}

const SidebarCategories = () => {
    const { t } = useTranslation()
    return (
        Object.keys(itemDict).map((title, titleIndex) => {
            const category = itemDict[title]
            const Icon = category.icon
            return (
                <div key={titleIndex}>
                    <CategoryTitle component='div' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Icon size={14} strokeWidth={2.5} />
                        {t(title.toLowerCase(), title)}
                    </CategoryTitle>
                    <SidebarItems itemList={category.items} />
                </div>
            )
        })
    )
}

const Sidebar = ({ menu, setMenu }) => {
    const { user } = useAuth()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const handleMenu = () => {
        if (user.isLogin) setMenu(!menu)
    }

    const sidebarContent = (
        <SidebarContainer>
            {/* Top: Logo */}
            <StyledAppBar position='static'>
                <Toolbar sx={{ justifyContent: { xs: 'center', md: 'flex-start' }, px: 2 }}>
                    <LogoImage
                        src='/smartwork.webp'
                        alt='SmartWork Logo'
                        onClick={handleMenu}
                    />
                    <LogoText component='span'>
                        SmartWork
                    </LogoText>
                </Toolbar>
            </StyledAppBar>

            {/* Middle: Menu Items */}
            <MenuContainer>
                <List disablePadding>
                    <SidebarCategories />
                </List>
            </MenuContainer>

            {/* Bottom: User Profile / Footer */}
            <FooterContainer>
                <FooterText variant='caption'>
                    © {(new Date().getFullYear())} SmartWork.
                </FooterText>
            </FooterContainer>
        </SidebarContainer>
    )

    if (isMobile) {
        return (
            <Drawer
                anchor="left"
                open={menu}
                onClose={() => setMenu(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 220,
                        backgroundColor: 'var(--bg-primary-transparent, rgba(255, 255, 255, 0.8))',
                        backdropFilter: 'blur(10px)',
                        borderRight: '1px solid var(--border-color)',
                        boxSizing: 'border-box',
                        backgroundImage: 'none'
                    },
                    '& .MuiBackdrop-root': {
                        backdropFilter: 'blur(2px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.1)'
                    }
                }}
            >
                {sidebarContent}
            </Drawer>
        )
    }

    return sidebarContent
}

export default Sidebar

// --- Styled Components ---

const SidebarContainer = styled(Box)(({ theme }) => ({
    width: 240, // Reduced from 260
    height: '100vh',
    borderRight: '1px solid var(--border-color)',
    background: 'var(--bg-primary)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
}))

const StyledAppBar = styled(AppBar)({
    background: 'var(--bg-primary)',
    boxShadow: 'none',
    borderBottom: '1px solid var(--border-color)',
    height: 64,
    justifyContent: 'center'
})

const LogoImage = styled('img')(({ theme }) => ({
    height: 40,
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'scale(1.05)'
    }
}))

const LogoText = styled(Typography)(({ theme }) => ({
    display: 'block',
    marginLeft: '10px',
    fontSize: '18px',
    fontWeight: 800,
    background: 'linear-gradient(45deg, #3b82f6 30%, #2563eb 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px'
}))

const MenuContainer = styled(Box)(({ theme }) => ({
    flex: 1,
    overflowY: 'auto',
    padding: '16px 8px',
    '&::-webkit-scrollbar': {
        width: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'var(--border-color)',
        borderRadius: '4px',
    },
}))

const CategoryTitle = styled(Typography)(({ theme }) => ({
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    padding: '0 16px',
    marginTop: '24px',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
}))

const StyledListItemButton = styled(ListItemButton, {
    shouldForwardProp: (prop) => prop !== 'active'
})(({ theme, active }) => ({
    minHeight: 48,
    padding: '0 16px',
    marginBottom: 4,
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    backgroundColor: active ? 'var(--bg-active)' : 'transparent',
    color: active ? 'var(--text-active)' : 'var(--text-secondary)',

    '&:hover': {
        backgroundColor: active ? 'var(--bg-active)' : 'var(--hover-bg)',
        color: 'var(--text-primary)',
        transform: 'translateX(4px)',
    },

    [theme.breakpoints.down('md')]: {
        justifyContent: 'flex-start',
        padding: '0 16px',
        '&:hover': {
            transform: 'none',
        }
    },
}))

const IconWrapper = styled('div', {
    shouldForwardProp: (prop) => prop !== 'active'
})(({ active }) => ({
    fontSize: '20px',
    minWidth: '24px',
    width: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: active ? 1 : 0.8,
}))

const ItemText = styled(Typography, {
    shouldForwardProp: (prop) => prop !== 'active'
})(({ theme, active }) => ({
    display: 'block',
    fontSize: '0.925rem',
    fontWeight: active ? 600 : 500,
    marginLeft: '12px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
}))

const FooterContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    padding: '16px',
    borderTop: '1px solid var(--border-color)',
    bgcolor: 'var(--bg-secondary)',
    justifyContent: 'center'
}))

const FooterText = styled(Typography)({
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    fontWeight: 500
})