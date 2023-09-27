import { defaultLoggerSettings, LoggerSettings } from "vant-environment/log";
import { UnitConfiguration } from "vant-environment/units";
import { LoggerOptions } from "winston";
import MinimumAPISettings from "./MinimumAPISettings";

export default interface APISettings {
    /** The API's port number. Default is `8000`. Corresponding environment variable: `PORT`. */
    port: number,
    /** The default units. **Important**: Weather data uploads have to use these units! Corresponding environment variables: `RAIN_UNIT`, `TEMPERATURE_UNIT`, ...  */
    units: UnitConfiguration,
    /** Configures the logging behaviour. */
    logOptions: LoggerSettings,
    /** Whether to prefer environment variables to configure the api. Settings passed directly are still preferred. Default is `false`.  */
    preferEnvironmentVariables: boolean,
    /** Whether to use https. Default is `false`. Corresponding environment variable: `HTTPS` */
    https: boolean,
    /** The path to your ssl public certificate. Corresponding environment variable: `SSL_CRT_FILE` */
    sslCrtFile: string,
    /** The path to your ssl private key. Corresponding environment variable: `SSL_KEY_FILE` */
    sslKeyFile: string,
    /** The connection string used to connect to mongodb. Default is `mongodb://127.0.0.1:27017`. Corresponding environment variable: `MONGO_URI` */
    mongoUri: string,
    /** Whether the api should automatically start the http(s) server after being configured. Default is `true`. Corresponding environment variable: `AUTOSTART`. */
    autoStart: boolean,
}

export const defaultAPISettings : APISettings = {
    autoStart: true,
    mongoUri: "mongodb://127.0.0.1:27017",
    https: false,
    sslCrtFile: "",
    sslKeyFile: "",
    port: 8000,
    logOptions: defaultLoggerSettings,
    preferEnvironmentVariables: false,
    units: {
        rain: "in",
        wind: "mph",
        solarRadiation: "W/m²",
        temperature: "°F",
        pressure: "inHg"
    },
}