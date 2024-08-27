const ExceptionServer = require("./ExceptionServer")

class FailedUploadImageKit extends ExceptionServer {
    constructor() {
        super('Ups, tuvimos problemas para cargar tus fotos,vuelve a intentar en unos minutos', 12, 'failed_upload', 500)
        this.severity = 'error'
    }
}

module.exports = FailedUploadImageKit