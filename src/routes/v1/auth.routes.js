const Router = require('express')
const controllersV1 = require('../../controllers/v1')
const { validateSign } = require('../../middlewares/validateParams.middleware.js')
const auth = Router()

auth.post('/sign', validateSign, controllersV1.signController)
auth.post('/platform', controllersV1.authPlatformGoogleController)

module.exports = auth