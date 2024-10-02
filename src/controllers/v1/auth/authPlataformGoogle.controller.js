const { userRepository } = require("../../../database/dependencies");
const { validateCredentialsGoogle } = require("../../../services/googleTokenValidation/validationTokenGoogle");
const errorHandler = require("../../../tools/errorHandler");
const InvalidBody = require("../../../exceptions/InvalidBody");
const { sign } = require("jsonwebtoken");
const { v4: uuid } = require('uuid');
const generatePassword = require("../../../tools/generatePassword");
const { hashData } = require('../../../tools/encrypt.tool')

const authPlatformGoogleController = async (req, res) => {

  try {

    const { credential } = req.body;

    if (!credential) {
      throw new InvalidBody('missing -> credentials')
    }

    const { picture, name, given_name, email } = await validateCredentialsGoogle(credential)

    const user = {
      userId: uuid(),
      username: name,
      email,
      firstNames: given_name,
      lastNames: " ",
      password: '',
      urlAvatar: picture
    };

    let userFound = await userRepository.find(email);

    if (!userFound) {
      user.password = await hashData(generatePassword(30))
      await userRepository.create(user);
    }

    const accessToken = sign(user, process.env.JWT_KEY_SECRET, { expiresIn: '2h' });

    res.status(200).json({
      state: 'ok',
      data: {
        userId: user.userId,
        urlAvatar: user.urlAvatar,
        username: user.username,
        token: accessToken
      }
    });
  } catch (e) {
    errorHandler(e, req, res)
  }
};

module.exports = authPlatformGoogleController;
