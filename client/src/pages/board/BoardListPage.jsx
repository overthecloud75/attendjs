import { useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box, Tab, Tabs, Typography, Paper, Chip
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { FileText, Megaphone, PenTool, LayoutDashboard } from 'lucide-react'
import CustomTableWithSearch from '../../components/tables/CustomTableWithSearch'
import EmptyState from '../../components/common/EmptyState'
import PageHeader from '../../components/common/PageHeader'
import CustomTableButtons from '../../components/tables/CustomTableButtons'
import { columnHeaders, csvHeaders, BOARD_TYPES } from '../../configs/board'

const BoardListPage = () => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [currentTab, setCurrentTab] = useState('ALL')
    const tableRef = useRef()

    // ... (enhancedColumns code below) ...
    // Extend columnHeaders with custom rendering for the Board list
    const enhancedColumns = useMemo(() => {
        return columnHeaders.map(col => {
            if (col.accessorKey === 'boardType') {
                return {
                    ...col,
                    header: '구분',
                    size: 80,
                    cell: (info) => {
                        const val = info.getValue()
                        return (
                            <Chip
                                label={t(`board-type-${val}`, val)}
                                size="small"
                                sx={{
                                    bgcolor: 'var(--bg-active)',
                                    color: 'var(--text-active)',
                                    fontWeight: 600,
                                    fontSize: '0.7rem'
                                }}
                            />
                        )
                    }
                }
            }
            if (col.accessorKey === 'title') {
                return {
                    ...col,
                    size: 350,
                    cell: (info) => {
                        const row = info.row.original
                        return (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    color: 'var(--text-primary)',
                                    fontWeight: 500,
                                }}
                            >
                                {row.isPinned && (
                                    <Box sx={{ color: 'var(--danger)', display: 'flex' }}>
                                        <Megaphone size={14} fill="currentColor" />
                                    </Box>
                                )}
                                <Typography variant="body2" sx={{ 
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis', 
                                    whiteSpace: 'nowrap',
                                    fontWeight: row.isPinned ? 700 : 500
                                }}>
                                    {info.getValue()}
                                </Typography>
                                {row.files?.length > 0 && (
                                    <Box sx={{ color: 'var(--text-secondary)', display: 'flex' }}>
                                        <FileText size={14} />
                                    </Box>
                                )}
                            </Box>
                        )
                    }
                }
            }
            if (col.accessorKey === 'createdAt') {
                return {
                    ...col,
                    cell: (info) => info.getValue() || '-'
                }
            }
            return col
        })
    }, [t])

    const handleRowClick = (row) => {
        navigate(`/board/${row._id}`)
    }

    // Dynamic API URL based on tab
    const apiUrl = currentTab === 'ALL' ? '/api/board' : `/api/board?boardType=${currentTab}`

    // Header Actions
    const PageActions = (
        <CustomTableButtons 
            page="board"
            onWriteClick={() => {
                const res = tableRef.current?.handleWriteClick()
                if (res === 'NAVIGATE_BOARD_WRITE') {
                    navigate('/board/write')
                }
            }}
        />
    )

    return (
        <Box sx={{ px: { xs: 2, md: 3 }, py: 2, height: 'calc(100vh - 64px)', overflow: 'auto' }}>
            <PageHeader
                icon={LayoutDashboard}
                title={t('sidebar-board', '사내 게시판')}
                subtitle={t('board-subtitle', '공지사항 및 자유로운 소통 공간입니다.')}
                extra={PageActions}
                breadcrumbs={[
                    { label: t('sidebar-board', '사내 게시판'), path: '/board' },
                    { label: t('board-tab-all', '전체보기') }
                ]}
            />

            <Paper
                elevation={0}
                sx={{
                    mt: 2,
                    borderRadius: 3,
                    border: '1px solid var(--border-color)',
                    bgcolor: 'var(--card-bg)',
                    overflow: 'hidden'
                }}
            >
                {/* 카테고리 탭 */}
                <Box sx={{ borderBottom: '1px solid var(--border-color)', px: 2, pt: 1, bgcolor: 'var(--bg-secondary)' }}>
                    <Tabs
                        value={currentTab}
                        onChange={(e, v) => setCurrentTab(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTab-root': { 
                                minWidth: 100,
                                textTransform: 'none', 
                                fontWeight: 700, 
                                fontSize: '0.9rem', 
                                color: 'var(--text-secondary)' 
                            },
                            '& .Mui-selected': { color: 'var(--text-active) !important' },
                            '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' }
                        }}
                    >
                        <Tab label={t('board-tab-all', '전체보기')} value="ALL" />
                        {BOARD_TYPES.map(type => (
                            <Tab key={type.value} label={t(`board-type-${type.value}`, type.label)} value={type.value} />
                        ))}
                    </Tabs>
                </Box>

                {/* 공통 테이블 적용 */}
                <CustomTableWithSearch
                    ref={tableRef}
                    page="board"
                    url={apiUrl}
                    searchKeyword="search"
                    columnHeaders={enhancedColumns}
                    csvHeaders={csvHeaders}
                    onIdClick={handleRowClick}
                    rowClickable={true}
                    hideButtons={true}
                    renderEmptyState={
                        <EmptyState
                            icon={PenTool}
                            title={t('board-empty-title', '아직 게시글이 없습니다')}
                            description={t('board-empty-desc', '우리 부서의 첫 번째 소식을 남겨보세요!')}
                            actionLabel={t('board-empty-action', '첫 게시글 작성하기')}
                            onAction={() => navigate('/board/write')}
                        />
                    }
                />
            </Paper>
        </Box>
    )
}

export default BoardListPage
