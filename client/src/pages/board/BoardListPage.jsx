import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import {
    Box, Tab, Tabs, TextField, Button, MenuItem, Select, FormControl, InputLabel,
    Typography, Pagination, Chip, Stack, Paper, IconButton, InputAdornment
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Search, PenLine, FileText, Filter } from 'lucide-react'

import Navbar from '../../components/bar/Navbar'
import Sidebar from '../../components/bar/Sidebar'
import { BOARD_TYPES } from '../../configs/board'

const BoardListPage = ({ menu, setMenu }) => {
    const navigate = useNavigate()
    // eslint-disable-next-line
    const currentUser = useSelector(state => state.user)

    const [currentTab, setCurrentTab] = useState('ALL')
    const [posts, setPosts] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const [page, setPage] = useState(1)
    const [searchType, setSearchType] = useState('title')
    const [searchKeyword, setSearchKeyword] = useState('')
    const [loading, setLoading] = useState(false)

    // 컬럼 정의
    const columns = [
        {
            field: 'boardType',
            headerName: '유형',
            width: 100,
            valueGetter: (value, row) => {
                if (!value && row) value = row.boardType
                return BOARD_TYPES.find(t => t.value === value)?.label || value
            },
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    size="small"
                    sx={{
                        bgcolor: '#f1f5f9',
                        color: '#475569',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                    }}
                />
            )
        },
        {
            field: 'title',
            headerName: '제목',
            flex: 1,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        cursor: 'pointer',
                        width: '100%',
                        height: '100%',
                        color: '#1e293b',
                        '&:hover': { color: '#3b82f6' }
                    }}
                    onClick={() => navigate(`/board/${params.row._id}`)}
                >
                    {params.row.isPinned && (
                        <Chip
                            label="공지"
                            size="small"
                            sx={{
                                bgcolor: '#fee2e2',
                                color: '#ef4444',
                                fontWeight: 700,
                                height: 20
                            }}
                        />
                    )}
                    <Typography variant="body2" fontWeight={500} noWrap>{params.row.title}</Typography>
                    {params.row.files?.length > 0 && (
                        <Box sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
                            <FileText size={14} />
                        </Box>
                    )}
                </Box>
            )
        },
        { field: 'authorName', headerName: '작성자', width: 120, align: 'center', headerAlign: 'center' },
        { field: 'viewCount', headerName: '조회수', width: 80, type: 'number', align: 'center', headerAlign: 'center' },
        {
            field: 'createdAt',
            headerName: '작성일',
            width: 120,
            align: 'center',
            headerAlign: 'center',
            valueFormatter: (value) => value ? value.substring(0, 10) : ''
        }
    ]

    const fetchPosts = async () => {
        setLoading(true)
        try {
            const params = {
                page,
                limit: 10,
                search: searchKeyword,
                searchType
            }
            if (currentTab !== 'ALL') params.boardType = currentTab

            const res = await axios.get('/api/board', { params })
            setPosts(res.data.posts)
            setTotalCount(res.data.totalCount)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [page, currentTab])

    const handleSearch = () => {
        setPage(1)
        fetchPosts()
    }

    return (
        <div className='container'>
            {menu && <Sidebar menu={menu} setMenu={setMenu} />}
            <div className='wrapper'>
                <Navbar menu={menu} setMenu={setMenu} />
                <Box sx={{ p: { xs: 2, md: 2 }, height: 'calc(100vh - 80px)', overflow: 'auto' }}>

                    {/* Header */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h4" fontWeight="700" color="#1e293b" gutterBottom>
                            사내 게시판 📋
                        </Typography>
                        <Typography variant="body1" color="#64748b">
                            공지사항 및 자유로운 소통 공간입니다.
                        </Typography>
                    </Box>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                        }}
                    >
                        {/* Tabs */}
                        <Tabs
                            value={currentTab}
                            onChange={(e, v) => { setCurrentTab(v); setPage(1); }}
                            sx={{
                                mb: 3,
                                borderBottom: 1,
                                borderColor: 'divider',
                                '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '1rem' }
                            }}
                        >
                            <Tab label="전체" value="ALL" />
                            {BOARD_TYPES.map(type => (
                                <Tab key={type.value} label={type.label} value={type.value} />
                            ))}
                        </Tabs>

                        {/* Search & Actions */}
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', gap: 2, flex: 1, width: { xs: '100%', md: 'auto' } }}>
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <InputLabel>검색조건</InputLabel>
                                    <Select
                                        label="검색조건"
                                        value={searchType}
                                        onChange={(e) => setSearchType(e.target.value)}
                                        sx={{ bgcolor: '#f8fafc' }}
                                    >
                                        <MenuItem value="title">제목</MenuItem>
                                        <MenuItem value="content">내용</MenuItem>
                                        <MenuItem value="author">작성자</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="검색어를 입력하세요"
                                    variant="outlined"
                                    size="small"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    fullWidth
                                    sx={{ bgcolor: '#f8fafc' }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleSearch} edge="end">
                                                    <Search size={18} />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Box>

                            <Button
                                variant="contained"
                                startIcon={<PenLine size={18} />}
                                onClick={() => navigate('/board/write')}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    bgcolor: '#3b82f6',
                                    borderRadius: 2,
                                    py: 1,
                                    px: 3,
                                    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)',
                                    '&:hover': { bgcolor: '#2563eb' }
                                }}
                            >
                                글쓰기
                            </Button>
                        </Stack>

                        {/* DataGrid */}
                        <div style={{ width: '100%', minHeight: 500 }}>
                            <DataGrid
                                rows={posts}
                                columns={columns}
                                getRowId={(row) => row._id}
                                loading={loading}
                                paginationMode="server"
                                rowCount={totalCount}
                                hideFooterPagination
                                hideFooter
                                disableSelectionOnClick
                                sx={{
                                    border: 'none',
                                    '& .MuiDataGrid-columnHeaders': {
                                        bgcolor: '#f8fafc',
                                        color: '#475569',
                                        fontWeight: 700,
                                        fontSize: '0.875rem'
                                    },
                                    '& .MuiDataGrid-cell': {
                                        borderBottom: '1px solid #f1f5f9',
                                        color: '#334155',
                                        fontSize: '0.875rem'
                                    },
                                    '& .MuiDataGrid-row:hover': {
                                        cursor: 'pointer',
                                        bgcolor: '#f8fafc'
                                    },
                                    '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
                                        outline: 'none'
                                    }
                                }}
                                onRowClick={(params) => navigate(`/board/${params.row._id}`)}
                            />
                        </div>

                        {/* Pagination */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={Math.ceil(totalCount / 10)}
                                page={page}
                                onChange={(e, v) => setPage(v)}
                                color="primary"
                                size="large"
                                shape="rounded"
                            />
                        </Box>
                    </Paper>
                </Box>
            </div>
        </div>
    )
}

export default BoardListPage
