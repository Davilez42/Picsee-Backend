const { compare_ } = require("../../../tools/encrypt.tool");
const generateTokenTool = require("../../../tools/generateToken.tool");
const { userRepository } = require('../../../database/dependencies');
const errorHandler = require("../../../tools/errorHandler");
const PasswordIncorrect = require("../../../exceptions/PasswordIncorrect");


const signController = async (req, res) => {
  //* Controlador for login user

  const { username, password } = req.body;
  try {
    const user_bd = await userRepository.find(username);

    if (!(await compare_(user_bd.password, password))) {
      throw new PasswordIncorrect()
    }
    const access_token = generateTokenTool({
      id_user: user_bd.id_user,
      username: user_bd.username,
    });


    return res.header("auth", access_token).json({
      state: 'ok',
      id_user: user_bd.id_user,
      url_avatar: user_bd.url,
      username: user_bd.username,
      password: true,
      token: access_token
    });
  }
  catch (e) {
    errorHandler(e, req, res)
  }

};

module.exports = signController;
