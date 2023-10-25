export const csrfToken = async (req,res,next) => {
    try {
        res.status(200).setHeader('csrftoken', req.csrfToken()).json([])
    } catch (err) {
        next(err)
    }
}
