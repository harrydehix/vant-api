import { VantInterface, VantPro2Interface, VantVueInterface } from "vantjs/interfaces";
import debugInitializer from "debug";
const debug = debugInitializer("vant-recorder");

interface RecorderSettings{
    readonly api: string,
    readonly interface: VantVueInterface | VantPro2Interface;
}

interface RealtimeRecorderSettings{
    readonly interval: number,
}

class Recorder {
    public readonly settings : RecorderSettings;

    private realtimeRecorderSettings? : RealtimeRecorderSettings;
    private realtimeRecorderTimeout? : NodeJS.Timeout;

    constructor(settings: RecorderSettings) {
        this.settings = settings;
    }

    configureRealtimeRecordings = (settings : RealtimeRecorderSettings) => {
        this.realtimeRecorderSettings = settings;
    }

    public realtimeRecordingsEnabled = () => this.realtimeRecorderSettings !== undefined;
    public getRealtimeRecordingsInterval = () => this.realtimeRecorderSettings?.interval;

    public start = () => {
        if (this.realtimeRecorderSettings) { 
            this.realtimeRecorderTimeout = setTimeout(this.newRealtimeRecording, this.realtimeRecorderSettings.interval * 1000);
        }
    }

    public stop = () => {
        clearTimeout(this.realtimeRecorderTimeout);
    }

    newRealtimeRecording = async() => {
        const record = await this.settings.interface.getRichRealtimeData();

        // TODO: Send http POST request to API
        debug("New realtime record (" + record.time + ")");

        const newRecordTime = record.time;
        newRecordTime.setSeconds(record.time.getSeconds() + this.realtimeRecorderSettings?.interval!);
        const timeoutTime = newRecordTime.getTime() - record.time.getTime();
        this.realtimeRecorderTimeout = setTimeout(this.newRealtimeRecording, timeoutTime);
    }
}

export default Recorder;