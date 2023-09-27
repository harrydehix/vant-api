import api from "../api/api";

api.configure({
        preferEnvironmentVariables: true
    });

// do something when app is closing
process.on('exit', () => {
    api.log.warn("Exiting!");
});


async function shutdownGracefully(){
    api.log.warn("Shutting down gracefully...");
    try{
        await api.close();
    }catch(err){
        api.log.error(err);
    }finally{
        process.exit();
    }
}

// catches ctrl+c event
process.on('SIGINT', () => {
    api.log.warn("Received SIGINT event!");
    shutdownGracefully();
});

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', () => {
    api.log.warn("Received kill (SIGNUSR1) signal!");
    shutdownGracefully();
});
process.on('SIGUSR2', () => {
    api.log.warn("Received kill (SIGNUSR2) signal!");
    shutdownGracefully();
});
process.on('SIGTERM', () => {
    api.log.warn("Received kill (SIGTERM) signal!");
    shutdownGracefully();
});

// catches uncaught exceptions
process.on('uncaughtException', (err) => {
    api.log.error("Uncaught exception!");
    api.log.error(err);
    shutdownGracefully();
});