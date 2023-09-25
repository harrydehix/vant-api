import express, {Request, Response, NextFunction} from "express";
import { body, query, validationResult, checkSchema, checkExact, ValidationError }  from "express-validator";
import CurrentConditions, { CurrentConditionsType } from "../models/CurrentConditions";
import APIError from "../error-handling/APIError";
import asyncHandler from "../error-handling/asyncHandler";
import currentConditionsSchema from "../validationSchemas/currentConditionsSchema";
import mongoose from "mongoose";
import log from "../logger/api-logger";
import { PressureUnit, RainUnit, SolarRadiationUnit, TemperatureUnit, WindUnit } from "vant-environment/units";
import protect from "../security/protect";
import sleep from "../utils/sleep";


const router = express.Router();
let current : CurrentConditionsType | null = null;

/* GET current weather conditions */
router.get('/',
    // api key authentification
    protect("read"),
    // query validation
    query("rainUnit").optional().isIn(["in", "mm"]).withMessage("Invalid rain unit. Allowed values are: 'in', 'mm'"),
    query("windUnit").optional().isIn(["km/h", "mph", "ft/s", "knots", "Bft", "m/s"]).withMessage("Invalid wind unit. Allowed values are: 'km/h', 'mph', 'ft/s', 'knots', 'Bft', 'm/s'"),
    query("pressureUnit").optional().isIn(["hPa", "inHg", "mmHg", "mb"]).withMessage("Invalid pressure unit. Allowed values are: 'hPa', 'inHg', 'mmHg', 'mb'"),
    query("solarRadiationUnit").optional().isIn(["W/m²"]).withMessage("Invalid solar radiation unit. Allowed values are: 'W/m²'"),
    query("temperatureUnit").optional().isIn(["°C", "°F"]).withMessage("Invalid temperature unit. Allowed values are: '°C', '°F'"),
    asyncHandler(async (req, res, next) => {
        const result = validationResult(req);

        if (result.isEmpty()) {
            try {
                if(current === null){
                     return next(new APIError("No current weather conditions available. This error usually happens if no weather data hasn't been uploaded!", 503))
                }
                
                log.debug("Changing units...");
                const data = current.$clone();
                data.changeUnits({
                    rain: req.query.rainUnit as RainUnit,
                    wind: req.query.windUnit as WindUnit,
                    pressure: req.query.pressureUnit as PressureUnit,
                    solarRadiation: req.query.solarRadiationUnit as SolarRadiationUnit,
                    temperature: req.query.temperatureUnit as TemperatureUnit
                });

                res.status(200).json({
                    success: true,
                    data: data
                });
            } catch (err) {
                return next(new APIError("Failed to access the current weather conditions from the database!", 500, err))
            }
        } else {
            return next(new APIError(result.array()[0].msg, 400, result))
        }
    }));

/* SET current weather conditions */
router.post('/', 
    // api key authentification
    protect("write"), 
    // request body validation
    checkExact(checkSchema(currentConditionsSchema, ["body"])),
    asyncHandler(async (req, res, next) => {
        const result = validationResult(req);

        if (result.isEmpty()) {
            const newCurrent = new CurrentConditions(req.body);

            try {
                log.debug("Validating updated current conditions...");
                await newCurrent.validate();
                current = newCurrent;
            } catch (err) {
                if(err instanceof mongoose.Error.ValidationError){
                    return next(new APIError("Invalid '" + err.errors[0] + "' value!", 400));
                }else{
                    return next(new APIError("Unknown error while validation!", 500, err));
                }
            }

            try{
                log.debug("Deleting old current conditions...");
                await CurrentConditions.deleteMany({});
            }catch(err){
                return next(new APIError("Error while deleting old current conditions!", 500, err));
            }

            log.debug("Saving new current conditions...");
            await newCurrent.save({ validateBeforeSave: false });
            try {
                res.status(201);
                res.json({
                    success: true,
                    status: 201
                });
            } catch (err) {
                return next(new APIError("Failed to save current conditions in the database!", 500, err));
            }
        } else {
            return next(new APIError(result.array()[0].msg, 400, result))
        }
    }));

export default router;
