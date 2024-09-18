const { postRepository } = require("../../../database/dependencies");
const errorHandler = require("../../../tools/errorHandler");


const likeController = async (req, res) => {
  try {
    const { postId } = req.params;

    const userId = req.userId

    await postRepository.like(postId, userId);

    return res.sendStatus(204);
  } catch (e) {
    errorHandler(e, req, res)
  }
};

module.exports = likeController;
