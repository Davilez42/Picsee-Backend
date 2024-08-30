
const { Router } = require('express')
const { validateToken } = require('../../middlewares/validateToken.middleware')
const { validateUploadPost } = require('../../middlewares/validateParams.middleware')
const { uploadPostController, getPostsController, downloadPostController, getTagsController, likeController } = require('../../controllers/v1/')
const multer = require('multer')
const upload = multer()
const router = Router()
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 900,
    max: 1, //peticiones por  dentro de la ventana de tiempo
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.post('/', validateToken, upload.array('photos', 5), validateUploadPost, uploadPostController)
router.get('/', getPostsController)
router.get('/:post_id/download', downloadPostController)
router.get('/tags', getTagsController)
router.patch('/:post_id/like', limiter, validateToken, likeController)

module.exports = router