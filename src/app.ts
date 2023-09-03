// Dependencies
import createError from "http-errors";
import express, { Errback, Request, Response, NextFunction } from "express";
import logger from "morgan";
import cors from "cors";
import Error from "./error-handling/Error";
import mongoose from "mongoose";
import debugInitializer from "debug";


const debug = debugInitializer("vant-api");

// Database
mongoose.connect('mongodb://127.0.0.1:27017/vant-db').then(() => {
    debug("Connected to database!");
}).catch((err) => {
    debug("Failed to connect to database!");
    debug(err);
    process.exit(-1);
})

// Routers
import currentRouter from "./routes/current";
import { inspect } from "util";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));
app.use(logger('dev'));

app.use('/api/v1/current', currentRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError(404));
});

// error handler
app.use(function (err: any, req : Request, res : Response, next : NextFunction) {
    debug("Handling error (" + err.message + ")!");
    debug(inspect(err, false, null, true));
    if (err instanceof Error) {
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

