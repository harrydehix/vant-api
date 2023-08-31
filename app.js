var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var currentRouter = require('./routes/current');

var app = express();

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
    res.status(err.status || 500);
    res.json({
        success: false,
        message: err.message,
        status: err.status,
        error: req.app.get('env') === 'development' ? err : undefined,
    })
});

module.exports = app;
