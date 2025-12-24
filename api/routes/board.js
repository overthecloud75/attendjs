import express from 'express'
import {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
    createComment,
    deleteComment
} from '../controllers/board.js'
import { verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

// 게시글 CRUD
router.post('/', verifyUser, createPost)
router.get('/', verifyUser, getPosts)
router.get('/:id', verifyUser, getPost)
router.put('/:id', verifyUser, updatePost)
router.delete('/:id', verifyUser, deletePost)

// 댓글 기능 (id는 commentId)
router.post('/comment', verifyUser, createComment)
router.delete('/comment/:id', verifyUser, deleteComment)

export default router