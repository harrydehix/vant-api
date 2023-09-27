import * as dotenv from "dotenv";
import * as http from "http";
import * as https from "https";
import APISettings, { defaultAPISettings } from "./APISettings";
import MinimumAPISettings from "./MinimumAPISettings";
import merge from "lodash.merge";
import app from "../app";
import log, { configureLogger } from "../logger/api-logger";
import validator from "validator";
import { PressureUnit, RainUnit, RainUnits, SolarRadiationUnit, TemperatureUnit, WindUnit } from "vant-environment/units";
import APIUser, { APIUserRole, APIUserRoles } from "../models/APIUser";
import { Express } from "express";
import { Logger } from "winston";
import TypedEmitter from "typed-emitter"; 
import EventEmitter from "events";
import { DeepReadonly } from "ts-essentials";
import * as fs from "fs";
import mongoose from "mongoose";
import APIClosedError from "./APIClosedError";
import { makeDestroyable, DestroyableServer } from 'destroyable-server';



export type APIEvents = {
    /** Fires when the http server starts listening to incoming requests. */
    "start-server": (err?: Error) => void,
    /** Fires when the http server starts stops to incoming requests. */
    "stop-server": (err?: any) => void,
    /** Fires when the api is finally closed. */
    "close": (err?: any) => void,
    /** Fires when an error occurs. */
    error: (err: Error | any) => void
}

export class VantAPI extends (EventEmitter as new () => TypedEmitter<APIEvents>){
    /**
     * The api's settings. Change these by using {@link VantAPI.configure}.
     */
    public settings: APISettings;
    public log: Logger;
    public app: Express;
    public server?: DestroyableServer<http.Server | https.Server>;
    public closed: boolean = false;

    /**
     *  Holds the four base api keys which are generated while configuring the vant api for the first time.
     */
    public readonly keys: DeepReadonly<{
        [Property in APIUserRole]? : string
    }> = {};

    /**
     * @hidden
     */
    public constructor(){
        super();
        this.log = log;
        this.app = app;
        this.settings = defaultAPISettings;
    }

    /**
     * Configures the vant api. You can setup the default units, the used port and the logging behaviour.
     * Pass `{ useEnvironmentVariables: true }` to setup these settings using environment variables (e.g. stored in a `.env` file).
     * @param settings 
     */
    public async configure(settings: MinimumAPISettings){
        if(this.closed) throw new APIClosedError();

        if(this.server?.listening){
            log.warn("You are configuring the api while the server is already running. You must restart the server for the changes to take effect.");
        }

        this.settings = merge(this.settings, settings) as APISettings;

        if(this.settings.preferEnvironmentVariables){
            this.loadEnvironmentVariablesAndConfigureLogger();
        }else{
            configureLogger(this.settings);
        }

        await mongoose.connect(`${this.settings.mongoUri}/vant-db`);
        log.info("Successfully connected to database!");

        await this.generateAPIKeysIfNotExistent();

        app.set('port', settings.port);

        this.server = makeDestroyable(this.createServer());

        if(this.settings.autoStart){
            await this.startServer();
        }
    }

    /**
     * Stops the http server and closes the connection to the database. This action is **final**!
     */
    public async close(){
        if(this.closed) return;

        await this.stopServer();
        
        try{
            await mongoose.disconnect();
            log.warn("Disconnected from database!");
            this.emit("close");
        }catch(err){
            this.emit("close", err);
        }
        log.warn("Closed api!");

        this.closed = true;
    }


    /**
     * Starts the http server on the configured port. The promise resolves when the server starts listening for incoming requests.
     */
    public startServer(){
        if(this.closed) throw new APIClosedError();
        return new Promise<void>((resolve, reject) => {
            let resolved = false;
            this.server?.once("error", (err) => {
                if(!resolved){
                    this.emit("start-server", err);
                    log.error("Failed to start the vantage api server!");
                    reject(err);
                }
            })
            this.server?.listen(this.settings.port, () => {
                resolved = true;
                this.emit("start-server");
                log.info(`Successfully started the vant api server. Listening on port ${this.settings.port}!`);
                resolve();
            });
        })
    }

