declare const _default: {
    altimeter: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    chill: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    consoleBatteryVoltage: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    dewpoint: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    etDay: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    etMonth: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    etYear: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    forecast: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isString: boolean;
        errorMessage: string;
    };
    forecastID: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isInt: boolean;
        errorMessage: string;
    };
    forecastRule: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isInt: boolean;
        errorMessage: string;
    };
    heat: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    humExtra: {
        isArray: {
            options: {
                min: number;
                max: number;
            };
        };
        errorMessage: string;
    };
    humIn: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    humOut: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    leafTemps: {
        isArray: {
            options: {
                min: number;
                max: number;
            };
        };
        errorMessage: string;
    };
    leafWetnesses: {
        isArray: {
            options: {
                min: number;
                max: number;
            };
        };
        errorMessage: string;
    };
    press: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    pressAbs: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    pressCalibrationOffset: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    pressRaw: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    pressReductionMethod: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isString: boolean;
        errorMessage: string;
    };
    pressReductionMethodID: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isInt: boolean;
        errorMessage: string;
    };
    pressTrend: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isString: boolean;
        errorMessage: string;
    };
    pressTrendID: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isInt: boolean;
        errorMessage: string;
    };
    pressUserOffset: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    rain15m: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    rain1h: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    rain24h: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    rainDay: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    rainMonth: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    rainRate: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    rainYear: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    soilMoistures: {
        isArray: {
            options: {
                min: number;
                max: number;
            };
        };
        errorMessage: string;
    };
    soilTemps: {
        isArray: {
            options: {
                min: number;
                max: number;
            };
        };
        errorMessage: string;
    };
    solarRadiation: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    stormRain: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    stormStartDate: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isString: boolean;
        errorMessage: string;
    };
    sunrise: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isString: boolean;
        errorMessage: string;
    };
    sunset: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isString: boolean;
        errorMessage: string;
    };
    tempExtra: {
        isArray: {
            options: {
                min: number;
                max: number;
            };
        };
        errorMessage: string;
    };
    tempIn: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    tempOut: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    thsw: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    time: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isISO8601: boolean;
        errorMessage: string;
    };
    transmitterBatteryStatus: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isInt: boolean;
        errorMessage: string;
    };
    uv: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    wind: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    windAvg10m: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    windAvg2m: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    windDir: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isString: boolean;
        errorMessage: string;
    };
    windDirDeg: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isInt: boolean;
        errorMessage: string;
    };
    windGust: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isFloat: boolean;
        errorMessage: string;
    };
    windGustDir: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isString: boolean;
        errorMessage: string;
    };
    windGustDirDeg: {
        optional: {
            options: {
                nullable: boolean;
            };
        };
        isInt: boolean;
        errorMessage: string;
    };
};
export default _default;
