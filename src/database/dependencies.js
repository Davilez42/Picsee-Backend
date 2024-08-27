const pool = require('./connectionPool')
const UserRepository = require("./UserRepository")
const TagRepository = require('./TagRepository')
const PostRepository = require("./PostRepository")


module.exports = {
    userRepository: new UserRepository(pool),
    tagRepository: new TagRepository(pool),
    postRepository: new PostRepository(pool),
}