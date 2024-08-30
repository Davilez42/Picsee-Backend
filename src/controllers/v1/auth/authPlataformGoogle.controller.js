const { userRepository } = require("../../../database/dependencies");
const genareteToken = require("../../../tools/generateToken.tool");
const { validateCredentialsGoogle } = require("../../../services/googleTokenValidation/validationTokenGoogle");
const errorHandler = require("../../../tools/errorHandler");
const InvalidBody = require("../../../exceptions/InvalidBody");
require("dotenv").config();

const authPlatformGoogleController = async (req, res) => {
  // * controller for auth user with google

  try {

    const { credential } = req.body;

    if (!credential) {
      throw new InvalidBody('missing -> credentials')
    }

    const { picture, name, given_name, email } = await validateCredentialsGoogle(credential)

    const user = {
      username: name,
      email,
      first_names: " ",
      last_names: " ",
      password: "true",
    };

    let user_ = await userRepository.exist(email);

    if (!user_) {
      const insertId = await userRepository.create(user);
      await userRepository.updateAvatar(insertId, { url: picture, id_kitio: null })
      user.id_user = insertId;
      user.url_avatar = picture
    } else {
      user.id_user = user_.id_user
      user.url_avatar = user_.url
    }

    const token = genareteToken(user);

    res.status(200).json({
      state: 'ok', token,
      id_user: user.id_user,
      username: user.username,
      email,
      url_avatar: user.url_avatar,
      password: true,
      token
    });
  } catch (e) {
    errorHandler(e, req, res)
  }
};

module.exports = authPlatformGoogleController;
