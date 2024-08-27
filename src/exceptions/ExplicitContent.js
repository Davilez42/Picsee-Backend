const ExceptionServer = require("./ExceptionServer")

class ExplicitContent extends ExceptionServer {
    constructor() {
        super('la imagen contiene contenido explícito', 11, 'content_explicit', 400)
        this.severity = 'exception'
    }
}

module.exports = ExplicitContent

