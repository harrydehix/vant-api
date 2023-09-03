declare class Error {
    message: string;
    status: number;
    details: any;
    constructor(message: string, status: number, details?: any);
}
export default Error;
