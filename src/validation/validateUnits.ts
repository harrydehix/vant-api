import { body, query, validationResult, checkSchema, checkExact, ValidationError }  from "express-validator";

export default [
    query("rainUnit").optional().isIn(["in", "mm"]).withMessage("Invalid rain unit. Allowed values are: 'in', 'mm'"),
    query("windUnit").optional().isIn(["km/h", "mph", "ft/s", "knots", "Bft", "m/s"]).withMessage("Invalid wind unit. Allowed values are: 'km/h', 'mph', 'ft/s', 'knots', 'Bft', 'm/s'"),
    query("pressureUnit").optional().isIn(["hPa", "inHg", "mmHg", "mb"]).withMessage("Invalid pressure unit. Allowed values are: 'hPa', 'inHg', 'mmHg', 'mb'"),
    query("solarRadiationUnit").optional().isIn(["W/m²"]).withMessage("Invalid solar radiation unit. Allowed values are: 'W/m²'"),
    query("temperatureUnit").optional().isIn(["°C", "°F"]).withMessage("Invalid temperature unit. Allowed values are: '°C', '°F'"),
];
