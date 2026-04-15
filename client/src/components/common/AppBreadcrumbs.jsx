import React from 'react'
import { Breadcrumbs, Link, Typography, Box } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/**
 * Premium Breadcrumbs component
 * @param {Array} items - Array of { label, path } objects. Last item should not have a path.
 */
const AppBreadcrumbs = ({ items = [] }) => {
    const { t } = useTranslation()

    return (
        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
            <Breadcrumbs
                separator={<ChevronRight size={14} style={{ opacity: 0.5 }} />}
                aria-label="breadcrumb"
                sx={{
                    '& .MuiBreadcrumbs-ol': {
                        alignItems: 'center',
                    },
                }}
            >
                <Link
                    component={RouterLink}
                    to="/"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                        '&:hover': { color: 'var(--text-active)' },
                    }}
                >
                    <Home size={16} />
                </Link>

                {items.map((item, index) => {
                    const isLast = index === items.length - 1
                    
                    return isLast ? (
                        <Typography
                            key={index}
                            variant="caption"
                            sx={{
                                color: 'var(--text-primary)',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                            }}
                        >
                            {t(item.label, item.label)}
                        </Typography>
                    ) : (
                        <Link
                            key={index}
                            component={RouterLink}
                            to={item.path}
                            sx={{
                                color: 'var(--text-secondary)',
                                textDecoration: 'none',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                transition: 'color 0.2s',
                                '&:hover': { color: 'var(--text-active)' },
                            }}
                        >
                            {t(item.label, item.label)}
                        </Link>
                    )
                })}
            </Breadcrumbs>
        </Box>
    )
}

export default AppBreadcrumbs
