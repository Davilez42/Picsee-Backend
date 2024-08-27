const ExceptionServer = require("./ExceptionServer")

class UserNotFound extends ExceptionServer {
    constructor(user) {
        super(`El usuario [${user}] no existe`, 17, 'user_not_found', 404)
        this.severity = 'exception'
    }
}

module.exports = UserNotFound