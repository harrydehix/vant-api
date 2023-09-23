import Recorder from "../recorder/Recorder";

async function main(){    
    const recorder = await Recorder.create({
        preferEnvironmentVariables: true,
    });

    recorder.configureCurrentConditionsTask({
        interval: 1,
        preferEnvironmentVariables: true,
    });

    recorder.start();
}

main();