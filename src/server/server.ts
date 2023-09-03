import * as dotenv from "dotenv";
import app from "../app";
import debugInitializer from "debug";
const debug = debugInitializer('vant-api');
import * as http from "http";
import { inspect } from "util";
import APISettings from "./APISettings";

function startVantageAPI(settings: APISettings){
    /**
     * Load environment variables
     */
    dotenv.config();
    
    /**
     * Get port from environment and store in Express.
     */
    const port = process.env.PORT ? parseInt(process.env.PORT) : settings.fallbackPort;
    app.set('port', port);

    /**
     * Create HTTP server.
     */
    const server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port);
    server.on('error', (err) => {
        debug("Error while starting the vant api server!");
        debug(inspect(err));
    });
    server.on('listening', ()=>{
        debug("Successfully started vant api server!");
        debug("Listening on port " + port);
    });
}


export default startVantageAPI;