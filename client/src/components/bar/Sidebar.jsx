import { Box, AppBar, Toolbar, List, Typography, ListItemButton, Tooltip } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { pagesInfo } from '../../configs/pages'

const itemDict = {
    Attendance: [
        pagesInfo['dashboard'],
        pagesInfo['attend'],
        pagesInfo['wifi-attend'],
        pagesInfo['gps-attend']
    ],
    Management: [
        pagesInfo['employee'],
        pagesInfo['meetings'],
        pagesInfo['device'],
        pagesInfo['creditcard']
    ],
    Community: [
        pagesInfo['approval'],
        pagesInfo['board'],
    ],
    Admin: [
        pagesInfo['summary'],
        pagesInfo['location'],
        pagesInfo['loginhistory'],
    ]
}

const SidebarItems = ({ itemList }) => {
    const user = useSelector(state => state.user)
    const location = useLocation()

    return (
        <>
            {itemList.map((item, itemIndex) => {
                const hasAccess = item.auth || user.isAdmin
                if (!hasAccess) return null

                // 정확히 일치하거나 하위 경로일 경우 활성화 (예: /board, /board/write)
                const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))

                return (
                    <StyledListItemButton
                        component={Link}
                        key={itemIndex}
                        to={item.to}
                        active={isActive ? 1 : 0}
                        sx={{ display: item.visible ? 'flex' : 'none' }}
                        disableRipple
                    >
                        <Tooltip
                            title={item.title}
                            placement='right'
                            arrow
                        >
                            <IconWrapper active={isActive ? 1 : 0}>
                                {item.emoji}
                            </IconWrapper>
                        </Tooltip>
                        <ItemText active={isActive ? 1 : 0}>
                            {item.title}
                        </ItemText>
                    </StyledListItemButton>
                )
            })}
        </>
    )
}

const SidebarCategories = () => {
    return (
        Object.keys(itemDict).map((title, titleIndex) => (
            <div key={titleIndex}>
                <CategoryTitle component='div'>
                    {title}
                </CategoryTitle>
                <SidebarItems itemList={itemDict[title]} />
            </div>
        ))
    )
}

const Sidebar = ({ menu, setMenu }) => {
    const user = useSelector(state => state.user)

    const handleMenu = () => {
        if (user.isLogin) setMenu(!menu)
    }

    return (
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
}

export default Sidebar

// --- Styled Components ---

const SidebarContainer = styled(Box)(({ theme }) => ({
    width: 260, // 기본 너비 고정
    height: '100vh',
    borderRight: '1px solid #e2e8f0',
    background: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s ease',
    flexShrink: 0,
    [theme.breakpoints.down('md')]: {
        width: 80, // 태블릿/모바일 축소 너비
    },
}))

const StyledAppBar = styled(AppBar)({
    background: 'white',
    boxShadow: 'none',
    borderBottom: '1px solid #e2e8f0',
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
    display: 'none',
    [theme.breakpoints.up('md')]: {
        display: 'block',
    },
    marginLeft: '12px',
    fontSize: '20px',
    fontWeight: 800,
    background: 'linear-gradient(45deg, #3b82f6 30%, #2563eb 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px'
}))

const MenuContainer = styled(Box)(({ theme }) => ({
    flex: 1,
    overflowY: 'auto',
    padding: '16px 12px',
    '&::-webkit-scrollbar': {
        width: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#cbd5e1',
        borderRadius: '4px',
    },
}))

const CategoryTitle = styled(Typography)(({ theme }) => ({
    display: 'none',
    [theme.breakpoints.up('md')]: {
        display: 'block',
    },
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#94a3b8',
    padding: '0 16px',
    marginTop: '24px',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
}))

const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
    minHeight: 48,
    padding: '0 16px',
    marginBottom: 4,
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    backgroundColor: active ? '#eff6ff' : 'transparent',
    color: active ? '#2563eb' : '#64748b',

    '&:hover': {
        backgroundColor: active ? '#eff6ff' : '#f8fafc',
        color: '#1e293b',
        transform: 'translateX(4px)',
    },

    [theme.breakpoints.down('md')]: {
        justifyContent: 'center',
        padding: '0 8px',
        '&:hover': {
            transform: 'none', // 모바일에서는 이동 효과 제거
        }
    },
}))

const IconWrapper = styled('div')(({ active }) => ({
    fontSize: '20px',
    minWidth: '32px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: active ? 1 : 0.8,
}))

const ItemText = styled(Typography)(({ theme, active }) => ({
    display: 'none',
    [theme.breakpoints.up('md')]: {
        display: 'block',
    },
    fontSize: '0.925rem',
    fontWeight: active ? 600 : 500,
    marginLeft: '12px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
}))

const FooterContainer = styled(Box)(({ theme }) => ({
    display: 'none',
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
    padding: '16px',
    borderTop: '1px solid #e2e8f0',
    bgcolor: '#f8fafc',
    justifyContent: 'center'
}))

const FooterText = styled(Typography)({
    fontSize: '0.75rem',
    color: '#94a3b8',
    fontWeight: 500
})