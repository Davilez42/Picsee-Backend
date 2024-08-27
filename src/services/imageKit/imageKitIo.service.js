const ImageKit = require("imagekit");
const { IMAGE_KIT_CONFIG } = require("../../../configs/config");
const FailedUploadImageKit = require("../../exceptions/FailedUploadImageKit");
const imagekit = new ImageKit(IMAGE_KIT_CONFIG);
const { getFormat, getName } = require('../../tools/getFormat')

const _upload = async (files, path, tags = {}) => {
  let infoImages = [];
  for (let i = 0; i < files.length; i++) {
    try {
      const _resp = await imagekit
        .upload({
          file: files[i].data,
          fileName: files[i].name,
          folder: path,
          tags: tags[i]
        })
      infoImages.push({ url: _resp.url, id_kitio: _resp.fileId, name: getName(_resp.name), format: getFormat(_resp.name) });
    } catch (error) {
      console.log(error);
      throw new FailedUploadImageKit
    }
  }
  return infoImages;
}

const _delete = async (files) => {
  //* delete images from cdn services
  if (files.length == 0) {
    return;
  }
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
