class Error {
    public message : string;
    public status : number;
    public details : any;

    constructor(message: string, status: number, details?: any) {
        this.message = message;
        this.status = status;
        this.details = details;
    }

}

export default Error;