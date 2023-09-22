import { NextFunction, Response, Request } from "express";
import APIError from "../error-handling/APIError";
import APIUser, { APIUserRole } from "../models/APIUser";
import asyncHandler from "../error-handling/asyncHandler";
import { header } from "express-validator";
import log from "../logger/api-logger";

const protect = (minimumRole: APIUserRole) => {
    return [header("x-api-key").optional().escape(), asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        log.debug("Validating api key...");
        const apiKey = req.header("x-api-key");

        if(!apiKey){
            return next(new APIError("Access denied. No api key specified! Set your api key in the header's 'x-api-key' field!", 403))
        }

        const apiUser = await APIUser.findByAPIKey(apiKey);

        if(!apiUser){
            return next(new APIError(`Access denied. Unknown api key '${apiKey}'!`, 403))
        }

        if(!apiUser.mayAccess(minimumRole)){
            return next(new APIError("Access denied. Your api key is not allowed to access this endpoint.", 403))
        }
        log.debug("Access granted!");
        next();
    })]
}

export default protect;