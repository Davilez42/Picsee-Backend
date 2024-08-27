
const { Router } = require('express')
const { validateToken } = require('../../middlewares/validateToken.middleware')
const { validateUploadPost, validateIdPost } = require('../../middlewares/validateParams.middleware')
const controllers = require('../../controllers/v1/')
const router = Router()
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 900,
    max: 1, //peticiones por up dentro de la ventana de tiempo
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.get('/', controllers.getPostsController)
router.get('/:id_post/download', controllers.downloadPostController)
router.put('/', validateToken, validateUploadPost, controllers.uploadPostController)
router.get('/tags', controllers.getTagsController)
router.patch('/:id_post/like', limiter, validateToken, validateIdPost, controllers.likeController)

module.exports = router