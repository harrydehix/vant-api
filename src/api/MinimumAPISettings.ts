import { MinimumLoggerSettings } from "vant-environment/log";
import { UnitConfiguration } from "vant-environment/units";

type MinimumAPISettings = {
    /** The API's port number. Default is `8000`. Corresponding environment variable: `PORT`. */
    port?: number,
    /** The default units. **Important**: Weather data uploads have to use these units! Corresponding environment variables: `RAIN_UNIT`, `TEMPERATURE_UNIT`, ...  */
    units?: Partial<UnitConfiguration>,
    /** Configures the logging behaviour. */
    logOptions?: MinimumLoggerSettings,
    /** Whether to prefer environment variables to configure the api. Default is `false`.  */
    preferEnvironmentVariables?: boolean,
    /** Whether to use https. Default is `false`. Corresponding environment variable: `HTTPS` */
    https?: boolean,
    /** The path to your ssl public certificate. Corresponding environment variable: `SSL_CRT_FILE` */
    sslCrtFile?: string,
    /** The path to your ssl private key. Corresponding environment variable: `SSL_KEY_FILE` */
    sslKeyFile?: string,
    /** The connection string used to connect to mongodb. Default is `mongodb://127.0.0.1:27017`. Corresponding environment variable: `MONGO_URI` */
    mongoUri?: string,
    /** Whether the api should automatically start the http(s) server after being configured. Default is `true`. Corresponding environment variable: `AUTOSTART`. */
    autoStart?: boolean,
}

export default MinimumAPISettings;