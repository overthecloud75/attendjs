import path from 'path'

export const postImageUpload = async (req, res, next) => {
    try {
        res.status(200).json({filename: req.file.filename})
    } catch (err) {
        next(err)
    }
}

export const getImage = async (req, res, next) => {
    try {
        const absolutePath = path.resolve('./uploads/' + req.params.file)
        res.status(200).sendFile(absolutePath)
    } catch (err) {
        console.log(err)
        next(err)
    }
}


