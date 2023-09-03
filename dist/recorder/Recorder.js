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
const superagent_1 = __importDefault(require("superagent"));
const debug_1 = __importDefault(require("debug"));
const debug = (0, debug_1.default)("vant-recorder");
class Recorder {
    constructor(settings) {
        this.configureRealtimeRecordings = (settings) => {
            this.realtimeRecorderSettings = settings;
        };
        this.realtimeRecordingsEnabled = () => this.realtimeRecorderSettings !== undefined;
        this.getRealtimeRecordingsInterval = () => { var _a; return (_a = this.realtimeRecorderSettings) === null || _a === void 0 ? void 0 : _a.interval; };
        this.start = () => {
            debug("Started recorder!");
            if (this.realtimeRecorderSettings) {
                this.newRealtimeRecording();
            }
        };
        this.stop = () => {
            debug("Stopped recorder!");
            clearTimeout(this.realtimeRecorderTimeout);
        };
        this.newRealtimeRecording = () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const record = yield this.settings.interface.getRichRealtimeData();
            // TODO: Send http POST request to API
            debug("New realtime record (" + record.time + ")");
            superagent_1.default
                .post(this.settings.api + "/v1/current")
                .send(record)
                .set('accept', 'json')
                .end((err, res) => {
                if (!res.ok) {
                    debug("Failed to send realtime record!");
                    if (res.body && res.body.message) {
                        debug("Server message: '" + res.body.message + "'");
                    }
                }
                else {
                    debug("Sent realtime record (" + record.time + ") successfully!");
                }
            });
            const newRecordTime = new Date(record.time);
            newRecordTime.setSeconds(record.time.getSeconds() + ((_a = this.realtimeRecorderSettings) === null || _a === void 0 ? void 0 : _a.interval));
            const timeoutTime = newRecordTime.getTime() - record.time.getTime();
            this.realtimeRecorderTimeout = setTimeout(this.newRealtimeRecording, timeoutTime);
        });
        this.settings = settings;
    }
}
exports.default = Recorder;
//# sourceMappingURL=Recorder.js.map