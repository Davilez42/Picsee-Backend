const { Router } = require('express')
const { validateToken } = require('../../middlewares/validateToken.middleware')
const { validateCreateUser, validateUpdateUser } = require('../../middlewares/validateParams.middleware')
const controllers = require('../../controllers/v1/')
const router = Router()


router.delete('/', validateToken, controllers.deleteUserController)
router.post('/', validateCreateUser, controllers.createUserController)
router.patch('/', validateToken, validateUpdateUser, controllers.updateUserController)
router.patch('/avatar', validateToken, controllers.updateAvatarController)



module.exports = router