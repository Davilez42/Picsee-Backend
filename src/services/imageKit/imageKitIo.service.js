const ImageKit = require("imagekit");
const { IMAGE_KIT_CONFIG } = require("../../../configs/config");
const FailedUploadImageKit = require("../../exceptions/FailedUploadImageKit");
const imagekit = new ImageKit(IMAGE_KIT_CONFIG);
const { getFormat, getName } = require('../../tools/getFormat')

const _upload = async (files, path, tags = []) => {
  try {
    const promises = [];
    for (let i = 0; i < files.length; i++) {
      promises.push(imagekit.upload({
        file: files[i].buffer,
        fileName: files[i].originalname,
        folder: path,
        tags: tags[i],
      }))
    }
    const result = await Promise.all(promises)
    return result;
  } catch (error) {
    throw new FailedUploadImageKit()
  }
}

const _delete = async (files) => {
  files.forEach((i) => {
    if (i) {
      imagekit.deleteFile(i.id_cdn).catch((error) => {
        return error;
      });
    }
  });
};


module.exports = {
  _upload,
  _delete
};
