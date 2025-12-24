import path from 'path'
import sharp from 'sharp'
import Upload from '../models/Upload.js'
import { createError } from '../utils/error.js'

export const postImageUpload = async (req, res, next) => {
    try {
        const { originalname: originalName, destination, filename: fileName, size, mimetype } = req.file
        const filePath = `${destination}${fileName}`

        let width, height

        try {
            // Sharp를 사용하여 이미지 크기 확인
            const metadata = await sharp(filePath).metadata()
            width = metadata.width
            height = metadata.height
        } catch (err) {
            // 이미지가 아닌 경우 무시
            width = 0
            height = 0
        }
        const newUpload = new Upload({ employeeId: req.user.employeeId, originalName, destination, fileName, width, height, size, mimetype })
        const result = await newUpload.save()
        res.status(200).json({ filename: result._id, url: `${process.env.DOMAIN}/api/upload/image/${result._id}` })
    } catch (err) {
        next(err)
    }
}

export const postFileUpload = async (req, res, next) => {
    try {
        const { originalname: originalName, destination, filename: fileName, size, mimetype } = req.file

        const newUpload = new Upload({
            employeeId: req.user.employeeId,
            originalName,
            destination,
            fileName,
            size,
            mimetype,
            width: 0,
            height: 0
        })
        const result = await newUpload.save()
        res.status(200).json({
            _id: result._id,
            filename: result.originalName,
            path: `/api/upload/file/${result._id}`,
            size: result.size
        })
    } catch (err) {
        next(err)
    }
}

export const getImage = async (req, res, next) => {
    try {
        const { file } = req.params
        const upload = await Upload.findOne({ _id: file })

        if (!upload) throw createError(404, 'Image Not Found')
        const absolutePath = path.resolve(`${upload.destination}${upload.fileName}`)
        res.sendFile(absolutePath, (err) => {
            if (err && !res.headersSent) next(createError(404, 'File not found'))
        })
    } catch (err) {
        next(err)
    }
}

export const getFile = async (req, res, next) => {
    try {
        const { id } = req.params
        const upload = await Upload.findById(id)

        if (!upload) throw createError(404, 'File Not Found')

        const absolutePath = path.resolve(`${upload.destination}${upload.fileName}`)
        res.download(absolutePath, upload.originalName, (err) => {
            if (err && !res.headersSent) next(createError(500, 'Error downloading file'))
        })
    } catch (err) {
        next(err)
    }
}
