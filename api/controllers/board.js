import Post from '../models/Post.js'
import Comment from '../models/Comment.js'
import { createError } from '../utils/error.js'
import sanitizeHtml from 'sanitize-html'

const sanitizeOptions = {
    allowedTags: [
        'p', 'br', 'strong', 'em', 'u',
        'ul', 'ol', 'li',
        'blockquote',
        'pre', 'code',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'img', 'a'
    ],
    allowedAttributes: {
        'img': ['src', 'alt'],
        'a': ['href', 'rel', 'target']
    },
    allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'tel'],
    allowedSchemesByTag: {
        img: ['http', 'https'] // Base64 (data:) blocked
    },
    allowProtocolRelative: true // Allow /uploads/...
}

// 게시글 작성
export const createPost = async (req, res, next) => {
    try {
        const { boardType, title, content, files, isPinned } = req.body
        const { email: authorEmail, name: authorName, isAdmin, department } = req.user

        // 권한 체크: 공지사항(NOTICE)은 관리자나 HR만 작성 가능
        if (boardType === 'NOTICE' && !isAdmin && department !== 'HR') {
            throw createError(403, 'Only Admin or HR can post notices.')
        }

        // Sanitize Content
        const cleanContent = sanitizeHtml(content, sanitizeOptions)

        const newPost = new Post({
            boardType,
            title,
            content: cleanContent,
            authorEmail,
            authorName,
            isPinned: (isAdmin || department === 'HR') ? isPinned : false, // 일반 사용자는 고정 불가
            files: files || []
        })

        const savedPost = await newPost.save()
        res.status(201).json(savedPost)
    } catch (err) {
        next(err)
    }
}

// 게시글 목록 조회
export const getPosts = async (req, res, next) => {
    try {
        const { boardType, page = 1, limit = 10, search, searchType } = req.query

        const query = {}
        if (boardType) query.boardType = boardType

        // 검색 로직
        if (search) {
            const regex = new RegExp(search, 'i')
            if (searchType === 'title') query.title = regex
            else if (searchType === 'content') query.content = regex
            else if (searchType === 'author') query.authorName = regex
            else {
                // 전체 검색
                query.$or = [{ title: regex }, { content: regex }, { authorName: regex }]
            }
        }

        const posts = await Post.find(query)
            .sort({ isPinned: -1, createdAt: -1 }) // 고정글 우선, 최신순
            .skip((page - 1) * limit)
            .limit(Number(limit))

        const totalCount = await Post.countDocuments(query)

        res.status(200).json({
            posts,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: Number(page),
            totalCount
        })
    } catch (err) {
        next(err)
    }
}

// 게시글 상세 조회
export const getPost = async (req, res, next) => {
    try {
        const { id } = req.params

        // 조회수 증가 및 게시글 조회
        const post = await Post.findByIdAndUpdate(
            id,
            { $inc: { viewCount: 1 } },
            { new: true }
        )

        if (!post) throw createError(404, 'Post not found')

        // 댓글 조회
        const comments = await Comment.find({ postId: id }).sort({ createdAt: 1 })

        res.status(200).json({ post, comments })
    } catch (err) {
        next(err)
    }
}

// 게시글 수정
export const updatePost = async (req, res, next) => {
    try {
        const { id } = req.params
        const { title, content, files, isPinned } = req.body
        const { email: userEmail, isAdmin } = req.user

        const post = await Post.findById(id)
        if (!post) throw createError(404, 'Post not found')

        // 작성자 또는 관리자만 수정 가능
        if (post.authorEmail !== userEmail && !isAdmin) {
            throw createError(403, 'Permission denied')
        }

        // Sanitize Content
        const cleanContent = sanitizeHtml(content, sanitizeOptions)

        const updateData = { title, content: cleanContent, files }
        if (isAdmin) updateData.isPinned = isPinned

        const updatedPost = await Post.findByIdAndUpdate(id, { $set: updateData }, { new: true })
        res.status(200).json(updatedPost)
    } catch (err) {
        next(err)
    }
}

// 게시글 삭제
export const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params
        const { email: userEmail, isAdmin } = req.user

        const post = await Post.findById(id)
        if (!post) throw createError(404, 'Post not found')

        if (post.authorEmail !== userEmail && !isAdmin) {
            throw createError(403, 'Permission denied')
        }

        await Post.findByIdAndDelete(id)
        await Comment.deleteMany({ postId: id }) // 관련 댓글 삭제

        res.status(200).send('Post deleted')
    } catch (err) {
        next(err)
    }
}

// 댓글 작성
export const createComment = async (req, res, next) => {
    try {
        const { postId, content, parentId } = req.body
        const { email: authorEmail, name: authorName } = req.user

        const newComment = new Comment({
            postId,
            authorEmail,
            authorName,
            content,
            parentId
        })

        const savedComment = await newComment.save()
        res.status(201).json(savedComment)
    } catch (err) {
        next(err)
    }
}

// 댓글 삭제
export const deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params
        const { email: userEmail, isAdmin } = req.user

        const comment = await Comment.findById(id)
        if (!comment) throw createError(404, 'Comment not found')

        if (comment.authorEmail !== userEmail && !isAdmin) {
            throw createError(403, 'Permission denied')
        }

        await Comment.findByIdAndDelete(id)
        res.status(200).send('Comment deleted')
    } catch (err) {
        next(err)
    }
}