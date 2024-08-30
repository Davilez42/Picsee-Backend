const { userRepository } = require("../../../database/dependencies.js");
const errorHandler = require("../../../tools/errorHandler.js");
const generateToken = require("../../../tools/generateToken.tool.js");
const { encrypt_ } = require('../../../tools/encrypt.tool')
const { v4: uuid } = require('uuid')

require("dotenv").config();

const createUserController = async (req, res) => {

  try {
    const { username, password, email, firstNames, lastNames } = req.body;
    const passwordHash = await encrypt_(password)
    const userId = uuid()
    await userRepository.create({ userId, username, password: passwordHash, email, firstNames, lastNames, urlAvatar: process.env.DEFAULT_AVATAR_URL });
    const accessToken = generateToken({ userId, username });

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
