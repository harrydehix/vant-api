const express = require('express');
//const bodyParser = require('body-parser');
const { query, validationResult } = require('express-validator');
const { CurrentConditions } = require("vant-db");
const Error = require("../error-handling/Error");

const router = express.Router();

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
            CurrentConditions.findOne().then((currentConditions) => {
                // TODO: change Units
                res.status(200).json({
                    success: true,
                    data: currentConditions
                });
            }).catch((err) => {
                next(new Error("No current weather conditions available. This error usually happens if no weather data hasn't been uploaded!", 503))
            })
        } else {
            next(new Error("Invalid query parameters! Please check the official API documentation.", 400))
        }
    });

/* SET current weather conditions */
router.post('/', function (req, res, next) {
    // TODO check request body, save request body as document, handle errors, return success result
});

module.exports = router;
