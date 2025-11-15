import { Box, AppBar, Toolbar, List, Typography, ListItemButton, Tooltip, useTheme } from '@mui/material'
import { Link } from 'react-router-dom'
import { getUser } from '../../storage/userSlice'

const itemDict = 
    {
        Attendance : [
            {
                to: '/dashboard', 
                emoji: '📊',
                title: 'Dashboard',
                auth: true,
                visible: true
            },
            {
                to: '/attend', 
                emoji: '🕒',
                title: 'Attend',
                auth: true,
                visible: true
            },
            {    
                to: '/wifi-attend',
                emoji: '📶',
                title: 'Wifi-Attend',
                auth: false, 
                visible: false
            }, 
            {    
                to: '/gps-attend',
                emoji: '📍',
                title: 'GPS-Attend',
                auth: true,
                visible: true
            }
        ],
    Management : [
        {
            to: '/employee',
            emoji: '👥',
            title: 'Employee',
            auth: true,
            visible: true
        },
        {
            to: '/meetings',
            emoji: '📅',
            title: 'Meetings',
            auth: true,
            visible: true
        },
        {
            to: '/device',
            emoji: '💻',
            title: 'Device',
            auth: true,
            visible: true
        },
        {
            to: '/creditcard',
            emoji: '💳',
            title: 'CreditCard',
            auth: true,
            visible: true
        }
    ],
    Community : [
        {
            to: '/approvalhistory',
            emoji: '✔️',
            title: 'ApprovalHistory',
            auth: true,
            visible: true
        },
        {
            to: '/board',
            emoji: '📋',
            title: 'Board',
            auth: true,
            visible: true
        },        
    ],
    Admin : [
        {
            to: '/summary',
            emoji: '📄',
            title: 'Summary',
            auth: false,
            visible: true
        },
        {
            to: '/location',
            emoji: '📌',
            title: 'Location',
            auth: false,
            visible: true
        },
        {
            to: '/loginhistory',
            emoji: '🔐',
            title: 'LoginHistory',
            auth: false,
            visible: true
        },
    ]
}

const SidebarItems = ({itemList, titleIndex}) => {
    const user = getUser()
    const theme = useTheme()
    return (
        <>
            {itemList.map((item, itemIndex) => {
                const hasAccess = item.auth || user.isAdmin
                const itemDisplay = item.visible ? 'flex' : 'none' 
                return hasAccess ? (
                    <ListItemButton
                        component={Link}
                        key={itemIndex}
                        to={item.to}
                        disableRipple
                        sx={{
                            display: itemDisplay,
                            alignItems: 'center',
                            height: '50px',
                            padding: '0 20px',
                            margin: '2px 10px',
                            borderRadius: '12px',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            textDecoration: 'none', 
                            '&:hover': {
                                backgroundColor: 'transparent', 
                                background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', 
                                transform: 'translateX(5px)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                
                                '& .MuiTypography-root': {
                                    color: '#4a23d9',
                                },
                            },

                            [theme.breakpoints.down('sm')]: {
                                height: '40px',
                                padding: '5px 0px',
                                justifyContent: 'center',
                            },
                        }}
                    >
                        <Tooltip 
                            title={item.title} 
                            placement='bottom' 
                            arrow
                            sx={{ 
                                display: {xs: 'flex', md: 'none'}
                            }}
                        >
                            <div
                                style={{ 
                                    fontSize: '20px',
                                }}
                            >
                                {item.emoji}
                            </div>
                        </Tooltip>
                        <Typography
                            sx={{
                                display: {xs: 'none', md: 'flex'},
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#666',
                                ml: '10px',
                                transition: 'color 0.3s ease'
                            }}
                        >
                            {item.title}
                        </Typography>
                    </ListItemButton>
                ) : null
            })}
        </>
    )
}

const SidebarCategories = () => {
    return (
        Object.keys(itemDict).map((title, titleIndex) => (
            <div
                key={titleIndex}
            >
                <Typography
                    component='div'
                    sx={{
                        display: {xs: 'none', md: 'flex'},
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#64748b',
                        mt: '25px', 
                        mx: '20px',
                        mb: '10px', 
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        position: 'relative',
                    }}
                >
                    {title}
                </Typography>
                <SidebarItems
                    itemList = {itemDict[title]}
                    titleIndex = {titleIndex}
                />
            </div>
        )) 
    ) 
}

const Sidebar = ({menu, setMenu}) => {
    const theme = useTheme()
    const user = getUser()
    const handleMenu = () => {
        user.isLogin&&setMenu(!menu)
    }
    return (
        <Box
            component='aside'
            sx={{
                flex: 1,
                borderRight: '1px solid #e1e5e9',
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                boxShadow: '2px 0 10px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Top */}
            <Box>
                <AppBar position='static' sx={{ background: 'white' }}>
                    <Toolbar>
                        <img
                            src='/smartwork.webp'  
                            alt='SmartWork Logo'
                            style={{ height: 50 }}
                            onClick={handleMenu}       
                        />
                        <Typography
                            component='span'
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                justifyContent: 'center',
                                fontSize: '15px',
                                fontWeight: 700,
                                color: '#333',
                                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                letterSpacing: '0.5px',
                                ml: 1 
                            }}
                        >
                            SmartWork
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>

            {/* Middle */}
            <Box
                sx={{
                    padding: '20px 0',
                    overflowY: 'auto',
                    maxHeight: 'calc(100vh - 140px)',
                    flexGrow: 1,
                    [theme.breakpoints.down('sm')]: {
                        padding: '10px 5px',
                    },
                }}
            >
                <List disablePadding>
                    <SidebarCategories/>
                </List>
            </Box>
            {/* Bottom */}
            <Box
                sx={{
                    display: {xs: 'none', md: 'flex'},
                    margin: '20px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px 10px',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e1e5e9',
                }}
            >
                <Typography
                    variant='caption'
                    sx={{
                        fontSize: '12px',
                        '@media screen and (max-height: 800px), screen and (max-width: 600px)': {
                            display: 'none',
                        },
                    }}
                >
                    Copyright © {(new Date().getFullYear())} SmartWork.
                </Typography>
            </Box>
        </Box>
    )
}

export default Sidebar