import Recorder from "../recorder/Recorder";

async function main(){    
    const recorder = await Recorder.create({
        useEnvironmentVariables: true,
    });

    recorder.configureRealtimeRecordings({
        interval: 10,
    });

    recorder.start();
}

main();