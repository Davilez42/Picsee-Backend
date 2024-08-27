class Response {
    constructor() {
        this._status = 200;
        this._json;
        this._headsr = {};
    }
    status(status) {
        this._status = status
        return this
    }
    json(json) {
        this._json = json
        return this
    }
    header(key, cotent) {
        this._headsr[key] = cotent
        return this
    }
}
module.exports = Response