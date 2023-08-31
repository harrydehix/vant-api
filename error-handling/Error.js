class Error {

    constructor(msg, status, original_error) {
        this.message = msg;
        this.status = status;
        this.original_error = original_error;
    }

}

module.exports = Error;