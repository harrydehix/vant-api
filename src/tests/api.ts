import api from "../api/api";

api.configure({
        preferEnvironmentVariables: true
    });

api.start();

function handleExit(){
    api.stop();
}

// do something when app is closing
process.on('exit', handleExit);

// catches ctrl+c event
process.on('SIGINT', handleExit);

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', handleExit);
process.on('SIGUSR2', handleExit);

// catches uncaught exceptions
process.on('uncaughtException', handleExit);