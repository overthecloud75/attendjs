import React from 'react'
import { Box, List, ListItemButton, ListItemText, Typography, Divider, Paper, ListItemIcon } from '@mui/material'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Settings, Bot, MapPin, ShieldCheck, Bell, ChevronRight, Layout } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const SettingsLayout = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useTranslation()

    const menuItems = [
        { title: t('settings-general', 'General'), path: '/admin/settings/general', icon: Settings, color: '#3b82f6' },
        { title: t('settings-ai', 'AI Settings'), path: '/admin/settings/ai', icon: Bot, color: '#8b5cf6' },
        { title: t('settings-location', 'Location'), path: '/admin/settings/location', icon: MapPin, color: '#10b981' },
        { title: t('settings-security', 'Security'), path: '/admin/settings/security', icon: ShieldCheck, color: '#ef4444' },
        { title: t('settings-notifications', 'Notification'), path: '/admin/settings/notifications', icon: Bell, color: '#f59e0b' }
    ]

    return (
        <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden', bgcolor: 'var(--bg-primary)' }}>
            {/* Enhanced Settings Sidebar */}
            <Paper
                elevation={0}
                sx={{
                    width: 280,
                    borderRight: '1px solid var(--border-color)',
                    bgcolor: 'var(--bg-secondary)',
                    overflowY: 'auto',
                    flexShrink: 0,
                    borderRadius: 0,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Sidebar Header */}
                <Box sx={{ p: 3, pt: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                        <Box sx={{ p: 0.8, bgcolor: 'var(--bg-active)', borderRadius: 2, color: 'var(--text-active)' }}>
                            <Layout size={20} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                            Admin Center
                        </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'block', ml: 0.5 }}>
                        SYSTEM CONFIGURATIONS
                    </Typography>
                </Box>

                <Divider sx={{ mx: 2, opacity: 0.6 }} />

                {/* Menu List */}
                <List component="nav" sx={{ p: 2, pt: 3 }}>
                    {menuItems.map((item) => {
                        const active = location.pathname === item.path
                        const Icon = item.icon
                        return (
                            <ListItemButton
                                key={item.path}
                                selected={active}
                                onClick={() => navigate(item.path)}
                                sx={{
                                    borderRadius: 3,
                                    mb: 1.5,
                                    py: 1.5,
                                    px: 2,
                                    position: 'relative',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&.Mui-selected': {
                                        bgcolor: `${item.color}10`,
                                        color: item.color,
                                        '&:hover': { bgcolor: `${item.color}15` },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            left: 0,
                                            top: '20%',
                                            height: '60%',
                                            width: 4,
                                            bgcolor: item.color,
                                            borderRadius: '0 4px 4px 0'
                                        }
                                    },
                                    '&:hover': {
                                        bgcolor: 'var(--hover-bg)',
                                        transform: 'translateX(4px)'
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40, color: active ? item.color : 'var(--text-secondary)' }}>
                                    <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.title}
                                    slotProps={{
                                        primary: {
                                            fontSize: '0.925rem',
                                            fontWeight: active ? 700 : 500,
                                            color: active ? item.color : 'var(--text-primary)'
                                        }
                                    }}
                                />
                                {active && <ChevronRight size={16} color={item.color} />}
                            </ListItemButton>
                        )
                    })}
                </List>

            </Paper>

            {/* Content Area */}
            <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: 'var(--bg-primary)', position: 'relative' }}>
                <Outlet />
            </Box>
        </Box>
    )
}

export default SettingsLayout
