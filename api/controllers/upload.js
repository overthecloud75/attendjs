import path from 'path'
import sharp from 'sharp'
import Upload from '../models/Upload.js'
import { createError } from '../utils/error.js'

export const postImageUpload = async (req, res, next) => {
    try {
        const { originalname: originalName, destination, filename: fileName } = req.file
        const filePath = `${destination}${fileName}` 

        let width, height

        try {
            // Sharp를 사용하여 이미지 크기 확인
            const metadata = await sharp(filePath).metadata()
            width = metadata.width
            height = metadata.height
        } catch (err) {
            throw createError(400, err)
        }
        const newUpload = new Upload({employeeId: req.user.employeeId, originalName, destination, fileName, width, height})
        const result = await newUpload.save()
        res.status(200).json({filename: result._id})
    } catch (err) {
        next(err)
    }
}

export const getImage = async (req, res, next) => {
    try {
        const { file } = req.params
        const upload = await Upload.findOne({_id: file})

        if (!upload) throw createError(404, 'Image Not Found')
        const absolutePath = path.resolve(`${upload.destination}${upload.fileName}`)
        res.sendFile(absolutePath, (err) => {
            if (err) throw createError(404, err)
        })
    } catch (err) {
        next(err)
    }
}


