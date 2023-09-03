"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Validates on a basic low level (only the datatype is checked)
exports.default = {
    altimeter: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid altimeter value!",
    },
    chill: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid chill value!",
    },
    consoleBatteryVoltage: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid consoleBatteryVoltage value!",
    },
    dewpoint: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid dewpoint value!",
    },
    etDay: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid etDay value!",
    },
    etMonth: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid etMonth value!",
    },
    etYear: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid etYear value!",
    },
    forecast: {
        optional: {
            options: {
                nullable: true
            }
        },
        isString: true,
        errorMessage: "Invalid forecast value!",
    },
    forecastID: {
        optional: {
            options: {
                nullable: true
            }
        },
        isInt: true,
        errorMessage: "Invalid forecastID value!",
    },
    forecastRule: {
        optional: {
            options: {
                nullable: true
            }
        },
        isInt: true,
        errorMessage: "Invalid forecastRule value!",
    },
    heat: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid heat value!",
    },
    humExtra: {
        isArray: {
            options: {
                min: 7,
                max: 7
            }
        },
        errorMessage: "Invalid humExtra value!",
    },
    humIn: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid humIn value!",
    },
    humOut: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid humOut value!",
    },
    leafTemps: {
        isArray: {
            options: {
                min: 4,
                max: 4
            }
        },
        errorMessage: "Invalid leafTemps value!",
    },
    leafWetnesses: {
        isArray: {
            options: {
                min: 4,
                max: 4
            }
        },
        errorMessage: "Invalid leafWetnesses value!",
    },
    press: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid press value!",
    },
    pressAbs: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid pressAbs value!",
    },
    pressCalibrationOffset: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid pressCalibrationOffset value!",
    },
    pressRaw: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid pressRaw value!",
    },
    pressReductionMethod: {
        optional: {
            options: {
                nullable: true
            }
        },
        isString: true,
        errorMessage: "Invalid pressReductionMethod value!",
    },
    pressReductionMethodID: {
        optional: {
            options: {
                nullable: true
            }
        },
        isInt: true,
        errorMessage: "Invalid pressReductionMethodID value!",
    },
    pressTrend: {
        optional: {
            options: {
                nullable: true
            }
        },
        isString: true,
        errorMessage: "Invalid pressTrend value!",
    },
    pressTrendID: {
        optional: {
            options: {
                nullable: true
            }
        },
        isInt: true,
        errorMessage: "Invalid pressTrendID value!",
    },
    pressUserOffset: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid pressUserOffset value!",
    },
    rain15m: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid rain15min value!",
    },
    rain1h: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid rain1h value!",
    },
    rain24h: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid rain24h value!",
    },
    rainDay: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid rainDay value!",
    },
    rainMonth: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid rainMonth value!",
    },
    rainRate: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid rainRate value!",
    },
    rainYear: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid rainYear value!",
    },
    soilMoistures: {
        isArray: {
            options: {
                min: 4,
                max: 4
            }
        },
        errorMessage: "Invalid soilMoistures value!",
    },
    soilTemps: {
        isArray: {
            options: {
                min: 4,
                max: 4
            }
        },
        errorMessage: "Invalid soilTemps value!",
    },
    solarRadiation: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid solarRadiation value!",
    },
    stormRain: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid stormRain value!",
    },
    stormStartDate: {
        optional: {
            options: {
                nullable: true
            }
        },
        isString: true,
        errorMessage: "Invalid stormStartDate value!",
    },
    sunrise: {
        optional: {
            options: {
                nullable: true
            }
        },
        isString: true,
        errorMessage: "Invalid sunrise value!",
    },
    sunset: {
        optional: {
            options: {
                nullable: true
            }
        },
        isString: true,
        errorMessage: "Invalid sunset value!",
    },
    tempExtra: {
        isArray: {
            options: {
                min: 7,
                max: 7
            }
        },
        errorMessage: "Invalid tempExtra value!",
    },
    tempIn: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid tempIn value!",
    },
    tempOut: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid tempOut value!",
    },
    thsw: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid thsw value!",
    },
    time: {
        optional: {
            options: {
                nullable: true
            }
        },
        isISO8601: true,
        errorMessage: "Invalid time value!",
    },
    transmitterBatteryStatus: {
        optional: {
            options: {
                nullable: true
            }
        },
        isInt: true,
        errorMessage: "Invalid transmitterBatteryStatus value!",
    },
    uv: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid uv value!",
    },
    wind: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid wind value!",
    },
    windAvg10m: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid windAvg10m value!",
    },
    windAvg2m: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid windAvg2m value!",
    },
    windDir: {
        optional: {
            options: {
                nullable: true
            }
        },
        isString: true,
        errorMessage: "Invalid windDir value!",
    },
    windDirDeg: {
        optional: {
            options: {
                nullable: true
            }
        },
        isInt: true,
        errorMessage: "Invalid windDirDeg value!",
    },
    windGust: {
        optional: {
            options: {
                nullable: true
            }
        },
        isFloat: true,
        errorMessage: "Invalid windGust value!",
    },
    windGustDir: {
        optional: {
            options: {
                nullable: true
            }
        },
        isString: true,
        errorMessage: "Invalid windGustDir value!",
    },
    windGustDirDeg: {
        optional: {
            options: {
                nullable: true
            }
        },
        isInt: true,
        errorMessage: "Invalid windGustDirDeg value!",
    },
};
//# sourceMappingURL=currentConditionsSchema.js.map