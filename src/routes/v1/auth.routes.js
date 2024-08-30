const Router = require('express')
const { signController, authPlatformGoogleController } = require('../../controllers/v1')

const { validateSign } = require('../../middlewares/validateParams.middleware.js')
const auth = Router()

auth.post('/sign', validateSign, signController)
auth.post('/platform', authPlatformGoogleController)

module.exports = auth