    /**
     * Stops the http server. If the server hasn't been started yet no error will occur (but a warning will be logged).
     */
    public async stopServer(){
        if(this.closed) throw new APIClosedError();

        log.info("Stopping vant api server...");
        try{
            await this.server?.destroy();
            log.info("Successfully stopped vant api server!");
            this.emit("stop-server");
        }catch(err){
            log.error("Error while stopping the vant api server!");
            log.error(err);
            this.emit("stop-server", err);
        }
    }

    /**
     * Generates a new api key for your api with the passed role. Once the key has been stored in the
     * database the promise resolves and the `uuidv4` key is returned as string.
     * 
     * **Role explanations** 
     * - `"read"`: One can use read routes only (requesting any kind of weather data)
     * - `"write"`: One can use write routes only (uploading new weather data using post requests)
     * - `"readwrite"`: Once can use all write and read routes.
     * - `"admin"`: One can use all write / read routes and generate new api keys.
     * @param role your desired role
     * @returns the uuidv4 api key as string
     */
    public async generateAPIKey(role: APIUserRole){
        if(this.closed) throw new APIClosedError();
        const user = await APIUser.createNew(role);
        await user.save();
        return user.key;
    }

    /**
     * @hidden
     */
    private createServer(){
        let server;
        if(this.settings.https){
            server = https.createServer({
                key: fs.readFileSync(this.settings.sslKeyFile),
                cert: fs.readFileSync(this.settings.sslCrtFile)
            }, app);
            log.info("Created a HTTPS server!");
        }else{
            server = http.createServer(app);
            log.info("Created a HTTP server!");
        }

        server.on('error', (err) => {
            this.emit("error", err);
        });

        return server;
    }

