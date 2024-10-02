const { postRepository } = require('../../../database/dependencies')
const request = require('postman-request')
const errorHandler = require('../../../tools/errorHandler')

const downloadPostController = async (req, res) => {
    try {
        const { postId } = req.params

        const { url, format, name } = await postRepository.find(postId)

        const buffer = await new Promise((resolve, reject) => {
            request.get(url, { encoding: null }, (err, resp, body) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(body)
                }
            })
        })
        await postRepository.increment(postId, 'downloads')
        res.set({ 'content-Disposition': 'attachment', "Meta-Data": JSON.stringify({ name, format }) })
        res.type(format)
        res.send(buffer)
    } catch (e) {
        errorHandler(e, req, res)
    }
}

module.exports = downloadPostController