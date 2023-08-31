// Dependencies
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const Error = require("./error-handling/Error");
const mongoose = require("mongoose");

// Database
mongoose.connect('mongodb://127.0.0.1:27017/vant-db').then(() => {
    console.log("Connected to database!");
}).catch((err) => {
    console.error("Failed to connect to database!");
    exit(-1);
})

// Routers
const currentRouter = require('./routes/current');

const app = express();

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }))
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/current', currentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    if (err instanceof Error) {
        res.status(err.status);
        res.json({
            success: false,
            message: err.message,
            status: err.status,
            error: req.app.get('env') === 'development' ? err.orinal_error : undefined,
        })
    } else {
        res.status(err.status || 500);
        res.json({
            success: false,
            message: err.message,
            status: err.status || 500,
            error: req.app.get('env') === 'development' ? err : undefined,
        })
    }
});

module.exports = app;

