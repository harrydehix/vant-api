import { VantPro2Interface, VantVueInterface } from "vantjs/interfaces";
import superagent from "superagent";
import RecorderSettings, { defaultRecorderSettings } from "./RecorderSettings";
import merge from "lodash.merge";
import MinimumRecorderSettings from "./MinimumRecorderSettings";
import dotenv from "dotenv";
import validator from "validator";
import log, { configureLogger } from "../logger/recorder-logger";
import { PressureUnit, RainUnit, SolarRadiationUnit, TemperatureUnit, WindUnit, PressureUnits, RainUnits, SolarRadiationUnits, TemperatureUnits, WindUnits } from "vant-environment/units";
import { AdvancedModels, BaudRates, RainCollectorSizes } from "vant-environment";

interface RealtimeRecorderSettings{
    readonly interval: number,
}

/**
 * Counter-part to the `startVantageAPI()` function.
 * Sends currently measured weather data repeatedly to the vant api.
 */
class Recorder {
    public readonly settings : RecorderSettings;
    public readonly interface : VantVueInterface | VantPro2Interface;

    private realtimeRecorderSettings? : RealtimeRecorderSettings;
    private realtimeRecorderTimeout? : NodeJS.Timeout;

    private constructor(settings: RecorderSettings, device: VantVueInterface | VantPro2Interface){
        this.settings = settings;
        this.interface = device;
    }

    /**
     * Creates a new recorder with the passed settings.
     * 
     * **Example**:
     * ```ts
     * // create recorder
     * const recorder = await Recorder.create({
     *      path: "COM5",
     *      api: "http://localhost:8000/api",
     *      rainCollectorSize: "0.2mm",
     *      model: "Pro2",
     *      ....
     * });
     * #
     * 
     * // configure realtime recordings
     * recorder.configureRealtimeRecording({ interval: 10 });
     * 
     * // start recorder
     * recorder.start();
     * ```
     * @param settings 
     * @returns 
     */
    public static create = async(settings: MinimumRecorderSettings) => {
        settings = merge(defaultRecorderSettings, settings);

        const invalidEnvironmentVariables = []
        if(settings.useEnvironmentVariables){
            dotenv.config();

            if(process.env.API && validator.isURL(process.env.API, {require_tld: false})){
                settings.api = process.env.API;
            }else{
                invalidEnvironmentVariables.push("API");
            }

            if(process.env.API_KEY){
                settings.key = process.env.API_KEY;
            }else{
                invalidEnvironmentVariables.push("API");
            }

            if(process.env.BAUD_RATE && validator.isIn(process.env.BAUD_RATE, BaudRates)){
                settings.baudRate = parseInt(process.env.BAUD_RATE!) as any;
            }else{
                invalidEnvironmentVariables.push("BAUD_RATE");
            }

            if(process.env.MODEL && validator.isIn(process.env.MODEL, AdvancedModels)){
                settings.model = process.env.MODEL as any;
            }else{
                invalidEnvironmentVariables.push("MODEL");
            }

            if(process.env.SERIAL_PATH){
                settings.path = process.env.SERIAL_PATH;
            }else{
                invalidEnvironmentVariables.push("SERIAL_PATH");
            }

            if(process.env.LOG_LEVEL && validator.isIn(process.env.LOG_LEVEL, ["debug", "info", "warn", "error"])){
                settings.logLevel = process.env.LOG_LEVEL as any;
            }else{
                invalidEnvironmentVariables.push("LOG_LEVEL");
            }

            if(process.env.RAIN_COLLECTOR_SIZE && validator.isIn(process.env.RAIN_COLLECTOR_SIZE, RainCollectorSizes)){
                settings.rainCollectorSize = process.env.RAIN_COLLECTOR_SIZE as any;
            }else{
                invalidEnvironmentVariables.push("RAIN_COLLECTOR_SIZE");
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
                settings.units!.rain = process.env.RAIN_UNIT as RainUnit;
            }else{
                invalidEnvironmentVariables.push("RAIN_UNIT");
            }

            if(process.env.TEMPERATURE_UNIT && validator.isIn(process.env.TEMPERATURE_UNIT, TemperatureUnits)){
                settings.units!.temperature = process.env.TEMPERATURE_UNIT as TemperatureUnit;
            }else{
                invalidEnvironmentVariables.push("TEMPERATURE_UNIT");
            }

            if(process.env.PRESSURE_UNIT && validator.isIn(process.env.PRESSURE_UNIT, PressureUnits)){
                settings.units!.pressure = process.env.PRESSURE_UNIT as PressureUnit;
            }else{
                invalidEnvironmentVariables.push("PRESSURE_UNIT");
            }

            if(process.env.SOLAR_RADIATION_UNIT &&  validator.isIn(process.env.SOLAR_RADIATION_UNIT, SolarRadiationUnits)){
                settings.units!.solarRadiation = process.env.SOLAR_RADIATION_UNIT as SolarRadiationUnit;
            }else{
                invalidEnvironmentVariables.push("SOLAR_RADIATION_UNIT");
            }

            if(process.env.WIND_UNIT && validator.isIn(process.env.WIND_UNIT, WindUnits)){
                settings.units!.wind = process.env.WIND_UNIT as WindUnit;
            }else{
                invalidEnvironmentVariables.push("WIND_UNIT");
            }
        }

        configureLogger(settings as RecorderSettings);

        if(settings.useEnvironmentVariables){
            for(const invalidEnvironmentVariable of invalidEnvironmentVariables){
                log.warn(`Invalid or missing environment variable '${invalidEnvironmentVariable}'!`)
            }
        }

        if(settings.useEnvironmentVariables){
         log.debug("Loaded environment variables!");
    }

        if(!settings.path){
            log.error("No serial path specified! Exiting...");
            process.exit(-1);
        }

        if(!settings.rainCollectorSize){
            log.error("No rain collector size specified! Exiting...");
            process.exit(-1);
        }

        if(!settings.api){
            log.error("No api url specified! Exiting...");
            process.exit(-1);
        }

        if(!settings.baudRate){
            log.error("No baud rate specified! Exiting...");
            process.exit(-1);
        }

        if(!settings.model){
            log.error("No weather station model specified! Exiting...");
            process.exit(-1);
        }

        let device;
        if(settings.model === "Pro2"){
            device = await VantPro2Interface.create({
                path: settings.path!,
                rainCollectorSize: settings.rainCollectorSize!,
            });
        }else{
            device = await VantVueInterface.create({
                path: settings.path!,
                rainCollectorSize: settings.rainCollectorSize!,
            });
        }

        return new Recorder(settings as RecorderSettings, device);
    }

