import { useState } from 'react'
import { Box, AppBar, Toolbar, Avatar, Badge, Typography } from '@mui/material'
import { getUser } from '../../storage/userSlice'
import ProfileMenu from '../bar/ProfileMenu'

const ItemBox = ({ children }) => (
    <Box 
        sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 2
        }}
    >
        {children}
    </Box>
)

const Item = ({ children }) => (
    <Box 
        sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            transition: 'all 0.2s ease',
            '&:hover': {
                background: 'rgba(0, 0, 0, 0.04)', 
            },
        }}
    >
        {children}
    </Box>
)

const Icon = ({ children }) => {
    return (
        <Box
            sx={{
                fontSize: '20px',
                color: '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                
                '&:hover': {
                    background: 'rgba(0, 0, 0, 0.04)',
                },
            }}
        >
            {children}
        </Box>
    )
}

const CustomBadge = ({ children, badgeContent, ...props }) => {
    return (
        <Badge
            badgeContent={badgeContent}
            slotProps={{
                badge: {
                    sx: {
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 600,
                        minWidth: '18px',
                        height: '18px',
                        borderRadius: '9px',
                        border: '2px solid white',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    },
                },
            }}
            {...props}
        >
            {children}
        </Badge>
    )
}

const UserSection = ({ children, ...props }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '2px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                
                // 배경 및 테두리
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                border: '1px solid #e1e5e9',

                // &:hover 스타일
                '&:hover': {
                    background: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                },
            }}
            {...props}
        >
            {children}
        </Box>
    );
};

const UserInfo = ({ children, ...props }) => {
    return (
        <Box
            sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                alignItems: 'flex-start',
            }}
            {...props}
        >
            {children}
        </Box>
    )
}

const UserName = ({ children, ...props }) => {
    return (
        <Typography
            component='span' 
            sx={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#1e293b',
                lineHeight: 1.2,
            }}
            {...props}
        >
            {children}
        </Typography>
    );
};

const UserRole = ({ children, ...props }) => {
    return (
        <Typography
            component='span' 
            sx={{
                fontSize: '12px',
                color: '#64748b',
                lineHeight: 1.2,
            }}
            {...props}
        >
            {children}
        </Typography>
    )
}

const CustomAvatar = ({ children, ...props }) => {
    return (
        <Avatar
            sx={{

                width: '36px', 
                height: '36px',
                
                border: '2px solid #e1e5e9',
                transition: 'all 0.3s ease',
        
                '&:hover': {
                    borderColor: '#667eea',
                    transform: 'scale(1.05)',
                },
            }}
            {...props}
        >
            {children}
        </Avatar>
    )
}

const Navbar = ({menu, setMenu}) => {

    const user = getUser()
    const [anchorEl, setAnchorEl] = useState(null)
    const handleMenu = () => {
        user.isLogin && setMenu(!menu)
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    return (
        <Box>
            <AppBar position='static' sx={{ background: 'white' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between'}}>
                    {/* left */}
                    <div>
                        <Box
                            onClick={handleMenu}
                            sx={{
                                display: !menu ? 'flex' : 'none', 
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '35px',
                                height: '35px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.25s ease',
                            
                                background: '#5f6ee1', 
                                color: 'white',

                                '&:hover': {
                                    background: '#4d5ccb', 
                                    transform: 'scale(1.04)',
                                },
                            }}
                        >
                            ☰
                        </Box>
                    </div>
                    {/* right */}
                    <ItemBox>  
                        <ItemBox>  
                            <Item>
                                <CustomBadge badgeContent={2} max={99}>
                                    <Icon>
                                        💬
                                    </Icon>
                                </CustomBadge>
                            </Item>
                            <Item>
                                <CustomBadge badgeContent={5} max={99}>
                                    <Icon>
                                        🔔
                                    </Icon>
                                </CustomBadge>
                            </Item>
                        </ItemBox>  
                        <UserSection onClick={handleClick}>
                            <UserInfo>
                                <UserName>{user.name || '사용자'}</UserName>
                                <UserRole>{user.isAdmin ? '관리자' : '직원'}</UserRole>
                            </UserInfo>
                            <CustomAvatar>
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </CustomAvatar>
                        </UserSection>
                    </ItemBox>
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