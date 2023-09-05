import { UnitSettings } from "vantjs/dist/units/UnitSettings";

export default interface MinimumAPISettings{
    /** The API's port number. Default is `8000`. Corresponding environment variable: `PORT`. */
    port?: number,
    /** The default units. **Important**: Weather data uploads have to use these units! Corresponding environment variables: `RAIN_UNIT`, `TEMPERATURE_UNIT`, ...  */
    units?: Partial<UnitSettings>,
    /** The minimimum log level that will be output. Default is `"info"`. Corresponding environment variable: `LOG_LEVEL` */
    logLevel?: "debug" | "info" | "warn" | "error",
    /** Whether the console log is enabled. Default is `true`. Corresponding environment variable: `CONSOLE_LOG` */
    consoleLog?: boolean,
    /** Whether file logging is enabled. Default is `true`. Corresponding environment variable: `FILE_LOG` */
    fileLog?: boolean,
    /** Whether to prefer the API configuration in the `.env`-file. Default is `false`.  */
    useEnvironmentVariables?: boolean,
    /** Whether to log detailed error information. Default is `true`. */
    logErrorInformation?: boolean,
}