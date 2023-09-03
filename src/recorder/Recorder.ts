import { VantPro2Interface, VantVueInterface } from "vantjs/interfaces";
import superagent from "superagent";
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
        debug("Started recorder!")
        if (this.realtimeRecorderSettings) { 
            this.newRealtimeRecording();
        }
    }

    public stop = () => {
        debug("Stopped recorder!")
        clearTimeout(this.realtimeRecorderTimeout);
    }

    newRealtimeRecording = async() => {
        const record = await this.settings.interface.getRichRealtimeData();

        // TODO: Send http POST request to API
        debug("New realtime record (" + record.time + ")");
        superagent
            .post(this.settings.api + "/v1/current")
            .send(record)
            .set('accept', 'json')
            .end((err, res: superagent.Response) => {
                if(!res.ok){
                    debug("Failed to send realtime record!");  
                    if(res.body && res.body.message){
                        debug("Server message: '" + res.body.message + "'");
                    }
                }else{
                    debug("Sent realtime record (" + record.time + ") successfully!");
                }
            });

        const newRecordTime = new Date(record.time);
        newRecordTime.setSeconds(record.time.getSeconds() + this.realtimeRecorderSettings?.interval!);
        const timeoutTime = newRecordTime.getTime() - record.time.getTime();
        this.realtimeRecorderTimeout = setTimeout(this.newRealtimeRecording, timeoutTime);
    }
}

export default Recorder;