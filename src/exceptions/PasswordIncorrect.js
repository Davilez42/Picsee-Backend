const ExceptionServer = require("./ExceptionServer")

class PasswordIncorrect extends ExceptionServer {
    constructor() {
        super(`Contraseña incorrecta`, 14, 'password_incorrect', 401)
        this.severity = 'exception'
    }
}

module.exports = PasswordIncorrect