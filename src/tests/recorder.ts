import Recorder from "../recorder/Recorder";

async function main(){    
    const recorder = await Recorder.create({
        useEnvironmentVariables: true,
    });

    recorder.configureCurrentConditionsTask({
        interval: 1,
        useEnvironmentVariables: true,
    });

    recorder.start();
}

main();