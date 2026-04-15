import React, { useState, useEffect } from 'react'
import { Box, Container, Stack, Typography, IconButton, Tooltip } from '@mui/material'
import { PanelRightOpen, Layers, UserCircle, Bot, ShieldCheck, AlertTriangle } from 'lucide-react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

// Components
import AppBreadcrumbs from '../components/common/AppBreadcrumbs'
import AgentStatusCard from '../components/agentic/AgentStatusCard'
import ExperienceFeed from '../components/agentic/ExperienceFeed'
import AgentInput from '../components/agentic/AgentInput'
import AgentSidebar from '../components/agentic/AgentSidebar'

// Utils
import { formatDateTime } from '../utils/DateUtil'

const AgenticCanvas = () => {
    const { i18n } = useTranslation()
    const [command, setCommand] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [statusMsg, setStatusMsg] = useState('')
    const [showRightPanel, setShowRightPanel] = useState(window.innerWidth > 900)
    const [expandedInsights, setExpandedInsights] = useState({})
    const [history, setHistory] = useState([])
    const [activities, setActivities] = useState([])

    const fetchHistory = async () => {
        try {
            const { data } = await axios.get('/api/agent/history')
            const historyData = data.history || []
            setHistory(historyData)
            
            if (historyData.length > 0 && activities.length === 0) {
                const recentActivities = historyData.slice(0, 3).flatMap(h => [
                    { 
                        user: 'You', text: h.command, time: formatDateTime(h.createdAt), icon: UserCircle, type: 'user' 
                    },
                    { 
                        user: 'Assistant', text: h.finalResponse, 
                        trail: h.agentTrail, observation: h.observation, reasoning: h.reasoning,
                        time: formatDateTime(h.createdAt), icon: Bot, type: 'assistant' 
                    }
                ])
                setActivities(prev => [...recentActivities, ...prev])
            }
        } catch (err) {
            console.error('Failed to fetch agent history:', err)
        }
    }

    useEffect(() => {
        fetchHistory()
    }, [])

    const handleDeleteHistory = async (e, id) => {
        e.stopPropagation()
        try {
            const csrfToken = axios.defaults.headers.common['X-CSRF-Token'] || axios.defaults.headers.post?.['X-CSRF-Token'] || '';
            await axios.delete(`/api/agent/history/${id}`, {
                headers: { 'X-CSRF-Token': csrfToken }
            })
            setHistory(prev => prev.filter(h => h._id !== id))
        } catch (err) {
            console.error('Failed to delete history:', err)
        }
    }

    const SUGGESTIONS = [
        { label: '남은 연차 확인', cmd: '남은 연차 확인해줘' },
        { label: '내일 연차 신청', cmd: '내일 연차 신청할게' },
        { label: '지난달 근무 분석', cmd: '지난달 근무 시간 분석해줘' },
        { label: '출퇴근 기록 확인', cmd: '최근 일주일 출퇴근 기록 보여줘' },
        { label: '휴가 정책 문의', cmd: '연차 신청 정책 알려줘' }
    ]

    const handleSendCommand = async (overrideCmd = null) => {
        const userCommand = overrideCmd || command
        if (!userCommand.trim() || isLoading) return
        
        const timestamp = formatDateTime(new Date())
        setActivities(prev => [{ user: 'You', text: userCommand, time: timestamp, icon: UserCircle, type: 'user' }, ...prev])
        setCommand('')
        
        setIsLoading(true)
        const isEnglish = /[a-zA-Z]/.test(userCommand) && !/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(userCommand)
        const statusSteps = isEnglish 
            ? ['Analyzing intent...', 'Formulating plan...', 'Delegating...', 'Synthesizing...']
            : ['사용자 의도 분석 중...', '실행 전략 수립 중...', '전문가 유닛 위임 중...', '답변 합성 중...']
        
        let stepIdx = 0
        const pulseInterval = setInterval(() => {
            setStatusMsg(statusSteps[stepIdx % statusSteps.length])
            stepIdx++
        }, 1200)

        try {
            const { data } = await axios.post('/api/agent/command', { command: userCommand }, { timeout: 600000 })
            const result = data.response
            const isAction = result && typeof result === 'object' && result.type === 'ACTION_REQUIRED'
            const displayText = isAction ? result.message : (result?.content || result || 'No response.')

            setActivities(prev => {
                const newActs = [...prev]
                newActs.splice(1, 0, { 
                    user: 'Assistant', text: displayText, trail: result?.trail || [], 
                    observation: result?.observation, reasoning: result?.reasoning,
                    time: formatDateTime(new Date()), icon: isAction ? ShieldCheck : Bot, type: 'assistant',
                    actionRequired: isAction ? result : null
                })
                return newActs
            })
            fetchHistory()
        } catch (error) {
            const msg = error.response?.data?.message || 'Error occurred.'
            setActivities(prev => [{ user: 'System', text: msg, time: formatDateTime(new Date()), icon: AlertTriangle, type: 'system' }, ...prev])
        } finally {
            clearInterval(pulseInterval)
            setIsLoading(false)
            setStatusMsg('')
        }
    }

    const handleConfirmAction = async (action, isConfirmed) => {
        if (!isConfirmed) {
            setActivities(prev => [{ user: 'System', text: '명령이 취소되었습니다.', time: formatDateTime(new Date()), icon: AlertTriangle, type: 'system' }, ...prev])
            return
        }
        setIsLoading(true)
        try {
            const { data } = await axios.post('/api/agent/command', { isConfirmed: true, pendingAction: action })
            setActivities(prev => {
                const newActs = [...prev]
                newActs.splice(1, 0, { user: 'Assistant', text: data.response, time: formatDateTime(new Date()), icon: Bot, type: 'assistant' })
                return newActs
            })
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Box sx={{ display: 'flex', height: '100%', bgcolor: 'var(--bg-primary)', overflow: 'hidden', position: 'relative' }}>
            <Box sx={{ flex: 1, height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <Container maxWidth="xl" sx={{ py: 2, px: { xs: 2, md: 3 }, flex: 1 }}>
                    <AppBreadcrumbs items={[{ label: 'Agentic Canvas' }]} />

                    <Box mb={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                            <Box sx={{ p: 1, bgcolor: '#3b82f615', color: '#3b82f6', borderRadius: 2.5 }}><Layers size={24} /></Box>
                            <Box>
                                <Typography variant="h6" fontWeight="700" sx={{ color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Agentic Canvas</Typography>
                                <Typography variant="caption" color="var(--text-secondary)" sx={{ opacity: 0.7 }}>Intelligent Assistant Orchestration</Typography>
                            </Box>
                        </Stack>
                        {!showRightPanel && (
                            <Tooltip title="사이드 패널 열기">
                                <IconButton onClick={() => setShowRightPanel(true)} sx={{ bgcolor: '#3b82f615', color: '#3b82f6', border: '1px solid #3b82f630' }}>
                                    <PanelRightOpen size={20} />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>

                    <Stack spacing={2}>
                        <AgentInput 
                            command={command} setCommand={setCommand} isLoading={isLoading} 
                            statusMsg={statusMsg} handleSendCommand={handleSendCommand} suggestions={SUGGESTIONS} 
                        />
                        <ExperienceFeed 
                            activities={activities} expandedInsights={expandedInsights} 
                            toggleInsight={(idx) => setExpandedInsights(prev => ({ ...prev, [idx]: !prev[idx] }))}
                            handleConfirmAction={handleConfirmAction}
                        />
                    </Stack>
                </Container>
            </Box>

            <AgentSidebar 
                showRightPanel={showRightPanel} setShowRightPanel={setShowRightPanel}
                history={history} handleDeleteHistory={handleDeleteHistory}
                setActivities={setActivities} setCommand={setCommand}
                formatDateTime={formatDateTime}
            />
        </Box>
    )
}

export default AgenticCanvas
