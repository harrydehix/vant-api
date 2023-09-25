import { UnitConfiguration } from "vant-environment/units";

type MinimumAPISettings = {
    /** The API's port number. Default is `8000`. Corresponding environment variable: `PORT`. */
    port?: number,
    /** The default units. **Important**: Weather data uploads have to use these units! Corresponding environment variables: `RAIN_UNIT`, `TEMPERATURE_UNIT`, ...  */
    units?: Partial<UnitConfiguration>,
    /** The minimimum log level that will be output. Default is `"info"`. Corresponding environment variable: `LOG_LEVEL` */
    logLevel?: "debug" | "info" | "warn" | "error",
    /** Whether the console log is enabled. Default is `true`. Corresponding environment variable: `CONSOLE_LOG` */
    consoleLog?: boolean,
    /** Whether file logging is enabled. Default is `true`. Corresponding environment variable: `FILE_LOG` */
    fileLog?: boolean,
    /** Whether to prefer environment variables to configure the api. Default is `false`.  */
    preferEnvironmentVariables?: boolean,
    /** Whether to log detailed error information. Default is `true`. Corresponding environment variable: `LOG_ERROR_INFORMATION` */
    logErrorInformation?: boolean,
    /** Whether to use https. Default is `false`. Corresponding environment variable: `HTTPS` */
    https?: boolean,
    /** The path to your ssl public certificate. Corresponding environment variable: `SSL_CRT_FILE` */
    sslCrtFile?: string,
    /** The path to your ssl private key. Corresponding environment variable: `SSL_KEY_FILE` */
    sslKeyFile?: string,
}

export default MinimumAPISettings;