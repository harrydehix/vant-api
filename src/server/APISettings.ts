import { PressureUnits } from "vantjs/dist/units/PressureUnits"
import { RainUnits } from "vantjs/dist/units/RainUnits"
import { UnitSettings } from "vantjs/dist/units/UnitSettings"
import { WindUnits } from "vantjs/dist/units/WindUnits"
import MinimumAPISettings from "./MinimumAPISettings";

type Modifiable<T> = { -readonly [P in keyof T]: Modifiable<T[P]> };

export default interface APISettings {
    /** The API's port number. Default is `8000`. Corresponding environment variable: `PORT`. */
    port: number,
    /** The default units. **Important**: Weather data uploads have to use these units! Corresponding environment variables: `RAIN_UNIT`, `TEMPERATURE_UNIT`, ...  */
    units: Modifiable<UnitSettings>,
    /** The minimimum log level that will be output. Default is `"info"`. Corresponding environment variable: `LOG_LEVEL` */
    logLevel: "debug" | "info" | "warn" | "error",
    /** Whether the console log is enabled. Default is `true`. Corresponding environment variable: `CONSOLE_LOG` */
    consoleLog: boolean,
    /** Whether file logging is enabled. Default is `true`. Corresponding environment variable: `FILE_LOG` */
    fileLog: boolean,
    /** Whether to prefer the API configuration in the `.env`-file. Default is `false`.  */
    useEnvironmentVariables: boolean,
    /** Whether to log detailed error information. Default is `true`. Corresponding environment variable: `LOG_ERROR_INFORMATION´ */
    logErrorInformation: boolean,
}

export const defaultAPISettings : MinimumAPISettings = {
    port: 8000,
    logLevel: "info",
    consoleLog: true,
    fileLog: true,
    useEnvironmentVariables: false,
    logErrorInformation: true,
    units: {
        rain: "in",
        wind: "mph",
        solarRadiation: "W/m²",
        temperature: "°F",
        pressure: "inHg"
    }
}