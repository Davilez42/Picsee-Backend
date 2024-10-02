const Router = require('express')
const { signController, authPlatformGoogleController, sendRecoverPassLink, resetPasswordController } = require('../../controllers/v1')

const { validateSign, passwordValidation, emailValidation } = require('../../middlewares/validateParams.middleware.js')
const auth = Router()

auth.post('/sign', validateSign, signController)
auth.post('/platform', authPlatformGoogleController)
auth.post('/recoverPass', emailValidation, sendRecoverPassLink)
auth.post('/resetPass', passwordValidation, resetPasswordController)

module.exports = auth