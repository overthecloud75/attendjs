import React from 'react'
import { Box, List, ListItemButton, ListItemText, Typography, Divider, Paper } from '@mui/material'
import { Outlet, useNavigate, useLocation, useOutletContext } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import MainLayout from '../../components/layout/MainLayout'

const SettingsLayout = ({ menu, setMenu }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useTranslation()

    const menuItems = [
        { title: t('settings-location', 'Location'), path: '/admin/settings/location', emoji: '📍' },
        { title: t('settings-general', 'General'), path: '/admin/settings/general', emoji: '⚙️' },
        { title: t('settings-security', 'Security'), path: '/admin/settings/security', emoji: '🔒' },
        { title: t('settings-notifications', 'Notification'), path: '/admin/settings/notifications', emoji: '🔔' }
    ]

    return (
        <MainLayout menu={menu} setMenu={setMenu}>
            {/* Settings Split Layout */}
            <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
                <Paper
                    elevation={0}
                    sx={{
                        width: 250,
                        borderRight: '1px solid var(--border-color)',
                        bgcolor: 'var(--bg-secondary)',
                        overflowY: 'auto',
                        flexShrink: 0,
                        borderRadius: 0
                    }}
                >
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                            {t('sidebar-settings', 'Settings')}
                        </Typography>
                    </Box>
                    <Divider />
                    <List component="nav" sx={{ p: 1 }}>
                        {menuItems.map((item) => {
                            const active = location.pathname === item.path
                            return (
                                <ListItemButton
                                    key={item.path}
                                    selected={active}
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        borderRadius: 1,
                                        mb: 0.5,
                                        '&.Mui-selected': {
                                            bgcolor: 'var(--bg-active)',
                                            color: 'var(--text-active)',
                                            '&:hover': {
                                                bgcolor: 'var(--bg-active)',
                                            }
                                        },
                                        '&:hover': {
                                            bgcolor: 'var(--hover-bg)'
                                        }
                                    }}
                                >
                                    <Box component="span" sx={{ mr: 1.5 }}>{item.emoji}</Box>
                                    <ListItemText
                                        primary={item.title}
                                        primaryTypographyProps={{
                                            fontSize: '0.9rem',
                                            fontWeight: active ? 600 : 400
                                        }}
                                    />
                                </ListItemButton>
                            )
                        })}
                    </List>
                </Paper>

                {/* Content Area */}
                <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: 'var(--bg-primary)' }}>
                    <Outlet context={{ menu, setMenu }} />
                </Box>
            </Box>
        </MainLayout>
    )
}

export default SettingsLayout
