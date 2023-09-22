import express, { NextFunction, Request, Response } from "express";
import { query, validationResult } from "express-validator";
import APIUser, { APIUserRole, APIUserRoles } from "../models/APIUser";
import APIError from "../error-handling/APIError";
import asyncHandler from "../error-handling/asyncHandler";
import protect from "../security/protect";
import log from "../logger/api-logger";

const router = express.Router();

router.get("/generate-key", 
    protect("admin"), 
    query("role").escape().isIn(APIUserRoles).withMessage("Invalid or missing role! Valid values are: admin, read, readwrite, write"),
    asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        const result = validationResult(req);

        if (result.isEmpty()) {
            let apiUser;
            try{
                log.debug("Generating new api key...");
                apiUser = await APIUser.createNew(req.query.role as APIUserRole);
            }catch(err){
                return next(new APIError("Error while creating new api key!", 500, err));
            }

            try{
                log.debug("Saving new api key...");
                await apiUser.save();
            }catch(err){
                return next(new APIError("Error while saving api key!", 500, err));
            }

            res.status(201).json({
                success: true,
                key: apiUser.key,
                role: apiUser.role,
                generated: apiUser.generated.toISOString()
            });
        }else{
            return next(new APIError(result.array()[0].msg, 400, result));
        }
    })
);

export default router;