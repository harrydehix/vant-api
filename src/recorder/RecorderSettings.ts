import { UnitSettings, UnitConfiguration } from "vant-environment/units";
import { RainCollectorSize } from "vant-environment";
import { VantPro2Interface, VantVueInterface } from "vantjs/interfaces";


export default interface RecorderSettings{
    /** The URL to the api. E.g. `http://localhost:8000/api`. Corresponding environment variable: `API`  */
    api: string,
    /** The weather station model. Default is `PRO2`. Corresponding environment variable: `MODEL` */
    model: "VUE" | "PRO2",
    /** The serial path to the weather station. E.g. `COM3`. Corresponding environment variable: `SERIAL_PATH` */
    path: string,
    /** The default units. **Important**: Has to match the configured vant-api units! Corresponding environment variables: `RAIN_UNIT`, `TEMPERATURE_UNIT`, ...  */
    units: UnitConfiguration,
    /** The baud rate to use. Default is `19200`. This has to match your weather station's settings! Corresponding environment variable: `BAUD_RATE` */
    baudRate: 1200 | 2400 | 4800 | 9600 | 14400 | 19200,
    /** Whether to prefer environment variables configured in the `.env` file. Default is `false`. */
    useEnvironmentVariables: boolean,
    /** The minimimum log level that will be output. Default is `"info"`. Corresponding environment variable: `LOG_LEVEL` */
    logLevel: "debug" | "info" | "warn" | "error",
    /** Whether the console log is enabled. Default is `true`. Corresponding environment variable: `CONSOLE_LOG` */
    consoleLog: boolean,
    /** Whether file logging is enabled. Default is `true`. Corresponding environment variable: `FILE_LOG` */
    fileLog: boolean,
    /** Whether to log detailed error information. Default is `true`. Corresponding environment variable: `LOG_ERROR_INFORMATION´ */
    logErrorInformation: boolean,
    /** The weather station's rain collector size. */
    rainCollectorSize?: RainCollectorSize,
}

export const defaultRecorderSettings : Partial<RecorderSettings> = {
    model: "PRO2",
    baudRate: 19200,
    useEnvironmentVariables: false,
    logLevel: "info",
    consoleLog: true,
    fileLog: true,
    logErrorInformation: true,
    units: {
        rain: "in",
        wind: "mph",
        solarRadiation: "W/m²",
        temperature: "°F",
        pressure: "inHg"
    }
} 