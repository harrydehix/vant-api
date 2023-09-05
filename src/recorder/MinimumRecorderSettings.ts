import { AdvancedModel, BaudRate } from "vant-environment";
import { UnitConfiguration } from "vant-environment/units";
import { UnitSettings } from "vantjs/dist/units/UnitSettings";
import { VantPro2Interface, VantVueInterface } from "vantjs/interfaces";
import { RainCollectorSize } from "vantjs/interfaces/settings";


export default interface MinimumRecorderSettings{
    /** The URL to the api. E.g. `http://localhost:8000/api`. Corresponding environment variable: `API`  */
    api?: string,
    /** The weather station model. Default is `PRO 2`. Corresponding environment variable: `MODEL` */
    model?: AdvancedModel,
    /** The serial path to the weather station. E.g. `COM3`. Corresponding environment variable: `SERIAL_PATH` */
    path?: string,
    /** The default units. **Important**: Has to match the configured vant-api units! Corresponding environment variables: `RAIN_UNIT`, `TEMPERATURE_UNIT`, ...  */
    units?: Partial<UnitConfiguration>,
    /** The baud rate to use. Default is `19200`. This has to match your weather station's settings! Corresponding environment variable: `BAUD_RATE` */
    baudRate?: BaudRate,
    /** Whether to prefer environment variables configured in the `.env` file. Default is `false`. */
    useEnvironmentVariables?: boolean,
    /** The minimimum log level that will be output. Default is `"info"`. Corresponding environment variable: `LOG_LEVEL` */
    logLevel?: "debug" | "info" | "warn" | "error",
    /** Whether the console log is enabled. Default is `true`. Corresponding environment variable: `CONSOLE_LOG` */
    consoleLog?: boolean,
    /** Whether file logging is enabled. Default is `true`. Corresponding environment variable: `FILE_LOG` */
    fileLog?: boolean,
    /** Whether to log detailed error information. Default is `true`. Corresponding environment variable: `LOG_ERROR_INFORMATION´ */
    logErrorInformation?: boolean,
    /** The weather station's rain collector size. Corresponding environment variable: `RAIN_COLLECTOR_SIZE` */
    rainCollectorSize?: RainCollectorSize,
}
