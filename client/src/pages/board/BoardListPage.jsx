import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box, Tab, Tabs, Typography, Paper, Chip
} from '@mui/material'
import { FileText, Megaphone } from 'lucide-react'
import CustomTableWithSearch from '../../components/tables/CustomTableWithSearch'
import { columnHeaders, csvHeaders, BOARD_TYPES } from '../../configs/board'

const BoardListPage = () => {
    const navigate = useNavigate()
    const [currentTab, setCurrentTab] = useState('ALL')

    // Extend columnHeaders with custom rendering for the Board list
    const enhancedColumns = useMemo(() => {
        return columnHeaders.map(col => {
            if (col.accessorKey === 'boardType') {
                return {
                    ...col,
                    header: '구분',
                    size: 80,
                    cell: (info) => {
                        const type = BOARD_TYPES.find(t => t.value === info.getValue())
                        return (
                            <Chip
                                label={type?.label || info.getValue()}
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
    }, [])

    const handleRowClick = (row) => {
        navigate(`/board/${row._id}`)
    }

    // Dynamic API URL based on tab
    const apiUrl = currentTab === 'ALL' ? '/api/board' : `/api/board?boardType=${currentTab}`

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, height: 'calc(100vh - 64px)', overflow: 'auto' }}>
            {/* Header 섹션 */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight="900" color="var(--text-primary)" letterSpacing="-1px">
                    사내 게시판 📋
                </Typography>
                <Typography variant="body2" color="var(--text-secondary)" sx={{ mt: 0.5 }}>
                    공지사항 및 자유로운 소통 공간입니다.
                </Typography>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    borderRadius: 4,
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
                        <Tab label="전체보기" value="ALL" />
                        {BOARD_TYPES.map(type => (
                            <Tab key={type.value} label={type.label} value={type.value} />
                        ))}
                    </Tabs>
                </Box>

                {/* 공통 테이블 적용 */}
                <Box sx={{ p: 1 }}>
                    <CustomTableWithSearch
                        page="board"
                        url={apiUrl}
                        searchKeyword="search"
                        columnHeaders={enhancedColumns}
                        csvHeaders={csvHeaders}
                        onIdClick={handleRowClick}
                    />
                </Box>
            </Paper>
        </Box>
    )
}

export default BoardListPage
