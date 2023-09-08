# Getting started

This quick start guide will introduce you to the `vant-api`. After reading this guide, you will be able to request weather data from your running REST api.

### Steps

1. [Connect the vantage console serially to your computer](#1-connect-the-vantage-console-serially-to-your-computer)
2. [Install MongoDB Community Edition](#2-install-mongodb-community-edition)
3. [Install the _vant-api_ package](#3-install-the-vant-api-package)
4. [Run the api](#4-run-the-api)
5. [Run the recorder](#5-run-the-recorder)

## 1. Connect the vantage console serially to your computer

When you connect your weather station console via the datalogger for the first time, it should be connected serially by default (even if you use the datalogger's USB version).

However, if you have installed the Weather Link software, configured your weather station there, and _selected USB as the communication type_, you will need to run the **CP210X USB to Serial Converter**. This utility is included in the Weather Link software. You can run it from the Windows Start menu by selecting _WeatherLink_ **>** _CP210X USB to Serial Converter_.

## 2. Install MongoDB Community Edition
Your api manages a MongoDB database. That's why MonoDB has to be installed. Following the instructions [here](https://www.mongodb.com/try/download/community).

## 3. Install the vant-api package

Now that your weather station is serially connected and you have MongoDB installed, _vant-api_ can be easily installed via npm.

```shell
npm install vant-api
```

## 4. Run the api

Running the api is pretty simple. Create a new file (e.g. `api.js` / `api.ts`), simply import the start method and call it!

```ts
import { startVantageAPI } from "vant-api/api";
// or
const { startVantageAPI } = require("vant-api/api");

startVantageAPI({
    // optional settings
});
```

By default the api runs on port `8000` and uses `us` units. You can change that by passing you desired configuration.

```ts
startVantageAPI({
    port: 8231,
    units: {
        rain: "mm",
        temperature: "°C",
        wind: "km/h",
        solarRadiation: "W/m²",
        pressure: "hPa",
    }
});
```

Start your program like every node program with `node api.js`. If you are using typescript it depends on your setup.

After starting your api four api keys (with different privileges) will be logged in the console. **Make sure to save them, you will need them!**

At this point your api is already running! You can test the routes specified in the [specification](https://harrydehix.github.io/vant-api/specification.html) with programs like postman.

# 5. Run the recorder

Okay, your api is running but it still needs weather data!

That's the recorder's job! It repeatedly sends data to your api.

Create another file (e.g. `recorder.js`/`recorder.ts`), import the recorder and insert the following code.

```ts
import { Recorder } from "vant-api/recorder";
// or
const { Recorder } = require("vant-api/recorder");

async function main(){    
    const recorder = await Recorder.create({
        path: "COM5",           // change
        rainCupSize: "0.2mm",   // change
        model: "Pro2",          // change
        baudRate: 19200,        // change

        api: "http://localhost:8000/api" // change
        key: "api-key-with-write-access" // change
    });

    // Enable current conditions updates
    recorder.configureCurrentConditionsTask({});

    // Start the recorder
    recorder.start();
}

main();
```

Following settings should be passed:
-  `path`: Path to serial port. Defines the channel used to communicate with the weather station.
-  `rainCollectorSize`: Your weather station's rain collector size. Possible sizes are `"0.1in"`, `"0.2mm"` and `"0.1mm"`.
-  `baudRate`: The used baud rate. Should match your console's settings.
-  `model`: Your weather station's model. Choose `"Pro2"` or `"Vue"`.
- `api`: The url to your running api.
- `key`: The used key to communicate with the api. Use a key with **write** access!
- _optional_ `units`: If you have changed the api's unit settings pass these settings here too.

Now run your program and tadaaa... everything should work!

### Read the official documentation

You want change the recorder's update interval?
You want to disable logging?

_Read the [official documentation](https://harrydehix.github.io/vant-api/)!_