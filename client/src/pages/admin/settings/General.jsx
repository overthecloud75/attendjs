import React, { useState, useEffect } from 'react'
import { Box, Typography, Divider, TextField, Button, Chip, Stack, Paper, Alert, Snackbar } from '@mui/material'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

const GeneralSettings = () => {
    const { t } = useTranslation()
    const [jobTitles, setJobTitles] = useState([])
    const [ranks, setRanks] = useState([])
    const [newJobTitle, setNewJobTitle] = useState('')
    const [newRank, setNewRank] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '', open: false })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await axios.get('/api/settings/general')
            if (res.data) {
                setJobTitles(res.data.jobTitles || [])
                setRanks(res.data.ranks || [])
            }
        } catch (err) {
            console.error(err)
            setMessage({ type: 'error', text: t('msg-fetch-error'), open: true })
        }
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            await axios.put('/api/settings/general', {
                jobTitles,
                ranks
            })
            setMessage({ type: 'success', text: t('msg-save-success'), open: true })
        } catch (err) {
            console.error(err)
            setMessage({ type: 'error', text: t('msg-save-error'), open: true })
        } finally {
            setLoading(false)
        }
    }

    const handleAddJobTitle = () => {
        if (newJobTitle.trim() && !jobTitles.includes(newJobTitle.trim())) {
            setJobTitles([...jobTitles, newJobTitle.trim()])
            setNewJobTitle('')
        }
    }

    const handleDeleteJobTitle = (titleToDelete) => {
        setJobTitles(jobTitles.filter(title => title !== titleToDelete))
    }

    const handleAddRank = () => {
        if (newRank.trim() && !ranks.includes(newRank.trim())) {
            setRanks([...ranks, newRank.trim()])
            setNewRank('')
        }
    }

    const handleDeleteRank = (rankToDelete) => {
        setRanks(ranks.filter(rank => rank !== rankToDelete))
    }

    const handleCloseMessage = () => {
        setMessage({ ...message, open: false })
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ color: 'var(--text-primary)' }}>
                {t('settings-general')}
            </Typography>
            <Divider sx={{ mb: 4 }} />

            <Stack spacing={4}>
                {/* Job Titles Section */}
                <Paper sx={{ p: 3, bgcolor: 'var(--bg-secondary)' }} elevation={0}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)' }}>
                        {t('general-job-titles')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                        {t('general-job-titles-desc')}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <TextField
                            size="small"
                            placeholder={t('general-placeholder-job')}
                            value={newJobTitle}
                            onChange={(e) => setNewJobTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddJobTitle()}
                            sx={{ bgcolor: 'var(--bg-primary)' }}
                        />
                        <Button variant="contained" onClick={handleAddJobTitle}>
                            {t('button-add')}
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {jobTitles.map((title) => (
                            <Chip
                                key={title}
                                label={title}
                                onDelete={() => handleDeleteJobTitle(title)}
                                sx={{ bgcolor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                            />
                        ))}
                    </Box>
                </Paper>

                {/* Ranks Section */}
                <Paper sx={{ p: 3, bgcolor: 'var(--bg-secondary)' }} elevation={0}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'var(--text-primary)' }}>
                        {t('general-ranks')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                        {t('general-ranks-desc')}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <TextField
                            size="small"
                            placeholder={t('general-placeholder-rank')}
                            value={newRank}
                            onChange={(e) => setNewRank(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddRank()}
                            sx={{ bgcolor: 'var(--bg-primary)' }}
                        />
                        <Button variant="contained" onClick={handleAddRank}>
                            {t('button-add')}
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {ranks.map((rank) => (
                            <Chip
                                key={rank}
                                label={rank}
                                onDelete={() => handleDeleteRank(rank)}
                                sx={{ bgcolor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                            />
                        ))}
                    </Box>
                </Paper>

                <Box>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? t('button-saving') : t('button-save')}
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

export default GeneralSettings