    /**
     * @hidden
     */
    private loadEnvironmentVariablesAndConfigureLogger(){
        /**
         * Load environment variables
         */
        let invalidEnvironmentVariables = [];
        
        dotenv.config();
        if(process.env.PORT && validator.isPort(process.env.PORT)){
            this.settings.port = parseInt(process.env.PORT);
        }else{
            invalidEnvironmentVariables.push("PORT");
        }

        if(process.env.MONGO_URI){
            this.settings.mongoUri = process.env.MONGO_URI;
        }else{
            invalidEnvironmentVariables.push("MONGO_URI");
        }

        if(process.env.AUTOSTART && validator.isBoolean(process.env.AUTOSTART)){
            this.settings.autoStart = process.env.AUTOSTART === "true";
        }else{
            invalidEnvironmentVariables.push("AUTOSTART");
        }

        if(process.env.LOG_LEVEL && validator.isIn(process.env.LOG_LEVEL, ["debug", "info", "warn", "error"])){
            this.settings.logLevel = process.env.LOG_LEVEL as any;
        }else{
            invalidEnvironmentVariables.push("LOG_LEVEL");
        }

        if(process.env.CONSOLE_LOG && validator.isBoolean(process.env.CONSOLE_LOG)){
            this.settings.consoleLog = process.env.CONSOLE_LOG === "true";
        }else{
            invalidEnvironmentVariables.push("CONSOLE_LOG");
        }

        if(process.env.FILE_LOG && validator.isBoolean(process.env.FILE_LOG)){
            this.settings.fileLog = process.env.FILE_LOG === "true";
        }else{
            invalidEnvironmentVariables.push("FILE_LOG");
        }

        if(process.env.LOG_ERROR_INFORMATION && validator.isBoolean(process.env.LOG_ERROR_INFORMATION)){
            this.settings.logErrorInformation = process.env.LOG_ERROR_INFORMATION === "true";
        }else{
            invalidEnvironmentVariables.push("LOG_ERROR_INFORMATION");
        }

        if(process.env.RAIN_UNIT && validator.isIn(process.env.RAIN_UNIT, RainUnits)){
            this.settings.units.rain = process.env.RAIN_UNIT as RainUnit;
        }else{
            invalidEnvironmentVariables.push("RAIN_UNIT");
        }

        if(process.env.TEMPERATURE_UNIT && validator.isIn(process.env.TEMPERATURE_UNIT, ["°F", "°C"])){
            this.settings.units.temperature = process.env.TEMPERATURE_UNIT as TemperatureUnit;
        }else{
            invalidEnvironmentVariables.push("TEMPERATURE_UNIT");
        }

        if(process.env.PRESSURE_UNIT && validator.isIn(process.env.PRESSURE_UNIT, ["inHg", "hPa", "mmHg", "mb"])){
            this.settings.units.pressure = process.env.PRESSURE_UNIT as PressureUnit;
        }else{
            invalidEnvironmentVariables.push("PRESSURE_UNIT");
        }

        if(process.env.SOLAR_RADIATION_UNIT &&  validator.isIn(process.env.SOLAR_RADIATION_UNIT, ["W/m²"])){
            this.settings.units.solarRadiation = process.env.SOLAR_RADIATION_UNIT as SolarRadiationUnit;
        }else{
            invalidEnvironmentVariables.push("SOLAR_RADIATION_UNIT");
        }

        if(process.env.WIND_UNIT && validator.isIn(process.env.WIND_UNIT, ["km/h", "mph", "ft/s", "knots", "Bft", "m/s"])){
            this.settings.units.wind = process.env.WIND_UNIT as WindUnit;
        }else{
            invalidEnvironmentVariables.push("WIND_UNIT");
        }

        if(process.env.HTTPS && validator.isBoolean(process.env.HTTPS)){
            this.settings.https = process.env.HTTPS === "true";
        }else{
            invalidEnvironmentVariables.push("HTTPS");
        }

        if(process.env.SSL_CRT_FILE){
            this.settings.sslCrtFile = process.env.SSL_CRT_FILE;
        }else{
            if(this.settings.https) invalidEnvironmentVariables.push("SSL_CRT_FILE");
        }

        if(process.env.SSL_KEY_FILE){
            this.settings.sslKeyFile = process.env.SSL_KEY_FILE;
        }else{
            if(this.settings.https) invalidEnvironmentVariables.push("SSL_KEY_FILE");
        }

        configureLogger(this.settings);
        
        for(const invalidEnvironmentVariable of invalidEnvironmentVariables){
            log.warn(`Environment variable '${invalidEnvironmentVariable}' is missing or invalid!`);
        }

        log.debug("Loaded environment variables!");
    }

    
    /**
     * @hidden
     */
    private async generateAPIKeysIfNotExistent(){
        for(const role of APIUserRoles){
            (this.keys[role] as any) = await this.generateApiKeyIfNotExistent(role);
        }
        log.info("You can generate more api keys using the '/api/v1/config/generate-key?role=role' route or by calling generateAPIKey(role)!");
    }

    /**
     * @hidden
     */
    private async generateApiKeyIfNotExistent(role: APIUserRole){
        try{
            let user = await APIUser.findOne({role: role});
            if(!user){
                user = await APIUser.createNew(role);
                await user.save();
            }
            log.info(`[${role}] API key is '${user.key}'`)
            return user.key;
        }catch(err){
            log.error(`Fatal error while generating ${role} api key!`);
            log.error(err);
            this.emit("error", err);
        }
    }
}

/**
 * Represents the vant api itself. Using this object you can...
 * - change the api's settings
 * - start and stop the http server
 * - generate additional api keys
 * - access the automatically generated base api keys
 * - listen to events
 * 
 * The vant api's endpoints are documented [here](https://harrydehix.github.io/vant-api/specification.html).
 * 
 * You can also access the vant api's internally used components (e.g. the http server object, the express app, ...) and make custom changes.
 * But be careful with it, otherwise the API won't work properly anymore. 
 */
const api = new VantAPI();

export default api;