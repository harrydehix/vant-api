const express = require('express');
const { body, query, validationResult, checkSchema, checkExact } = require('express-validator');
const { CurrentConditions } = require("vant-db");
const Error = require("../error-handling/Error");
const asyncHandler = require("../error-handling/asyncHandler")
const currentConditionsSchema = require("../validationSchemas/currentConditionsSchema");

const router = express.Router();

/* GET current weather conditions */
router.get('/',
    // query validation
    query("rainUnit").optional().matches(/(in|mm)/).withMessage("Invalid rain unit. Allowed values are: 'in', 'mm'"),
    query("windUnit").optional().matches(/(km\/h|mph|ft\/s|knots|Bft|m\/s)/).withMessage("Invalid wind unit. Allowed values are: 'km/h', 'mph', 'ft/s', 'knots', 'Bft', 'm/s'"),
    query("pressureUnit").optional().matches(/(hPa|inHg|mmHg|mb)/).withMessage("Invalid pressure unit. Allowed values are: 'hPa', 'inHg', 'mmHg', 'mb'"),
    query("solarRadiationUnit").optional().matches(/(W\/m²)/).withMessage("Invalid solar radiation unit. Allowed values are: 'W/m²'"),
    query("temperatureUnit").optional().matches(/(°C|°F)/).withMessage("Invalid temperature unit. Allowed values are: '°C', '°F'"),
    asyncHandler(async (req, res, next) => {
        const result = validationResult(req);

        if (result.isEmpty()) {
            try {
                const currentConditions = await CurrentConditions.findOne();

                if (currentConditions === null) {
                    next(new Error("No current weather conditions available. This error usually happens if no weather data hasn't been uploaded!", 503))
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
            } catch (err) {
                next(new Error("Failed to access the current weather conditions from the database!", 500, err))
            }
        } else {
            next(new Error(result.array()[0], 400, result))
        }
    }));

/* SET current weather conditions */
router.post('/', checkExact(checkSchema(currentConditionsSchema, ["body"])),
    asyncHandler(async (req, res, next) => {
        const result = validationResult(req);

        if (result.isEmpty()) {
            const currentConditions = new CurrentConditions(req.body);

            try {
                await currentConditions.validate();
            } catch (err) {
                next(new Error("Invalid '" + err.errors[0] + "' value!"));
            }

            try {
                await CurrentConditions.deleteMany();
            } catch (err) {
                next(new Error("Failed to delete existing current conditions in the database!", 500, err));
            }

            try {
                await currentConditions.save({ validateBeforeSafe: false });

                res.status(201);
                res.json({
                    success: true,
                    status: 201
                });
            } catch (err) {
                next(new Error("Failed to save current conditions in the database!", 500, err));
            }
        } else {
            next(new Error(result.array()[0].msg, 400, result))
        }
    }));

module.exports = router;
