import startVantageAPI from "../server/server";"../server/server";
import Recorder from "../recorder/Recorder";
import { VantPro2Interface } from "vantjs/interfaces";

async function main(){
    startVantageAPI({ fallbackPort: 8000 });

    const device = await VantPro2Interface.create({
        units: {
            temperature: "°C",
            wind: "km/h",
            pressure: "hPa",
            rain: "mm",
        },
        path: "COM5",
        rainCollectorSize: "0.2mm",
    });
    
    const recorder = new Recorder({
        api: "http://localhost:8000/api",
        interface: device,
    });

    recorder.configureRealtimeRecordings({
        interval: 10,
    });

    recorder.start();
}

main();