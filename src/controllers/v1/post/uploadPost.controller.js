const { postRepository } = require("../../../database/dependencies.js");
const imageKitIio = require("../../../services/imageKit/imageKitIo.service.js");
const { IMAGE_KIT_CONFIG } = require("../../../../configs/config.js");
const errorHandler = require("../../../tools/errorHandler.js");
const { v4: uuid } = require('uuid')

const uploadPostController = async (req, res) => {

  try {
    const { userId } = req;

    const photos = req.files;

    const { tags } = req.body

    const uploadFiles = await imageKitIio._upload(photos, IMAGE_KIT_CONFIG.images_folder_dest, tags);

    const postToInsert = []

    for (let i = 0; i < uploadFiles.length; i++) {
      const postId = uuid()
      postToInsert.push({
        postId,
        name: uploadFiles[i].name,
        fileId: uploadFiles[i].fileId,
        format: uploadFiles[i].format,
        url: uploadFiles[i].url,
      })
    }

    await postRepository.create(userId, postToInsert, tags ?? []);
    return res.sendStatus(204)
  } catch (e) {
    errorHandler(e, req, res)
  }
};

module.exports = uploadPostController;
