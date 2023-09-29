import express, {Request, Response, NextFunction } from "express";
import { body, query, param, validationResult, checkSchema, checkExact, ValidationError, Result }  from "express-validator";
import CurrentConditions, { CurrentConditionsElement, CurrentConditionsElements, IntervalDescriptor, IntervalDescriptors, intervalOf } from "../models/CurrentConditions";
import APIError from "../error-handling/APIError";
import asyncHandler from "../error-handling/asyncHandler";
import currentConditionsSchema from "../validation/currentConditionsSchema";
import mongoose, { Types } from "mongoose";
import log from "../log";
import { PressureUnit, RainUnit, SolarRadiationUnit, TemperatureUnit, WindUnit } from "vant-environment/units";
import protect from "../security/protect";
import recorder from "../recorder";
import validateUnits from "../validation/validateUnits";

const router = express.Router();

router.get(['/element/:element/:interval', '/element/:element'],
    protect("read"),
    ...validateUnits,
    param("interval").default("live" as IntervalDescriptor).isIn(IntervalDescriptors).withMessage("Invalid or missing interval entered!"),
    param("element").isIn(CurrentConditionsElements).withMessage("Invalid weather element!"),
    asyncHandler(async (req, res, next) => {
        const result : Result<ValidationError> = validationResult(req);

        if(result.isEmpty()){
            const records = await CurrentConditions.find({ interval: intervalOf(req.params.interval as IntervalDescriptor) || 0 }).sort({
                time: "asc",
            }).select({
                _id: 0,
                time: 1,
                [req.params.element]: 1,
            });

            if(records.length === 0){
                return next(new APIError("No current weather conditions available. This error usually happens if no weather data hasn't been uploaded!", 503));
            }

            const results = [];
            for(let i = 0; i < records.length; ++i){
                records[i].changeUnits({
                    rain: req.query.rain as RainUnit,
                    wind: req.query.wind as WindUnit,
                    temperature: req.query.temperature as TemperatureUnit,
                    solarRadiation: req.query.solarRadiation as SolarRadiationUnit,
                    pressure: req.query.pressure as PressureUnit
                });

                const result = Object.assign(records[i].toJSON()) as any;
                result.value = result[req.params.element as CurrentConditionsElement];
                result[req.params.element] = undefined;
                
                results.push(result);
            }

            res.status(200);
            res.json({
                success: true,
                data: (req.params.interval as IntervalDescriptor) === "live" ? results[0] : results,
            });
        }else{
            return next(new APIError(result.array()[0].msg, 400, result));
        }
    })
);

/* GET current weather conditions */
router.get(['/', '/:interval'],
    protect("read"),
    ...validateUnits,
    param("interval").default("live" as IntervalDescriptor).isIn(IntervalDescriptors).withMessage("Invalid or missing interval entered!"),
    asyncHandler(async (req, res, next) => {
        const result = validationResult(req);

        if (result.isEmpty()) {
            try {
                const records = await CurrentConditions.find({ interval: intervalOf(req.params.interval as IntervalDescriptor) }).sort({
                    time: "asc",
                }).select("-_id -__v");

                if (records.length == 0) {
                    return next(new APIError("No current weather conditions available. This error usually happens if no weather data hasn't been uploaded!", 503))
                }
                
                log.debug("Changing units...");
                for(const record of records){
                    record.changeUnits({
                        rain: req.query.rainUnit as RainUnit,
                        wind: req.query.windUnit as WindUnit,
                        pressure: req.query.pressureUnit as PressureUnit,
                        solarRadiation: req.query.solarRadiationUnit as SolarRadiationUnit,
                        temperature: req.query.temperatureUnit as TemperatureUnit
                    });
                }

                res.status(200).json({
                    success: true,
                    data: (req.params.interval as IntervalDescriptor) === "live" ? records[0] : records,
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
            const currentConditions = new CurrentConditions(req.body);

            try {
                log.debug("Validating ingoing current conditions...");
                await currentConditions.validate();
            } catch (err) {
                if(err instanceof mongoose.Error.ValidationError){
                    return next(new APIError("Invalid '" + err.errors[0] + "' value!", 400));
                }else{
                    return next(new APIError("Unknown error while validation!", 500, err));
                }
            }

            try{
                await recorder.process(currentConditions);
            } catch(err){
                return next(new APIError("Error while processing record!", 500, err));
            }

            res.status(201);
            res.json({
                success: true,
                status: 201
            });
        } else {
            return next(new APIError(result.array()[0].msg, 400, result))
        }
    }));

export default router;
