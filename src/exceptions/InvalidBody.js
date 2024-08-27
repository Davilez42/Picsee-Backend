const ExceptionServer = require("./ExceptionServer")

class InvalidBody extends ExceptionServer {
    constructor(details) {
        super(`El cuerpo proporcionado es incorrecto o faltan claves`, 13, 'invalid_body', 400)
        this.details = details
        this.severity = 'exception'
    }
}

module.exports = InvalidBody

