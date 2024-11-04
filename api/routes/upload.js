import express from 'express'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import mime from 'mime-types'
import { postImageUpload, getImage } from '../controllers/upload.js'
import { verifyUser } from '../utils/verifyToken.js'
import { getYearMonth } from '../utils/util.js'
import { ensureDirectoryExists } from '../utils/file.js'

const storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        const { year, month } = getYearMonth()
        ensureDirectoryExists('uploads/'+ year + '/' + month + '/')  
        cb(null, 'uploads/'+ year + '/' + month + '/')
    },
    filename: (req, file, cb) => { 
        cb(null, `${uuidv4()}.${mime.extension(file.mimetype)}`)
    }
})

const imageUpload = multer(
    { 
        storage, 
        fileFilter: (req, file, cb) => {
            if (['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.mimetype)) 
                cb(null, true)
            else 
                cb(new Error('The filetype is not supported'), false)
        }
    })
const router = express.Router()

router.post('/image', verifyUser, imageUpload.single('file'), postImageUpload)
router.get('/image/:file', getImage) // verifyUser 

export default router