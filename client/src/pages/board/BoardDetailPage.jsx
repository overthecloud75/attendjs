import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../hooks/useAuth'
import {
    Box, Typography, Paper, Button, TextField, IconButton, Chip, Stack, Avatar
} from '@mui/material'
import {
    User, Calendar, Eye, ArrowLeft, Trash2, Download, MessageSquare, CornerDownRight, FileText
} from 'lucide-react'
import DOMPurify from 'dompurify' // HTML XSS 방지용

// 링크 보안 설정 (Hook)
DOMPurify.addHook('afterSanitizeAttributes', function (node) {
    if (node.tagName === 'A') {
        node.setAttribute('target', '_blank')
        node.setAttribute('rel', 'noopener noreferrer')
    }
})

const BoardDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user: currentUser } = useAuth()

    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [commentContent, setCommentContent] = useState('')
    const [replyTarget, setReplyTarget] = useState(null) // 대댓글 작성 시 부모 ID

    const fetchPost = async () => {
        try {
            const res = await axios.get(`/api/board/${id}`)
            setPost(res.data.post)
            setComments(res.data.comments)
        } catch (err) {
            console.error(err)
            alert('게시글을 불러오지 못했습니다.')
            navigate('/board')
        }
    }

    useEffect(() => {
        fetchPost()
    }, [id])

    const handleDelete = async () => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await axios.delete(`/api/board/${id}`)
                alert('삭제되었습니다.')
                navigate('/board')
            } catch (err) {
                console.error(err)
                alert('삭제 권한이 없습니다.')
            }
        }
    }

    const handleCommentSubmit = async () => {
        if (!commentContent.trim()) return

        try {
            await axios.post('/api/board/comment', {
                postId: id,
                content: commentContent,
                parentId: replyTarget
            })
            setCommentContent('')
            setReplyTarget(null)
            fetchPost() // 댓글 목록 갱신
        } catch (err) {
            console.error(err)
        }
    }

    const deleteComment = async (commentId) => {
        if (window.confirm('댓글을 삭제하시겠습니까?')) {
            try {
                await axios.delete(`/api/board/comment/${commentId}`)
                fetchPost()
            } catch (err) {
                console.error(err)
                alert('삭제 권한이 없습니다.')
            }
        }
    }

    const renderComments = (list, depth = 0) => {
        return list.map(comment => (
            <Box
                key={comment._id}
                sx={{
                    ml: depth * 6,
                    mb: 2,
                    mt: depth > 0 ? 1 : 0,
                    position: 'relative',
                    '&:before': depth > 0 ? {
                        content: '""',
                        position: 'absolute',
                        top: 20,
                        left: -24,
                        width: 16,
                        height: 16,
                        borderLeft: '2px solid #e2e8f0',
                        borderBottom: '2px solid #e2e8f0',
                        borderRadius: '0 0 0 8px'
                    } : {}
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: depth > 0 ? 'var(--bg-secondary)' : 'var(--card-bg)',
                        border: '1px solid var(--border-color)'
                    }}
                >
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: 'var(--bg-active)',
                                color: 'var(--text-active)',
                                fontSize: '0.875rem',
                                fontWeight: 700
                            }}
                        >
                            {comment.authorName[0]}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="subtitle2" fontWeight="700" color="var(--text-primary)">
                                        {comment.authorName}
                                    </Typography>
                                    <Typography variant="caption" color="var(--text-secondary)">
                                        {comment.createdAt?.substring(0, 16).replace('T', ' ')}
                                    </Typography>
                                </Stack>
                                {(currentUser.isAdmin || currentUser.email === comment.authorEmail) && (
                                    <IconButton size="small" onClick={() => deleteComment(comment._id)} sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444' } }}>
                                        <Trash2 size={14} />
                                    </IconButton>
                                )}
                            </Stack>

                            <Typography variant="body2" sx={{ my: 1, color: 'var(--text-primary)', lineHeight: 1.6 }}>
                                {comment.content}
                            </Typography>

                            <Button
                                size="small"
                                startIcon={<CornerDownRight size={14} />}
                                onClick={() => setReplyTarget(replyTarget === comment._id ? null : comment._id)}
                                sx={{
                                    color: replyTarget === comment._id ? 'var(--text-active)' : 'var(--text-secondary)',
                                    minWidth: 'auto',
                                    p: 0,
                                    fontSize: '0.75rem',
                                    '&:hover': { bg: 'transparent', color: 'var(--text-active)' }
                                }}
                            >
                                답글 달기
                            </Button>

                            {/* 대댓글 입력창 */}
                            {replyTarget === comment._id && (
                                <Box sx={{ mt: 2 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="답글을 입력하세요"
                                        value={commentContent}
                                        onChange={(e) => setCommentContent(e.target.value)}
                                        sx={{
                                            mb: 1,
                                            '& .MuiOutlinedInput-root': { bgcolor: 'var(--card-bg)' }
                                        }}
                                    />
                                    <Stack direction="row" justifyContent="flex-end" spacing={1}>
                                        <Button size="small" onClick={() => setReplyTarget(null)} sx={{ color: '#64748b' }}>취소</Button>
                                        <Button variant="contained" size="small" onClick={handleCommentSubmit} sx={{ bgcolor: '#3b82f6', boxShadow: 'none' }}>등록</Button>
                                    </Stack>
                                </Box>
                            )}
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        ))
    }

    // 트리 구조로 변환
    const commentTree = comments.reduce((roots, c) => {
        if (!c.parentId) {
            roots.push({
                ...c,
                children: comments.filter(child => child.parentId === c._id)
            })
        }
        return roots
    }, [])

    if (!post) return <Box sx={{ p: 4, textAlign: 'center' }}>Loading...</Box>

    const isAuthor = currentUser.isAdmin || currentUser.email === post.authorEmail

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', maxWidth: 1400, mx: 'auto', boxSizing: 'border-box' }}>

                {/* 상단 네비게이션 */}
                <Button
                    startIcon={<ArrowLeft size={18} />}
                    onClick={() => navigate('/board')}
                    sx={{ mb: 2, color: 'var(--text-secondary)', '&:hover': { color: 'var(--text-primary)', bgcolor: 'transparent' } }}
                >
                    목록으로 돌아가기
                </Button>

                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        mb: 3,
                        borderRadius: 3,
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                        bgcolor: 'var(--card-bg)'
                    }}
                >
                    {/* 헤더 */}
                    <Box sx={{ mb: 4 }}>
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                            <Chip
                                label={post.boardType}
                                size="small"
                                sx={{ bgcolor: 'var(--bg-active)', color: 'var(--text-active)', fontWeight: 600, border: '1px solid var(--border-color)' }}
                            />
                            {post.isPinned && (
                                <Chip
                                    label="공지"
                                    size="small"
                                    sx={{ bgcolor: '#fee2e2', color: '#ef4444', fontWeight: 600, border: '1px solid #fecaca' }}
                                />
                            )}
                        </Stack>
                        <Typography variant="h5" fontWeight="800" color="var(--text-primary)" sx={{ mb: 3, lineHeight: 1.3 }}>
                            {post.title}
                        </Typography>

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            justifyContent="space-between"
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            spacing={2}
                            sx={{ pb: 3, borderBottom: '1px solid #f1f5f9' }}
                        >
                            <Stack direction="row" spacing={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--text-secondary)' }}>
                                    <User size={16} />
                                    <Typography variant="body2" fontWeight={500}>{post.authorName}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--text-secondary)' }}>
                                    <Calendar size={16} />
                                    <Typography variant="body2">{post.createdAt?.substring(0, 16).replace('T', ' ')}</Typography>
                                </Box>
                            </Stack>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--text-secondary)', bgcolor: 'var(--bg-secondary)', px: 1.5, py: 0.5, borderRadius: 2 }}>
                                <Eye size={16} />
                                <Typography variant="body2" fontWeight={500}>{post.viewCount}</Typography>
                            </Box>
                        </Stack>
                    </Box>

                    {/* 내용 */}
                    <Box sx={{
                        minHeight: 200,
                        mb: 6,
                        typography: 'body1',
                        color: 'var(--text-primary)',
                        lineHeight: 1.8,
                        '& img': {
                            maxWidth: '100%',
                            height: 'auto',
                            display: 'block',
                            margin: '1rem 0',
                            borderRadius: 2
                        }
                    }}>
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
                    </Box>

                    {/* 첨부파일 */}
                    {post.files && post.files.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FileText size={16} /> 첨부파일
                            </Typography>
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                {post.files.map((file, i) => (
                                    <Paper
                                        key={i}
                                        elevation={0}
                                        component="a"
                                        href={file.path}
                                        download={file.filename}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            px: 2,
                                            py: 1,
                                            bgcolor: 'var(--bg-secondary)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: 2,
                                            textDecoration: 'none',
                                            color: 'var(--text-secondary)',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                bgcolor: 'var(--hover-bg)',
                                                borderColor: 'var(--text-secondary)'
                                            }
                                        }}
                                    >
                                        <Download size={16} />
                                        <Typography variant="body2" fontWeight={500}>
                                            {file.filename}
                                            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                                ({Math.round(file.size / 1024)}KB)
                                            </Typography>
                                        </Typography>
                                    </Paper>
                                ))}
                            </Stack>
                        </Box>
                    )}

                    {/* 버튼들 */}
                    <Stack direction="row" justifyContent="flex-end" spacing={1}>
                        {isAuthor && (
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<Trash2 size={16} />}
                                onClick={handleDelete}
                                sx={{ borderRadius: 2, textTransform: 'none' }}
                            >
                                게시글 삭제
                            </Button>
                        )}
                    </Stack>
                </Paper>

                {/* 댓글 섹션 */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" fontWeight="700" color="var(--text-primary)" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MessageSquare size={20} /> 댓글 <Box component="span" sx={{ color: 'var(--text-active)' }}>{comments.length}</Box>
                    </Typography>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 3,
                            borderRadius: 3,
                            border: '1px solid var(--border-color)',
                            bgcolor: 'var(--card-bg)'
                        }}
                    >
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={2}
                                placeholder="따뜻한 댓글을 남겨주세요..."
                                value={replyTarget ? '' : commentContent}
                                onChange={(e) => {
                                    if (replyTarget) return
                                    setCommentContent(e.target.value)
                                }}
                                disabled={!!replyTarget}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        bgcolor: 'var(--bg-secondary)'
                                    }
                                }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleCommentSubmit}
                                disabled={!!replyTarget}
                                sx={{
                                    minWidth: 80,
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    bgcolor: '#3b82f6',
                                    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)'
                                }}
                            >
                                등록
                            </Button>
                        </Box>
                    </Paper>

                    <Box>
                        {commentTree.map(parent => (
                            <Box key={parent._id}>
                                {renderComments([parent])}
                                {parent.children.length > 0 && renderComments(parent.children, 1)}
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
    )
}

export default BoardDetailPage
