
const { TokenExpiredError, JsonWebTokenError } = require("jsonwebtoken");
const ExceptionServer = require('../exceptions/ExceptionServer')

const errorHandler = (err, req, res) => {

    let httpCode = 500
    let resp = {
        state: 'failure',
        request: {
            url: req.originalUrl,
            method: req.method
        },
        error: {
            code: 500,
            severity: 'error',
            type: 'server_error',
            message: "Internal server error, please try again later"
        }
    }
    if (err instanceof ExceptionServer) {
        resp.error.code = err.code
        resp.error.severity = err.severity
        resp.error.type = err.type
        resp.error.message = err.message
        resp.error.details = err.details
        httpCode = err.httpCode
    }
    if (err instanceof TokenExpiredError) {
        resp.error.type = 'token_expired'
        resp.error.message = err.message
        httpCode = 401
    }
    if (err instanceof JsonWebTokenError) {
        resp.error.type = 'token_invalid'
        resp.error.message = 'Invalid token'
        httpCode = 401
    }
    if (err instanceof SyntaxError) {
        resp.error.type = 'json_invalid'
        resp.error.message = 'Invalid json'
        httpCode = 400
    }
    console.log(`Error uknow: `, err);
    return res.status(httpCode).json(resp)
}


module.exports = errorHandler