class APIError extends Error{
    public status : number;
    public details : any;

    constructor(message: string, status: number, details?: any) {
        super(message);
        this.status = status;
        this.details = details;
        Error.captureStackTrace(this)
    }

}

export default APIError;