const { userRepository } = require("../../../database/dependencies.js");

const imageKitIio = require("../../../services/imageKit/imageKitIo.service.js");
const { IMAGE_KIT_CONFIG } = require("../../../../configs/config.js");
const errorHandler = require("../../../tools/errorHandler.js");

const updateAvatarController = async (req, res) => {
  //* controller for update avatar

  const { avatar } = req.files;
  try {
    const userId = req.userId;
    const avatarFound = await userRepository.getAvatar(userId);

    if (avatarFound.id_kitio !== null) {
      await imageKitIio._delete([{ id_cdn: avatarFound.id_kitio }]);
    }

    //? upload the new avatar
    const data_res = await imageKitIio._upload(
      [avatar],
      IMAGE_KIT_CONFIG.avatars_folder_dest
    );

    await userRepository.updateAvatar(userId, {
      url: data_res[0].url,
      id_kitio: data_res[0].id_kitio,
    });

    return res.status(200).json({ url: data_res[0].url });

  } catch (e) {
    errorHandler(e, req, res)
  }
};

module.exports = updateAvatarController;
