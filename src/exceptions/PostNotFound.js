const ExceptionServer = require("./ExceptionServer")

class PostNotFound extends ExceptionServer {
    constructor(user) {
        super(`El Post [${user}] no existe`, 15, 'post_not_found', 404)
        this.severity = 'exception'
    }
}

module.exports = PostNotFound