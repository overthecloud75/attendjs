import express from 'express'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import mime from 'mime-types'
import { postImageUpload, getImage } from '../controllers/upload.js'
import { verifyUser } from '../utils/verifyToken.js'

const storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => { 
        cb(null, `${uuidv4()}.${mime.extension(file.mimetype)}`)
    }
})

const imageUpload = multer(
    { 
        storage, 
        fileFilter: (req, file, cb) => {
            if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) 
                cb(null, true)
            else 
                cb(new Error('The filetype is not supported'), false)
        }
    })
const router = express.Router()

router.post('/image', verifyUser, imageUpload.single('file'), postImageUpload)
router.get('/image/:file', verifyUser, getImage)

export default router