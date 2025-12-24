import { useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import {
    Box, TextField, Button, MenuItem, Select, FormControl, InputLabel,
    Typography, FormControlLabel, Switch, Stack, Paper, Chip, IconButton
} from '@mui/material'
import { Save, X, ArrowLeft, Upload, CloudUpload } from 'lucide-react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

import Navbar from '../../components/bar/Navbar'
import Sidebar from '../../components/bar/Sidebar'
import { BOARD_TYPES } from '../../configs/board'

const BoardWritePage = ({ menu, setMenu }) => {
    const navigate = useNavigate()
    const currentUser = useSelector(state => state.user)

    const quillRef = useRef(null)

    const [boardType, setBoardType] = useState('FREE')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('') // HTML string
    const [isPinned, setIsPinned] = useState(false)
    const [files, setFiles] = useState([]) // File objects
    const [loading, setLoading] = useState(false)

    // 관리자 또는 HR인지 확인
    const canPin = currentUser.isAdmin || currentUser.department === 'HR'

    const imageHandler = () => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/png, image/jpeg, image/webp')
        input.click()

        input.onchange = async () => {
            const file = input.files[0]
            if (!file) return

            // MIME check
            const allowedTypes = ['image/png', 'image/jpeg', 'image/webp']
            if (!allowedTypes.includes(file.type)) {
                alert('지원되지 않는 이미지 형식입니다. (png, jpeg, webp만 가능)')
                return
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('이미지 크기는 5MB 이하여야 합니다.')
                return
            }

            const formData = new FormData()
            formData.append('file', file)

            try {
                // 기존 이미지 업로드 API 사용
                const res = await axios.post('/api/upload/image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })

                // 에디터에 이미지 삽입
                const range = quillRef.current.getEditor().getSelection()
                const url = res.data.url // Response: { filename, url }
                quillRef.current.getEditor().insertEmbed(range.index, 'image', url)
            } catch (err) {
                console.error(err)
                alert('이미지 업로드에 실패했습니다.')
            }
        }
    }

    const modules = useMemo(() => {
        return {
            toolbar: {
                container: [
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['code-block'],
                    ['link', 'image']
                ],
                handlers: {
                    image: imageHandler
                }
            }
        }
    }, [])

    const handleFileChange = (e) => {
        setFiles([...files, ...Array.from(e.target.files)])
    }

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index))
    }

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 입력해주세요.')
            return
        }

        setLoading(true)
        try {
            // 1. 파일 업로드
            const uploadedFiles = []
            if (files.length > 0) {
                for (const file of files) {
                    const formData = new FormData()
                    formData.append('file', file)
                    const res = await axios.post('/api/upload/file', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    })
                    uploadedFiles.push({
                        filename: res.data.filename,
                        path: res.data.path,
                        size: res.data.size,
                    })
                }
            }

            // 2. 게시글 저장 (기존 API 유지)
            await axios.post('/api/board', {
                boardType,
                title,
                content, // HTML string
                isPinned,
                files: uploadedFiles
            })

            alert('게시글이 등록되었습니다.')
            navigate('/board')
        } catch (err) {
            console.error(err)
            alert('게시글 등록에 실패했습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='container'>
            {menu && <Sidebar menu={menu} setMenu={setMenu} />}
            <div className='wrapper'>
                <Navbar menu={menu} setMenu={setMenu} />
                <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', maxWidth: 1400, mx: 'auto', boxSizing: 'border-box' }}>

                    {/* Header */}
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                        <IconButton onClick={() => navigate('/board')}>
                            <ArrowLeft size={24} color="#64748b" />
                        </IconButton>
                        <Typography variant="h5" fontWeight="700" color="#1e293b">
                            게시글 작성
                        </Typography>
                    </Stack>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                        }}
                    >
                        <Stack spacing={3}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <FormControl sx={{ minWidth: 150 }}>
                                    <InputLabel>게시판 분류</InputLabel>
                                    <Select
                                        value={boardType}
                                        label="게시판 분류"
                                        onChange={(e) => setBoardType(e.target.value)}
                                        sx={{ bgcolor: '#f8fafc' }}
                                    >
                                        {BOARD_TYPES.map(type => (
                                            <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    label="제목을 입력하세요"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    sx={{ bgcolor: '#f8fafc' }}
                                />
                            </Stack>

                            {canPin && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <FormControlLabel
                                        control={<Switch checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} />}
                                        label={<Typography variant="body2" fontWeight={500} color="#475569">공지사항으로 고정</Typography>}
                                    />
                                </Box>
                            )}

                            <Box sx={{
                                '& .quill': { bgcolor: 'white' },
                                '& .ql-toolbar': { borderTopLeftRadius: '8px', borderTopRightRadius: '8px', borderColor: '#e2e8f0', bgcolor: '#f8fafc' },
                                '& .ql-container': { borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', borderColor: '#e2e8f0', minHeight: '400px' },
                                '& .ql-editor': { fontSize: '1rem', minHeight: '400px' }
                            }}>
                                <ReactQuill
                                    ref={quillRef}
                                    theme="snow"
                                    value={content}
                                    onChange={setContent}
                                    modules={modules}
                                    placeholder="내용을 자유롭게 작성해주세요."
                                />
                            </Box>

                            <Box sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#f8fafc' }}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" fontWeight="600" color="#475569" display="flex" alignItems="center" gap={1}>
                                        <Upload size={18} /> 파일 첨부
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        startIcon={<CloudUpload size={16} />}
                                        size="small"
                                        sx={{ textTransform: 'none', bgcolor: 'white' }}
                                    >
                                        파일 선택
                                        <input type="file" multiple hidden onChange={handleFileChange} />
                                    </Button>
                                </Stack>

                                {files.length > 0 ? (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {files.map((file, i) => (
                                            <Chip
                                                key={i}
                                                label={`${file.name} (${Math.round(file.size / 1024)}KB)`}
                                                onDelete={() => removeFile(i)}
                                                variant="outlined"
                                                sx={{ bgcolor: 'white' }}
                                            />
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography variant="body2" color="#94a3b8" align="center" py={2}>
                                        첨부할 파일을 선택해주세요.
                                    </Typography>
                                )}
                            </Box>

                            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 2, borderTop: '1px solid #f1f5f9' }}>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    startIcon={<X size={18} />}
                                    onClick={() => navigate('/board')}
                                    sx={{ borderRadius: 2, textTransform: 'none', color: '#64748b' }}
                                >
                                    취소
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<Save size={18} />}
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        bgcolor: '#3b82f6',
                                        fontWeight: 600,
                                        px: 3,
                                        boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)',
                                        '&:hover': { bgcolor: '#2563eb' }
                                    }}
                                >
                                    {loading ? '등록 중...' : '게시글 등록'}
                                </Button>
                            </Stack>
                        </Stack>
                    </Paper>
                </Box>
            </div>
        </div>
    )
}

export default BoardWritePage
