import React from 'react'
import { Box, Paper, Stack, Avatar, TextField, IconButton, CircularProgress, Fade, Chip } from '@mui/material'
import { Bot, Send, Sparkles } from 'lucide-react'

const AgentInput = ({ 
    command, 
    setCommand, 
    isLoading, 
    statusMsg, 
    handleSendCommand, 
    suggestions = [] 
}) => {
    return (
        <Box>
            <Stack direction="row" spacing={1} mb={1.5} sx={{ overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
                {suggestions.map((s, i) => (
                    <Chip 
                        key={i} label={s.label} clickable 
                        onClick={() => handleSendCommand(s.cmd)}
                        icon={<Sparkles size={14} />}
                        sx={{ 
                            borderRadius: '12px', bgcolor: 'var(--card-bg)', border: '1px solid var(--border-color)',
                            fontWeight: 600, fontSize: '0.8rem', px: 1, py: 0.5,
                            color: 'var(--text-primary)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            '&:hover': { bgcolor: 'var(--bg-active)', borderColor: 'var(--text-active)', transform: 'translateY(-1px)' },
                            '& .MuiChip-icon': { color: 'var(--text-active)' }
                        }}
                    />
                ))}
            </Stack>
            
            {isLoading && statusMsg && (
                <Fade in={true}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1, pl: 2 }}>
                        <CircularProgress size={12} sx={{ color: '#3b82f6' }} />
                        <Typography variant="caption" fontWeight="600" color="#3b82f6" sx={{ letterSpacing: '0.5px' }}>
                            {statusMsg}
                        </Typography>
                    </Stack>
                </Fade>
            )}

            <Paper sx={{ 
                p: 1.5, borderRadius: 6, bgcolor: 'var(--card-bg)', border: '2px solid #3b82f6',
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.1)'
            }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                    <Avatar sx={{ bgcolor: '#3b82f6', width: 44, height: 44 }}>
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : <Bot size={24} />}
                    </Avatar>
                    <TextField
                        fullWidth placeholder="명령어를 입력하세요..." variant="standard"
                        value={command} onChange={(e) => setCommand(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendCommand()}
                        disabled={isLoading} slotProps={{ input: { disableUnderline: true } }}
                        sx={{ '& input': { fontSize: '1rem', fontWeight: 500 } }}
                    />
                    <IconButton 
                        onClick={() => handleSendCommand()} disabled={isLoading || !command.trim()}
                        sx={{ 
                            width: 44, height: 44, 
                            bgcolor: '#3b82f6', 
                            color: '#ffffff !important',
                            '&:hover': { bgcolor: '#2563eb', transform: 'scale(1.05)' },
                            '&.Mui-disabled': { bgcolor: 'var(--hover-bg)', color: 'var(--text-secondary)' },
                            transition: 'all 0.2s'
                        }}
                    >
                        <Send size={22} />
                    </IconButton>
                </Stack>
            </Paper>
        </Box>
    )
}

// Separate typography to avoid missing imports in the main block
import { Typography } from '@mui/material'

export default AgentInput
