import { defaultUnitSettings, UnitConfiguration } from "vant-environment/units";
import { AdvancedModel, BaudRate, RainCollectorSize } from "vant-environment";
import Recorder from "../Recorder";
import LogLevel from "../../logger/LogLevel";

/**
 * The general settings for the recorder. For example this includes the `url` to your running _vant-api_ instance or the serial `path` to your connected weather station.
 * 
 * To configure the current conditions task call {@link Recorder.configureCurrentConditionsTask}.
 */
export default interface RecorderSettings{
    /** The URL to the api. E.g. `http://localhost:8000/api`. Corresponding environment variable: `API`  */
    api: string,
    /** The api key used to communicate with the api. Corresponding environment variable: `API_KEY` */
    key: string,
    /** The weather station model. Default is `PRO2`. Corresponding environment variable: `MODEL` */
    model: AdvancedModel,
    /** The serial path to the weather station. E.g. `COM3`. Corresponding environment variable: `SERIAL_PATH` */
    path: string,
    /** The default units. **Important**: Has to match the configured vant-api units! Corresponding environment variables: `RAIN_UNIT`, `TEMPERATURE_UNIT`, ...  */
    units: UnitConfiguration,
    /** The baud rate to use. Default is `19200`. This has to match your weather station's settings! Corresponding environment variable: `BAUD_RATE` */
    baudRate: BaudRate,
    /** Whether to prefer environment variables configured in the `.env` file. Default is `false`. */
    preferEnvironmentVariables: boolean,
    /** The minimimum log level that will be output. Default is `"info"`. Corresponding environment variable: `LOG_LEVEL` */
    logLevel: LogLevel,
    /** Whether the console log is enabled. Default is `true`. Corresponding environment variable: `CONSOLE_LOG` */
    consoleLog: boolean,
    /** Whether file logging is enabled. Default is `true`. Corresponding environment variable: `FILE_LOG` */
    fileLog: boolean,
    /** Whether to log detailed error information. Default is `true`. Corresponding environment variable: `LOG_ERROR_INFORMATION´ */
    logErrorInformation: boolean,
    /** The weather station's rain collector size. */
    rainCollectorSize?: RainCollectorSize,
}

/**
 * The default recorder settings.
 */
export const defaultRecorderSettings : RecorderSettings = {
    api: "",
    key: "",
    path: "",
    model: "Pro2",
    baudRate: 19200,
    preferEnvironmentVariables: false,
    logLevel: "info",
    consoleLog: true,
    fileLog: true,
    logErrorInformation: true,
    units: defaultUnitSettings
} 

/**
 * The settings for the current conditions task. This is related to the `api/v1/current` route.
 * Call {@link Recorder.configureCurrentConditionsTask} to configure. If your recorder is already running you have to restart it using `restart()`.
 */
export interface CurrentConditionsTaskSettings{
    /** The update interval as integer (in seconds) for the current conditions. Default value is `1` (which is the minimum). Corresponding environment variable: `CURRENT_CONDITIONS_INTERVAL` */
    interval: number,
    /** Whether to prefer environment variables configured in the `.env` file. Default is `false`. */
    useEnvironmentVariables: boolean,
}

/**
 * The default settings for the current conditions task.
 */
export const defaultCurrentConditionsTaskSettings : CurrentConditionsTaskSettings = {
    interval: 1,
    useEnvironmentVariables: false
}