var express = require('express');
//var bodyParser = require('body-parser');
var { query, validationResult } = require('express-validator');


var router = express.Router();

//router.post(bodyParser);

/* GET current weather conditions */
router.get('/',
    // query validation
    query("rainUnit").optional().matches(/(in|mm)/),
    query("windUnit").optional().matches(/(km\/h|mph|ft\/s|knots|Bft|m\/s)/),
    query("pressureUnit").optional().matches(/(hPa|inHg|mmHg|mb)/),
    query("solarRadiationUnit").optional().matches(/(W\/m²)/),
    query("temperatureUnit").optional().matches(/(°C|°F)/),
    function (req, res, next) {
        const result = validationResult(req);

        if (result.isEmpty()) {
            // TODO: Get current weather data from database

            // Dummy!
            return res.status(200).json({
                success: true,
                data: {
                    "altimeter": null,
                    "chill": 12.3,
                    "consoleBatteryVoltage": 3.5,
                    "dewpoint": 10.3,
                    "etDay": null,
                    "etMonth": null,
                    "etYear": null,
                    "forecast": "Mostly Cloudy",
                    "forecastID": 2,
                    "forecastRule": 0,
                    "heat": 27.2,
                    "humExtra": [
                        38.2,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                    ],
                    "humIn": 40,
                    "humOut": 65.1,
                    "leafTemps": [
                        22.1,
                        null,
                        null,
                        29.2
                    ],
                    "leafWetnesses": [
                        null,
                        null,
                        null,
                        null
                    ],
                    "press": 1023.1,
                    "pressAbs": 1012.8,
                    "pressCalibrationOffset": 0.2,
                    "pressRaw": 1012.6,
                    "pressReductionMethod": "altimeter setting",
                    "pressReductionMethodID": 1,
                    "pressTrend": "Steady",
                    "pressTrendID": 0,
                    "pressUserOffset": 0.1,
                    "rain15min": 0.3,
                    "rain1h": 0.9,
                    "rain24h": 12.1,
                    "rainDay": 8.4,
                    "rainMonth": 244.1,
                    "rainRate": 1.2,
                    "rainYear": 823.12,
                    "soilMoistures": [
                        null,
                        null,
                        null,
                        null
                    ],
                    "soilTemps": [
                        null,
                        null,
                        null,
                        null
                    ],
                    "solarRadiation": null,
                    "stormRain": 5.6,
                    "stormStartDate": "2023-08-31",
                    "sunrise": "8:13",
                    "sunset": "18:23",
                    "tempExtra": [
                        null,
                        19.2,
                        null,
                        null,
                        null,
                        null,
                        null
                    ],
                    "tempIn": "23.1",
                    "tempOut": 12.2,
                    "thsw": 10.3,
                    "time": "2023-08-31T12:23:01Z",
                    "transmitterBatteryStatus": null,
                    "uv": 2,
                    "wind": 13.2,
                    "windAvg10m": 5.3,
                    "windAvg2m": 7.5,
                    "windDir": "E",
                    "windDirDeg": 92,
                    "windGust": 34.4,
                    "windGustDir": "S",
                    "windGustDirDeg": 179
                }
            });
        }

        res.send({ errors: result.array() });
    });

/* SET current weather conditions */
router.post('/', function (req, res, next) {

});

module.exports = router;
