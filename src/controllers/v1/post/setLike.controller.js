const { postRepository } = require("../../../database/dependencies");
const errorHandler = require("../../../tools/errorHandler");


const likeController = async (req, res) => {

  //* controller for set like posts
  const { id_post } = req.params;
  const id_user = req.id_user

  try {
    await postRepository.setLike(id_post, id_user);
    return res.sendStatus(204);
  } catch (e) {
    errorHandler(e, req, res)
  }
};

module.exports = likeController;
