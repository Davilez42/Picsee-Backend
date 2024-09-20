
const { Router } = require('express')
const { validateToken } = require('../../middlewares/validateToken.middleware')
const { validateUploadPost } = require('../../middlewares/validateParams.middleware')
const { uploadPostController, getPostsController, downloadPostController, getTagsController, likeController } = require('../../controllers/v1/')
const multer = require('multer')
const upload = multer()
const router = Router()
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 600,
    max: 1,
});

router.post('/', validateToken, upload.array('photos', 5), validateUploadPost, uploadPostController)
router.get('/', validateToken, getPostsController)
router.get('/:postId/download', downloadPostController)
router.get('/tags', getTagsController)
router.post('/:postId/like', limiter, validateToken, likeController)

module.exports = router