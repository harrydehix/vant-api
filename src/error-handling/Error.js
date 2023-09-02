class Error {

    constructor(msg, status, details) {
        this.message = msg;
        this.status = status;
        this.details = details;
    }

}

module.exports = Error;