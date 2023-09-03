import { Request, Response, NextFunction, RequestHandler } from "express";
declare const asyncHandler: (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default asyncHandler;
