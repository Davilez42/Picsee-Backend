const { userRepository } = require('../../../database/dependencies');
const errorHandler = require('../../../tools/errorHandler');
const updateUserController = async (req, res) => {
  //* controller for update info user

  try {
    const { id_user } = req
    await userRepository.update(id_user, { ...req.body })
    res.sendStatus(204)
  } catch (e) {
    errorHandler(e, req, res)
  }
};


module.exports = updateUserController