const { userRepository } = require('../../../database/dependencies');
const errorHandler = require('../../../tools/errorHandler');
const updateUserController = async (req, res) => {
  //* controller for update info user

  try {
    const { userId } = req
    await userRepository.update(userId, { ...req.body })
    res.sendStatus(204)
  } catch (e) {
    errorHandler(e, req, res)
  }
};


module.exports = updateUserController