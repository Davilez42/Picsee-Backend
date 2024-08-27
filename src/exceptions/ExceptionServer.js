class ExceptionServer extends Error {
    constructor(message, code, type, httpCode) {
        super(message)
        this.code = code
        this.type = type
        this.httpCode = httpCode
    }
}
module.exports = ExceptionServer