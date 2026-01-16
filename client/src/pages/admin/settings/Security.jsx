import React, { useState, useEffect } from 'react'
import { Box, Typography, Divider, TextField, Button, Switch, FormControlLabel, Stack, Paper, Alert, Snackbar, InputAdornment } from '@mui/material'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

const SecuritySettings = () => {
    const { t } = useTranslation()
    const [settings, setSettings] = useState({
        passwordPolicy: { minLength: 8, requireSpecialChar: true, expiryDays: 90 },
        session: { timeoutMinutes: 60, maxLoginAttempts: 5 },
        ipAccess: { allowedIps: [], blockExternalAccess: false }
    })
    const [accessIpInput, setAccessIpInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '', open: false })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await axios.get('/api/settings/general')
            if (res.data?.security) {
                setSettings(res.data.security)
            }
        } catch (err) {
            console.error(err)
            setMessage({ type: 'error', text: 'Error fetching settings', open: true })
        }
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            await axios.put('/api/settings/general', {
                security: settings
            })
            setMessage({ type: 'success', text: 'Settings saved successfully', open: true })
        } catch (err) {
            console.error(err)
            setMessage({ type: 'error', text: 'Error saving settings', open: true })
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (section, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }))
    }

    const handleAddIp = () => {
        if (accessIpInput && !settings.ipAccess.allowedIps.includes(accessIpInput)) {
            setSettings(prev => ({
                ...prev,
                ipAccess: {
                    ...prev.ipAccess,
                    allowedIps: [...prev.ipAccess.allowedIps, accessIpInput]
                }
            }))
            setAccessIpInput('')
        }
    }

    const handleRemoveIp = (ip) => {
        setSettings(prev => ({
            ...prev,
            ipAccess: {
                ...prev.ipAccess,
                allowedIps: prev.ipAccess.allowedIps.filter(item => item !== ip)
            }
        }))
    }

    const handleCloseMessage = () => {
        setMessage({ ...message, open: false })
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: 'var(--text-primary)' }}>
                {t('settings-security')}
            </Typography>
            <Divider sx={{ mb: 4 }} />

            <Stack spacing={4}>
                {/* Password Policy */}
                <Paper sx={{ p: 3, bgcolor: 'var(--bg-secondary)' }} elevation={0}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)' }}>
                        Password Policy
                    </Typography>
                    <Stack spacing={2} sx={{ maxWidth: 400 }}>
                        <TextField
                            label="Minimum Password Length"
                            type="number"
                            size="small"
                            value={settings.passwordPolicy.minLength}
                            onChange={(e) => handleChange('passwordPolicy', 'minLength', parseInt(e.target.value))}
                            sx={{ bgcolor: 'var(--bg-primary)' }}
                        />
                        <TextField
                            label="Password Expiration (Days)"
                            type="number"
                            size="small"
                            value={settings.passwordPolicy.expiryDays}
                            onChange={(e) => handleChange('passwordPolicy', 'expiryDays', parseInt(e.target.value))}
                            helperText="Set to 0 for no expiration"
                            sx={{ bgcolor: 'var(--bg-primary)' }}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.passwordPolicy.requireSpecialChar}
                                    onChange={(e) => handleChange('passwordPolicy', 'requireSpecialChar', e.target.checked)}
                                />
                            }
                            label="Require Special Character"
                            sx={{ color: 'var(--text-primary)' }}
                        />
                    </Stack>
                </Paper>

                {/* Session Management */}
                <Paper sx={{ p: 3, bgcolor: 'var(--bg-secondary)' }} elevation={0}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)' }}>
                        Session Management
                    </Typography>
                    <Stack spacing={2} sx={{ maxWidth: 400 }}>
                        <TextField
                            label="Session Timeout (Minutes)"
                            type="number"
                            size="small"
                            value={settings.session.timeoutMinutes}
                            onChange={(e) => handleChange('session', 'timeoutMinutes', parseInt(e.target.value))}
                            sx={{ bgcolor: 'var(--bg-primary)' }}
                        />
                        <TextField
                            label="Max Login Attempts"
                            type="number"
                            size="small"
                            value={settings.session.maxLoginAttempts}
                            onChange={(e) => handleChange('session', 'maxLoginAttempts', parseInt(e.target.value))}
                            sx={{ bgcolor: 'var(--bg-primary)' }}
                        />
                    </Stack>
                </Paper>

                {/* NOTE: IP Access implementation in UI but verifyToken.js not fully connected yet */}

                <Box>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Box>
            </Stack>

            <Snackbar
                open={message.open}
                autoHideDuration={6000}
                onClose={handleCloseMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseMessage} severity={message.type} sx={{ width: '100%' }}>
                    {message.text}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default SecuritySettings
