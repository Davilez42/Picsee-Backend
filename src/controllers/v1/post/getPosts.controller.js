const { postRepository } = require("../../../database/dependencies");
const errorHandler = require('../../../tools/errorHandler')
require("dotenv").config();

const getPostsController = async (req, res) => {

  try {
    const criteria = new Map([])

    const keys = Object.keys(req.query)

    for (let i = 0; i < keys.length; i++) {
      criteria.set(keys[i], req.query[keys[i]])
    }

    const userId = req.userId

    const posts = await postRepository.get(criteria, userId);

    const lastPost = posts[posts.length - 1]

    return res.status(200).json({ state: 'ok', data: { posts }, cursor: lastPost ? lastPost.uploadAt.getTime() : new Date().getTime() });

  } catch (e) {
    errorHandler(e, req, res)
  }
};

module.exports = getPostsController;
