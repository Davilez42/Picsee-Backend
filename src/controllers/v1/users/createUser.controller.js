const { userRepository } = require("../../../database/dependencies.js");
const errorHandler = require("../../../tools/errorHandler.js");
const generateToken = require("../../../tools/generateToken.tool.js");
const { encrypt_ } = require('../../../tools/encrypt.tool')
require("dotenv").config();

const createUserController = async (req, res) => {
  //* controlador for register users

  const { username, password, email, first_names, last_names } = req.body;
  try {
    const password_encrypted = await encrypt_(password)

    const insertId = await userRepository.create({ username, password: password_encrypted, email, first_names, last_names });
    const token = generateToken({ id_user: insertId });

    return res.status(200).json({
      state: 'ok',
      id_user: insertId,
      url_avatar: process.env.DEFAULT_AVATAR_URL,
      username,
      password: true,
      token,
    });

  } catch (e) {
    errorHandler(e, req, res)
  }
};
module.exports = createUserController;
