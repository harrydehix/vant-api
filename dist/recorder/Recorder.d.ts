import { VantPro2Interface, VantVueInterface } from "vantjs/interfaces";
interface RecorderSettings {
    readonly api: string;
    readonly interface: VantVueInterface | VantPro2Interface;
}
interface RealtimeRecorderSettings {
    readonly interval: number;
}
declare class Recorder {
    readonly settings: RecorderSettings;
    private realtimeRecorderSettings?;
    private realtimeRecorderTimeout?;
    constructor(settings: RecorderSettings);
    configureRealtimeRecordings: (settings: RealtimeRecorderSettings) => void;
    realtimeRecordingsEnabled: () => boolean;
    getRealtimeRecordingsInterval: () => number | undefined;
    start: () => void;
    stop: () => void;
    newRealtimeRecording: () => Promise<void>;
}
export default Recorder;
