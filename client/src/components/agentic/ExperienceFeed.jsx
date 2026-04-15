import React from 'react'
import { Box, Typography, Paper, Stack, Button, Fade } from '@mui/material'
import { UserCircle, Bot, History, Lightbulb, ShieldCheck, Zap, AlertTriangle, XCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useTranslation } from 'react-i18next'

const ExperienceFeed = ({ activities, expandedInsights, toggleInsight, handleConfirmAction }) => {
    const { t, i18n } = useTranslation()

    return (
        <Box sx={{ pb: 10 }}>
            <Typography variant="subtitle2" fontWeight="600" mb={1.5} sx={{ opacity: 0.6, letterSpacing: '0.5px' }}>
                {i18n.language === 'en' ? 'EXPERIENCE FEED' : '실시간 에이전트 활동 피드'}
            </Typography>
            <Stack spacing={2}>
                {activities.map((item, idx) => (
                    <Fade in={true} key={idx} timeout={500 + (idx * 200)}>
                        <Paper variant="outlined" sx={{ 
                            p: 1.5, borderRadius: 4, border: '1px solid var(--border-color)', bgcolor: 'var(--bg-secondary)',
                            transition: 'all 0.3s', '&:hover': { bgcolor: 'var(--card-bg)', borderColor: '#3b82f640' }
                        }}>
                            <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
                                <Box sx={{ p: 0.8, bgcolor: 'var(--bg-primary)', borderRadius: 2, color: item.type === 'user' ? '#f59e0b' : '#3b82f6' }}>
                                    <item.icon size={18} />
                                </Box>
                                <Box flex={1} sx={{ 
                                    '& p': { m: 0 }
                                }}>
                                    {item.type === 'assistant' ? (
                                        <div className="markdown-content">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {String(item.text || '')}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <Typography variant="body2" color="var(--text-primary)" fontWeight={600} sx={{ lineHeight: 1.4 }}>
                                            {item.text}
                                        </Typography>
                                    )}

                                    {item.trail && item.trail.length > 0 && (
                                        <Stack direction="row" spacing={0.8} sx={{ mt: 1.5, opacity: 0.8, alignItems: "center" }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.3, bgcolor: 'var(--bg-active)', borderRadius: 1.5, border: '1px solid var(--text-active)20' }}>
                                                <History size={12} color="var(--text-active)" />
                                                <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-active)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                                    Execution Trace
                                                </Typography>
                                            </Box>
                                            <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                                                {item.trail.map(t => typeof t === 'object' ? `${t.agent.replace('_Agent', '')} » ${t.task || 'Delegation'}` : t).join(' ➜ ')}
                                            </Typography>
                                        </Stack>
                                    )}

                                    {(item.reasoning || item.observation) && (
                                        <Box sx={{ mt: 1 }}>
                                            <Button 
                                                size="small" variant="text" startIcon={expandedInsights[idx] ? <ShieldCheck size={12} /> : <Lightbulb size={12} />}
                                                onClick={() => toggleInsight(idx)}
                                            >
                                                {expandedInsights[idx] ? '사고 과정 숨기기' : '사고 과정 확인'}
                                            </Button>
                                            <Fade in={expandedInsights[idx]} unmountOnExit>
                                                <Box sx={{ p: 1.2, bgcolor: '#3b82f608', borderRadius: 2, border: '1px dashed #3b82f630' }}>
                                                    <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.5 }}>
                                                        <Lightbulb size={12} color="#3b82f6" />
                                                        <Typography variant="caption" fontWeight="700" color="#3b82f6" sx={{ letterSpacing: '0.5px', fontSize: '0.65rem' }}>
                                                            {i18n.language === 'en' ? 'AI ANALYSIS INSIGHT / REASONING PATH' : '지능형 사고 경로 및 분석 인사이트'}
                                                        </Typography>
                                                    </Stack>
                                                    {item.reasoning && (
                                                        <Box sx={{ 
                                                            opacity: 0.9, fontStyle: 'italic', mb: 1, fontSize: '0.85rem', color: 'var(--text-primary)',
                                                            '& p': { m: 0 },
                                                            '& table': { borderCollapse: 'collapse', width: '100%', my: 1, border: '1px solid var(--border-color)' },
                                                            '& th, & td': { border: '1px solid var(--border-color)', p: 0.5, textAlign: 'left' }
                                                        }}>
                                                            <Typography variant="caption" sx={{ fontWeight: 800, color: 'var(--text-secondary)', display: 'block', mb: 0.5 }}>
                                                                {i18n.language === 'en' ? '[THOUGHT]' : '[AI 추론 프로세스]'}
                                                            </Typography>
                                                            <div className="markdown-content">
                                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                                    {String(item.reasoning || '')}
                                                                </ReactMarkdown>
                                                            </div>
                                                        </Box>
                                                    )}
                                                    {item.observation && (
                                                        <Box sx={{ 
                                                            opacity: 1.0, color: '#3b82f6', fontWeight: 600, fontSize: '0.85rem', mt: 1,
                                                            '& p': { m: 0 }
                                                        }}>
                                                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#3b82f6', display: 'block' }}>
                                                                {i18n.language === 'en' ? '[OBSERVATION]' : '[데이터 분석 관찰]'}
                                                            </Typography>
                                                            <div className="markdown-content">
                                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                                    {String(item.observation || '')}
                                                                </ReactMarkdown>
                                                            </div>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Fade>
                                        </Box>
                                    )}

                                    {item.actionRequired && (
                                        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                                            <Button 
                                                variant="contained" size="small" startIcon={<Zap size={14} />}
                                                onClick={() => handleConfirmAction(item.actionRequired, true)}
                                                sx={{ borderRadius: 2, textTransform: 'none', px: 2, fontSize: '0.75rem', bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
                                            >
                                                승인 및 실행
                                            </Button>
                                            <Button 
                                                variant="outlined" size="small"
                                                onClick={() => handleConfirmAction(item.actionRequired, false)}
                                                sx={{ borderRadius: 2, textTransform: 'none', px: 2, fontSize: '0.75rem', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                                            >
                                                취소
                                            </Button>
                                        </Stack>
                                    )}

                                    <Typography variant="caption" color="var(--text-secondary)" sx={{ mt: 0.5, display: 'block', fontWeight: 600, opacity: 0.7 }}>
                                        {item.user} • {item.time}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </Fade>
                ))}
            </Stack>
        </Box>
    )
}

export default ExperienceFeed
