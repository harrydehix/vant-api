import * as dotenv from "dotenv";
import * as http from "http";
import APISettings, { defaultAPISettings } from "./APISettings";
import MinimumAPISettings from "./MinimumAPISettings";
import merge from "lodash.merge";
import app from "../app";
import log, { configureLogger } from "../logger/api-logger";
import validator from "validator";
import { PressureUnit, RainUnit, RainUnits, SolarRadiationUnit, TemperatureUnit, WindUnit } from "vant-environment/units";


function startVantageAPI(apiSettings: MinimumAPISettings){
    const settings = merge(defaultAPISettings, apiSettings) as APISettings;
    /**
     * Load environment variables
     */
    let invalidEnvironmentVariables = [];
    if(settings.useEnvironmentVariables){
        dotenv.config();
        if(process.env.PORT && validator.isPort(process.env.PORT)){
            settings.port = parseInt(process.env.PORT);
        }else{
            invalidEnvironmentVariables.push("PORT");
        }

        if(process.env.LOG_LEVEL && validator.isIn(process.env.LOG_LEVEL, ["debug", "info", "warn", "error"])){
            settings.logLevel = process.env.LOG_LEVEL as any;
        }else{
            invalidEnvironmentVariables.push("LOG_LEVEL");
        }

        if(process.env.CONSOLE_LOG && validator.isBoolean(process.env.CONSOLE_LOG)){
            settings.consoleLog = process.env.CONSOLE_LOG === "true";
        }else{
            invalidEnvironmentVariables.push("CONSOLE_LOG");
        }

        if(process.env.FILE_LOG && validator.isBoolean(process.env.FILE_LOG)){
            settings.fileLog = process.env.FILE_LOG === "true";
        }else{
            invalidEnvironmentVariables.push("FILE_LOG");
        }

        if(process.env.LOG_ERROR_INFORMATION && validator.isBoolean(process.env.LOG_ERROR_INFORMATION)){
            settings.logErrorInformation = process.env.LOG_ERROR_INFORMATION === "true";
        }else{
            invalidEnvironmentVariables.push("LOG_ERROR_INFORMATION");
        }

        if(process.env.RAIN_UNIT && validator.isIn(process.env.RAIN_UNIT, RainUnits)){
            settings.units.rain = process.env.RAIN_UNIT as RainUnit;
        }else{
            invalidEnvironmentVariables.push("RAIN_UNIT");
        }

        if(process.env.TEMPERATURE_UNIT && validator.isIn(process.env.TEMPERATURE_UNIT, ["°F", "°C"])){
            settings.units.temperature = process.env.TEMPERATURE_UNIT as TemperatureUnit;
        }else{
            invalidEnvironmentVariables.push("TEMPERATURE_UNIT");
        }

        if(process.env.PRESSURE_UNIT && validator.isIn(process.env.PRESSURE_UNIT, ["inHg", "hPa", "mmHg", "mb"])){
            settings.units.pressure = process.env.PRESSURE_UNIT as PressureUnit;
        }else{
            invalidEnvironmentVariables.push("PRESSURE_UNIT");
        }

        if(process.env.SOLAR_RADIATION_UNIT &&  validator.isIn(process.env.SOLAR_RADIATION_UNIT, ["W/m²"])){
            settings.units.solarRadiation = process.env.SOLAR_RADIATION_UNIT as SolarRadiationUnit;
        }else{
            invalidEnvironmentVariables.push("SOLAR_RADIATION_UNIT");
        }

        if(process.env.WIND_UNIT && validator.isIn(process.env.WIND_UNIT, ["km/h", "mph", "ft/s", "knots", "Bft", "m/s"])){
            settings.units.wind = process.env.WIND_UNIT as WindUnit;
        }else{
            invalidEnvironmentVariables.push("WIND_UNIT");
        }
    }

    configureLogger(settings);


    for(const invalidEnvironmentVariable of invalidEnvironmentVariables){
        log.warn(`Environment variable '${invalidEnvironmentVariable}' is missing or invalid!`);
    }

    if(settings.useEnvironmentVariables){
         log.debug("Loaded environment variables!");
    }

    app.set('port', settings.port);

    /**
     * Create HTTP server.
     */
    const server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(settings.port);
    server.on('error', (err) => {
        log.error("Fatal error while starting the vant api server!");
        log.error(err);
        process.exit(-1);
    });
    server.on('listening', ()=>{
        log.info(`Successfully started vant-api server on port ${settings.port}!`);
    });
}


export default startVantageAPI;