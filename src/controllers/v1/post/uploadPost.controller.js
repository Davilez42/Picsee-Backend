const { tagRepository, postRepository } = require("../../../database/dependencies.js");
const imageKitIio = require("../../../microservices/imageKit/imageKitIo.service.js");
const { IMAGE_KIT_CONFIG } = require("../../../../configs/config.js");
const imageModerator = require("../../../microservices/ImageModerator/imageModerator.js");
const errorHandler = require("../../../tools/errorHandler.js");
const ImageProcessing = require("../../../microservices/imageProc/imageProcess.js");

const uploadPostController = async (req, res) => {
  //* controller for upload image to cdn

  const { id_user } = req;
  try {
    let { photos } = req.files;
    let { tags } = req.body
    tags = tags ? JSON.parse(tags) : {}

    if (!photos.length) {
      photos = [photos]
    }

    const ph_proc = await ImageProcessing.process(photos)

    //* verify images moderator
    /*     for (const f of ph_proc) {
          await imageModerator.verify(f)
        } */

    const infoFilesInserted = await imageKitIio._upload(
      ph_proc,
      IMAGE_KIT_CONFIG.images_folder_dest, tags
    );

    console.log(infoFilesInserted);
    await postRepository.create(id_user, infoFilesInserted, tags);

    res.status(200).json({
      images: [infoFilesInserted.map(i => i.url)]
    });
  } catch (e) {
    errorHandler(e, req, res)
  }
};

module.exports = uploadPostController;
