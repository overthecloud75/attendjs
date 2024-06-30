import path from 'path'
import sharp from 'sharp'
import Upload from '../models/Upload.js'
import { createError } from '../utils/error.js'

export const postImageUpload = async (req, res, next) => {
    try {
        const originalName = req.file.originalname
        const destination = req.file.destination
        const fileName = req.file.filename
        const filePath = destination + fileName 

        let width, height

        try {
            // Sharp를 사용하여 이미지 크기 확인
            const metadata = await sharp(filePath).metadata()
            width = metadata.width
            height = metadata.height
        } catch (err) {
            next(err)
        }

        const newUpload = Upload({employeeId: req.user.employeeId, originalName, destination, fileName, width, height})
        const result = await newUpload.save()
        res.status(200).json({filename: result._id})
    } catch (err) {
        next(err)
    }
}

export const getImage = async (req, res, next) => {
    try {
        const upload = await Upload.findOne({_id: req.params.file})
        if (upload) {
            const absolutePath = path.resolve(upload.destination + upload.fileName)
            res.status(200).sendFile(absolutePath)
        } else {
            return next(createError(404, 'Something Wrong!'))
        }
    } catch (err) {
        next(err)
    }
}


