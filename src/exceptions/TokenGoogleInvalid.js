const ExceptionServer = require("./ExceptionServer")

class TokenGoogleInvalid extends ExceptionServer {
    constructor() {
        super('Token is not valid', 16, 'token_google_invalid', 401)
        this.severity = 'exception'
    }
}

module.exports = TokenGoogleInvalid