    configureRealtimeRecordings = (settings : RealtimeRecorderSettings) => {
        this.realtimeRecorderSettings = settings;
    }

    public realtimeRecordingsEnabled = () => this.realtimeRecorderSettings !== undefined;
    public getRealtimeRecordingsInterval = () => this.realtimeRecorderSettings?.interval;

    public start = () => {
        log.info("Started recorder!")
        if (this.realtimeRecorderSettings) { 
            this.newRealtimeRecording();
        }
    }

    public stop = () => {
        log.info("Stopped recorder!")
        clearTimeout(this.realtimeRecorderTimeout);
    }

    newRealtimeRecording = async() => {
        const record = await this.interface.getRichRealtimeData();

        // TODO: Send http POST request to API
        log.info("New realtime record (" + record.time + ")");
        superagent
            .post(this.settings.api + "/v1/current")
            .send(record)
            .set('accept', 'json')
            .set('x-api-key', this.settings.key)
            .end((err, res: superagent.Response) => {
                if(!res || !res.ok){
                    log.error("Failed to send realtime record!");  
                    if(res && res.body && res.body.message){
                        log.error("Server message: '" + res.body.message + "'");
                    }else{
                        log.error("Is your api running?");
                    }
                }else{
                    log.debug("Sent realtime record (" + record.time + ") successfully!");
                }
            });

        const newRecordTime = new Date(record.time);
        newRecordTime.setSeconds(record.time.getSeconds() + this.realtimeRecorderSettings?.interval!);
        newRecordTime.setMilliseconds(0);
        const timeoutTime = newRecordTime.getTime() - record.time.getTime();
        this.realtimeRecorderTimeout = setTimeout(this.newRealtimeRecording, timeoutTime);
    }
}

export default Recorder;