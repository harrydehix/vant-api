"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const api_1 = __importDefault(require("../src/api/api"));
const uuid_1 = require("uuid");
const CurrentConditions_1 = __importDefault(require("../src/models/CurrentConditions"));
beforeAll(() => {
    return api_1.default.configure({
        preferEnvironmentVariables: false,
        autoStart: true,
        https: false,
        logOptions: {
            consoleLog: false,
            fileLog: false,
            logLevel: "error",
            logErrorInformation: false,
        },
        mongoUri: "mongodb://127.0.0.1:27017",
        port: 8001,
        units: {
            wind: "mph",
            rain: "in",
            pressure: "inHg",
            solarRadiation: "W/m²",
            temperature: "°F",
        }
    }).then(function () {
        return CurrentConditions_1.default.deleteMany({});
    });
});
describe("GET /current [weather data unavailable]", function () {
    it("responds with json", function (done) {
        (0, supertest_1.default)(api_1.default.app)
            .get("/api/v1/current")
            .expect("Content-Type", /json/)
            .end(done);
    });
    it("responds with 503 error object", function (done) {
        (0, supertest_1.default)(api_1.default.app)
            .get("/api/v1/current")
            .set("x-api-key", api_1.default.keys.read)
            .expect("Content-Type", /json/)
            .expect((res) => {
            if (!res.body.status || res.body.status !== 503)
                throw Error(`Invalid response status '${res.body.status}'!`);
            if (!res.body.message || typeof res.body.message !== "string")
                throw Error(`No response message of type string found!`);
            if (res.body.success !== false)
                throw Error(`Missing 'success' field!`);
        })
            .end(done);
    });
    it("responds with 503 if valid api key", function (done) {
        (0, supertest_1.default)(api_1.default.app)
            .get("/api/v1/current")
            .set("x-api-key", api_1.default.keys.read)
            .expect(503, done);
    });
});
describe("GET /current [weather data available]", function () {
    beforeAll(() => {
        const data = new CurrentConditions_1.default();
        return data.save();
    });
    it("responds with json", function (done) {
        (0, supertest_1.default)(api_1.default.app)
            .get("/api/v1/current")
            .expect("Content-Type", /json/)
            .end(done);
    });
    it("responds with 403 if no api key", function (done) {
        (0, supertest_1.default)(api_1.default.app)
            .get("/api/v1/current")
            .expect(403, done);
    });
    it("responds with 403 error object if no api key", function (done) {
        (0, supertest_1.default)(api_1.default.app)
            .get("/api/v1/current")
            .expect("Content-Type", /json/)
            .expect((res) => {
            if (!res.body.status || res.body.status !== 403)
                throw Error(`Invalid response status '${res.body.status}'!`);
            if (!res.body.message || typeof res.body.message !== "string")
                throw Error(`No response message of type string found!`);
            if (res.body.success !== false)
                throw Error(`Missing 'success' field!`);
        })
            .end(done);
    });
    it("responds with 200 if valid read api key", function (done) {
        (0, supertest_1.default)(api_1.default.app)
            .get("/api/v1/current")
            .set("x-api-key", api_1.default.keys.read)
            .expect(200, done);
    });
    it("responds with 200 if valid readwrite api key", function (done) {
        (0, supertest_1.default)(api_1.default.app)
            .get("/api/v1/current")
            .set("x-api-key", api_1.default.keys.readwrite)
            .expect(200, done);
    });
    it("responds with 403 if valid write api key", function (done) {
        (0, supertest_1.default)(api_1.default.app)
            .get("/api/v1/current")
            .set("x-api-key", api_1.default.keys.write)
            .expect(403, done);
    });
    it("responds with 200 if valid admin api key", function (done) {
        (0, supertest_1.default)(api_1.default.app)
            .get("/api/v1/current")
            .set("x-api-key", api_1.default.keys.admin)
            .expect(200, done);
    });
    it("responds with 403 if invalid api key", function (done) {
        (0, supertest_1.default)(api_1.default.app)
            .get("/api/v1/current")
            .set("x-api-key", (0, uuid_1.v4)())
            .expect(403, done);
    });
    afterAll(() => {
        return CurrentConditions_1.default.deleteMany({});
    });
});
describe("POST /current", function () {
    const data = {
        "altimeter": 30.112,
        "chill": 68,
        "consoleBatteryVoltage": 4.880859375,
        "dewpoint": 60,
        "etDay": 0,
        "etMonth": 0,
        "etYear": 0,
        "forecast": "Partly Cloudy",
        "forecastID": 6,
        "forecastRule": 44,
        "heat": 69,
        "humExtra": [null, null, null, null, null, null, null],
        "humIn": 54,
        "humOut": 75,
        "leafTemps": [null, null, null, null],
        "leafWetnesses": [null, null, null, 0],
        "press": 30.098,
        "pressAbs": 29.349,
        "pressCalibrationOffset": -0.017,
        "pressRaw": 29.349,
        "pressReductionMethod": "NOAA bar reduction",
        "pressReductionMethodID": 2,
        "pressTrend": "Steady",
        "pressTrendID": 0,
        "pressUserOffset": 0,
        "rain15m": 0,
        "rain1h": 0,
        "rain24h": 0,
        "rainDay": 0,
        "rainMonth": 1.6929133858267718,
        "rainRate": 0,
        "rainYear": 22.488188976377952,
        "soilMoistures": [null, null, null, null],
        "soilTemps": [null, null, null, null],
        "solarRadiation": null,
        "stormRain": null,
        "stormStartDate": null,
        "sunrise": "07:25",
        "sunset": "19:16",
        "tempExtra": [null, null, null, null, null, null, null],
        "tempIn": 67.8,
        "tempOut": 68.1,
        "thsw": null,
        "time": "2023-09-28T09:24:46.139Z",
        "transmitterBatteryStatus": 0,
        "uv": null,
        "wind": 0,
        "windAvg10m": 1.1,
        "windAvg2m": 1.4,
        "windDir": "WSW",
        "windDirDeg": 246,
        "windGust": 5,
        "windGustDir": "SSE",
        "windGustDirDeg": 167
    };
    test('responds with 201 if valid current conditions and valid api key', (done) => {
        (0, supertest_1.default)(api_1.default.app)
            .post("/api/v1/current")
            .send(data)
            .set("x-api-key", api_1.default.keys.write)
            .expect(201, done);
    });
    test('actually created new current conditions in database', (done) => {
        (0, supertest_1.default)(api_1.default.app)
            .post("/api/v1/current")
            .send(data)
            .set("x-api-key", api_1.default.keys.write)
            .expect(201)
            .then(() => CurrentConditions_1.default.findOne({}))
            .then((current) => {
            expect(current).not.toBe(null);
            done();
        });
    });
    afterEach(() => {
        return CurrentConditions_1.default.deleteMany({});
    });
});
afterAll(() => {
    return api_1.default.close();
});
//# sourceMappingURL=current.test.js.map