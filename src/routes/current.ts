import express, {Request, Response, NextFunction} from "express";
import { body, query, validationResult, checkSchema, checkExact, ValidationError }  from "express-validator";
import { CurrentConditions } from "vant-db";
import Error from "../error-handling/Error";
import asyncHandler from "../error-handling/asyncHandler";
import currentConditionsSchema from "../validationSchemas/currentConditionsSchema";
import { RainUnits } from "vantjs/dist/units/RainUnits";
import { WindUnits } from "vantjs/dist/units/WindUnits";
import { PressureUnits } from "vantjs/dist/units/PressureUnits";
import { SolarRadiationUnits } from "vantjs/dist/units/SolarRadiationUnits";
import { TemperatureUnits } from "vantjs/dist/units/TemperatureUnits";
import mongoose from "mongoose";

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
                    return next(new Error("No current weather conditions available. This error usually happens if no weather data hasn't been uploaded!", 503))
                }

                currentConditions.changeUnits({
                    rain: req.query.rainUnit as RainUnits,
                    wind: req.query.windUnit as WindUnits,
                    pressure: req.query.pressureUnit as PressureUnits,
                    solarRadiation: req.query.solarRadiationUnit as SolarRadiationUnits,
                    temperature: req.query.temperatureUnit as TemperatureUnits
                });

                res.status(200).json({
                    success: true,
                    data: currentConditions
                });
            } catch (err) {
                return next(new Error("Failed to access the current weather conditions from the database!", 500, err))
            }
        } else {
            return next(new Error(result.array()[0].msg, 400, result))
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
                if(err instanceof mongoose.Error.ValidationError){
                    return next(new Error("Invalid '" + err.errors[0] + "' value!", 400));
                }else{
                    return next(new Error("Unknown error while validation!", 500, err));
                }
            }

            try {
                await CurrentConditions.deleteMany();
            } catch (err) {
                return next(new Error("Failed to delete existing current conditions in the database!", 500, err));
            }

            try {
                await currentConditions.save({ validateBeforeSave: false });

                res.status(201);
                res.json({
                    success: true,
                    status: 201
                });
            } catch (err) {
                return next(new Error("Failed to save current conditions in the database!", 500, err));
            }
        } else {
            return next(new Error(result.array()[0].msg, 400, result))
        }
    }));

export default router;
