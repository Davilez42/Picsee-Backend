const { tagRepository } = require("../../../database/dependencies");
const errorHandler = require("../../../tools/errorHandler");
const getTagsController = async (req, res) => {
  // * controller for get current tags
  try {
    const tags = await tagRepository.get();
    return res.status(200).json({ tags });
  } catch (e) {
    errorHandler(e, req, res)
  }
};

module.exports = getTagsController;
