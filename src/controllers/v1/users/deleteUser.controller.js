const { userRepository } = require("../../../database/dependencies.js");
const errorHandler = require("../../../tools/errorHandler.js");

const deleteUserController = async (req, res) => {
  //* controller for delete users
  const { id_user } = req;
  try {
    await userRepository.delete(id_user)
    res.sendStatus(204);
  } catch (e) {
    errorHandler(e, req, res)
  }
};

module.exports = deleteUserController;
