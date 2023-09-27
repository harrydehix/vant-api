export default class APIClosedError extends Error{
    constructor(){
        super("API already has been closed!");
        this.name = "APIClosedError";
    }
}