"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../server/www");
const Recorder_1 = __importDefault(require("../recorder/Recorder"));
const interfaces_1 = require("vantjs/interfaces");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const device = yield interfaces_1.VantPro2Interface.create({
            units: {
                temperature: "°C",
                wind: "km/h",
                pressure: "hPa",
                rain: "mm",
            },
            path: "COM5",
            rainCollectorSize: "0.2mm",
        });
        const recorder = new Recorder_1.default({
            api: "http://localhost:8000/api",
            interface: device,
        });
        recorder.configureRealtimeRecordings({
            interval: 10,
        });
        recorder.start();
    });
}
main();
//# sourceMappingURL=recorderTest.js.map