// Dependencies
import express, { Errback, Request, Response, NextFunction } from "express";
import cors from "cors";
import APIError from "./error-handling/APIError";

// Routers
import currentRouter from "./routes/current";
import configRouter from "./routes/config";

const app = express();

import log from "./log";
import morgan from "morgan";
import { inspect } from "util";

// Middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));
app.use((req: Request, res: Response, next: NextFunction) => {
    let logFunction = log.info;
    if(res.statusCode >= 400){
        logFunction = log.warn;
    }
    logFunction(`REQUEST ${req.method} ${req.url}`)
    next();
});

app.use('/api/v1/current', currentRouter);
app.use('/api/v1/config', configRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
    next(new APIError(`Route '${req.url}' does not exist!`, 404));
});


// error handler
app.use(function (err: any, req : Request, res : Response, next : NextFunction) {
    log.error(err);
    if (err instanceof APIError) {
        log.error(err.details);
        res.status(err.status);
        res.json({
            success: false,
            message: err.status >= 500 && err.status <= 599 && req.app.get('env') !== 'development' ? "Internal server error!" : err.message,
            status: err.status,
            error: process.env.ENV === 'development' ? err.details : undefined,
        })
    } else {
        res.status(err.status || 500);
        res.json({
            success: false,
            message: err.status >= 500 && err.status <= 599 && req.app.get('env') !== 'development' ? "Internal server error!" : err.message,
            status: err.status || 500,
            error: process.env.ENV === 'development' ? err : undefined,
        })
    }
});

export default app;

