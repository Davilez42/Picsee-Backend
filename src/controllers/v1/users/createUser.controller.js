const { userRepository } = require("../../../database/dependencies.js");
const errorHandler = require("../../../tools/errorHandler.js");
const { hashData } = require('../../../tools/encrypt.tool')
const { v4: uuid } = require('uuid')

require("dotenv").config();

const createUserController = async (req, res) => {

  try {
    const { username, password, email, firstNames, lastNames } = req.body;
    const passwordHash = await hashData(password)
    const userId = uuid()
    await userRepository.create({ userId, username, password: passwordHash, email, firstNames, lastNames, urlAvatar: process.env.DEFAULT_AVATAR_URL });

    const accessToken = sign({
      userId: userFound.userId,
      username: userFound.username,
    }, process.env.JWT_KEY_SECRET, { expiresIn: '2h' });


    return res.status(200).json({
      state: 'ok',
      data: {
        userId,
        urlAvatar: process.env.DEFAULT_AVATAR_URL,
        username,
        userId,
        token: accessToken,
      }
    });

  } catch (e) {
    errorHandler(e, req, res)
  }
};
module.exports = createUserController;
