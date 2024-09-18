const { postRepository } = require('../../../database/dependencies')
const request = require('postman-request')
const errorHandler = require('../../../tools/errorHandler')

const downloadPostController = async (req, res) => {
    try {
        const { post_id } = req.params
        const post = await postRepository.find(post_id)

        const buffer = await new Promise((resolve, reject) => {
            request.get(post.url, { encoding: null }, (err, resp, body) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(body)
                }
            })
        })

        res.set({ 'content-Disposition': 'attachment', "Meta-Data": JSON.stringify({ name: post.name, format: post.format }) })
        res.type(post.format)
        res.send(buffer)
    } catch (e) {
        errorHandler(e, req, res)
    }
}

module.exports = downloadPostController