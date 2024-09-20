const { userRepository } = require("../../../database/dependencies.js");
const errorHandler = require("../../../tools/errorHandler.js");

const deleteUserController = async (req, res) => {
  //* controller for delete users
  try {
    const userId = req.userId
    await userRepository.delete(userId)
    res.sendStatus(204);
  } catch (e) {
    errorHandler(e, req, res)
  }
};

module.exports = deleteUserController;
