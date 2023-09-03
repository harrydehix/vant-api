"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const vant_db_1 = require("vant-db");
const Error_1 = __importDefault(require("../error-handling/Error"));
const asyncHandler_1 = __importDefault(require("../error-handling/asyncHandler"));
const currentConditionsSchema_1 = __importDefault(require("../validationSchemas/currentConditionsSchema"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
/* GET current weather conditions */
router.get('/', 
// query validation
(0, express_validator_1.query)("rainUnit").optional().matches(/(in|mm)/).withMessage("Invalid rain unit. Allowed values are: 'in', 'mm'"), (0, express_validator_1.query)("windUnit").optional().matches(/(km\/h|mph|ft\/s|knots|Bft|m\/s)/).withMessage("Invalid wind unit. Allowed values are: 'km/h', 'mph', 'ft/s', 'knots', 'Bft', 'm/s'"), (0, express_validator_1.query)("pressureUnit").optional().matches(/(hPa|inHg|mmHg|mb)/).withMessage("Invalid pressure unit. Allowed values are: 'hPa', 'inHg', 'mmHg', 'mb'"), (0, express_validator_1.query)("solarRadiationUnit").optional().matches(/(W\/m²)/).withMessage("Invalid solar radiation unit. Allowed values are: 'W/m²'"), (0, express_validator_1.query)("temperatureUnit").optional().matches(/(°C|°F)/).withMessage("Invalid temperature unit. Allowed values are: '°C', '°F'"), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, express_validator_1.validationResult)(req);
    if (result.isEmpty()) {
        try {
            const currentConditions = yield vant_db_1.CurrentConditions.findOne();
            if (currentConditions === null) {
                return next(new Error_1.default("No current weather conditions available. This error usually happens if no weather data hasn't been uploaded!", 503));
            }
            currentConditions.changeUnits({
                rain: req.query.rainUnit,
                wind: req.query.windUnit,
                pressure: req.query.pressureUnit,
                solarRadiation: req.query.solarRadiationUnit,
                temperature: req.query.temperatureUnit
            });
            res.status(200).json({
                success: true,
                data: currentConditions
            });
        }
        catch (err) {
            return next(new Error_1.default("Failed to access the current weather conditions from the database!", 500, err));
        }
    }
    else {
        return next(new Error_1.default(result.array()[0].msg, 400, result));
    }
})));
/* SET current weather conditions */
router.post('/', (0, express_validator_1.checkExact)((0, express_validator_1.checkSchema)(currentConditionsSchema_1.default, ["body"])), (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, express_validator_1.validationResult)(req);
    if (result.isEmpty()) {
        const currentConditions = new vant_db_1.CurrentConditions(req.body);
        try {
            yield currentConditions.validate();
        }
        catch (err) {
            if (err instanceof mongoose_1.default.Error.ValidationError) {
                return next(new Error_1.default("Invalid '" + err.errors[0] + "' value!", 400));
            }
            else {
                return next(new Error_1.default("Unknown error while validation!", 500, err));
            }
        }
        try {
            yield vant_db_1.CurrentConditions.deleteMany();
        }
        catch (err) {
            return next(new Error_1.default("Failed to delete existing current conditions in the database!", 500, err));
        }
        try {
            yield currentConditions.save({ validateBeforeSave: false });
            res.status(201);
            res.json({
                success: true,
                status: 201
            });
        }
        catch (err) {
            return next(new Error_1.default("Failed to save current conditions in the database!", 500, err));
        }
    }
    else {
        return next(new Error_1.default(result.array()[0].msg, 400, result));
    }
})));
exports.default = router;
//# sourceMappingURL=current.js.map