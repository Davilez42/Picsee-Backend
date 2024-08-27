const ExceptionServer = require("./ExceptionServer")

class DataAlreadyExist extends ExceptionServer {
    constructor(valExist) {
        super(valExist ? valExist : 'usuarname o email ya en uso', 10, 'data_already_exist', 202)
        this.severity = 'exception'
    }
}

module.exports = DataAlreadyExist