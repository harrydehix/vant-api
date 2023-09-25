import winston from "winston";
import { inspect } from "util";
import RecorderSettings from "../recorder/settings/RecorderSettings";
import 'winston-daily-rotate-file';

const consoleTransport = new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({all: true}),
                winston.format.label({label: "vant-recorder"}),
                winston.format.timestamp(),
                winston.format.printf(
                    (info) => `${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`
                )
            )
        });

const fileTransport = new winston.transports.DailyRotateFile({ 
            filename: 'vant-recorder-%DATE%.log', 
            datePattern: 'YYYY-MM-DD-HH',
            maxSize: '20m',
            maxFiles: '14d',
            format: winston.format.combine(
                winston.format.label({label: "vant-recorder"}),
                winston.format.timestamp(),
                winston.format.printf(
                    (info) => `${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`
                )
            )
        });

const logger = winston.createLogger({
    silent: true,
});

export function configureLogger(settings: RecorderSettings){
    const transports = [];
    if(settings.consoleLog){
        transports.push(consoleTransport);
    }

    if(settings.fileLog){
        transports.push(fileTransport)
    }
    
    logger.clear();
    logger.configure({
        level: settings.logLevel,
        transports: transports,
    });

    
    (logger as any).error = (err: any) => {
        if (err instanceof Error) {
            err = err as any;
            logger.log({ level: 'error', message: 
                settings.logErrorInformation ? `${err.status ? `[${err.status}]` : ' '} ${err.stack || err}` : `${err.status ? `[${err.status}]` : ' '} ${err.message}`});
            if(err.details && settings.logErrorInformation){
                logger.log({ level: 'error', message: `Error details: ${inspect(err.details, false, null, false)}`});
            }
        } else {
            logger.log({ level: 'error', message: err });
        }
    };

    logger.info("Configured logger!");
}

export default logger;