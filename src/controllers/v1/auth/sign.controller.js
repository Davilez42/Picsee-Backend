const { compare_ } = require("../../../tools/encrypt.tool");
const generateTokenTool = require("../../../tools/generateToken.tool");
const { userRepository } = require('../../../database/dependencies');
const errorHandler = require("../../../tools/errorHandler");
const PasswordIncorrect = require("../../../exceptions/PasswordIncorrect");
const UserNotFound = require("../../../exceptions/UserNotFound");


const signController = async (req, res) => {
  try {
    const { user, password } = req.body;

    const userFound = await userRepository.findCredentials(user);

    if (!userFound) {
      throw new UserNotFound(user)
    }

    if (!(await compare_(userFound.password, password))) {
      throw new PasswordIncorrect()
    }
    const accessToken = generateTokenTool({
      userId: userFound.userId,
      username: userFound.username,
    });


    return res.json({
      state: 'ok',
      data: {
        userId: userFound.userId,
        urlAvatar: userFound.urlAvatar,
        username: userFound.username,
        token: accessToken
      }
    });
  }
  catch (e) {
    errorHandler(e, req, res)
  }

};

module.exports = signController;
