"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const Error_1 = __importDefault(require("./error-handling/Error"));
const mongoose_1 = __importDefault(require("mongoose"));
const debug_1 = __importDefault(require("debug"));
const debug = (0, debug_1.default)("vant-api");
// Database
mongoose_1.default.connect('mongodb://127.0.0.1:27017/vant-db').then(() => {
    debug("Connected to database!");
}).catch((err) => {
    debug("Failed to connect to database!");
    debug(err);
    process.exit(-1);
});
// Routers
const current_1 = __importDefault(require("./routes/current"));
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({ origin: "*" }));
app.use((0, morgan_1.default)('dev'));
app.use('/api/v1/current', current_1.default);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, next) {
    debug("Handling error (" + err.message + ")!");
    if (err instanceof Error_1.default) {
        res.status(err.status);
        res.json({
            success: false,
            message: err.status >= 500 && err.status <= 599 && req.app.get('env') !== 'development' ? "Internal server error!" : err.message,
            status: err.status,
            error: process.env.ENV === 'development' ? err.details : undefined,
        });
    }
    else {
        res.status(err.status || 500);
        res.json({
            success: false,
            message: err.status >= 500 && err.status <= 599 && req.app.get('env') !== 'development' ? "Internal server error!" : err.message,
            status: err.status || 500,
            error: process.env.ENV === 'development' ? err : undefined,
        });
    }
});
exports.default = app;
//# sourceMappingURL=app.js.map