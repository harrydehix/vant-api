# vant-api

RESTful API for storing and retrieving vantage weather data.

## Introduction

There are _two main components_.

1. **RESTful API** - process and provide weather data
2. **recorder** - upload weather data

The **api** is an _expressjs_ api, which manages a database and provides [simple endpoints](https://harrydehix.github.io/vant-api/specification.html) to access your weather data.

The **recorder** repeatedly uploads weather data to the api.

Both of them together form a robust platform!

# Usage

Running the vantage api is super easy!
```ts
import { api } from "vant-api/api";

async function main(){
    api.configure({
        units: {
            temperature: "°C",
        },
        port: 5231,
    });
    
    await api.start();
}

main();
```

Running the recorder is also pretty easy.
```ts
import { Recorder } from "vant-api/recorder";

async function main(){
    // Configure recorder 
    const recorder = await Recorder.create({
        path: "COM5",
        api: "http://localhost:8000/api",
        key: "your-api-key",
        ...
    });

    // Configure "/api/v1/current" update interval
    recorder.configureCurrentConditionsTask({
        interval: 1,
    });

    // Start recorder
    recorder.start();
}

main();
```

Read the [guides](./guides) to get started!

# Documentation

First of all you should read the [guides](https://github.com/harrydehix/vant-api/tree/main/guides). After that you may get more information and read the official [documentation](https://harrydehix.github.io/vant-api).

# Roadmap

This project is in an early stage. There is still so much to come. Currently the api only stores the _current_ weather conditions. This will change.

## Planned endpoints

Currently following endpoints are planned. This may change.

### `/highs-and-lows/:interval`

This route will return interesting records. Using the
`:interval` you will be able to choose different periods.
Possible values will be: `hour`, `day`, `week`, `month`, `year`. By default it will assume that you are interested in the _current_ hour, day, etc. This is changeable by passing a `time` query parameter. E.g. `/highs-and-lows/week?time=2023/34` (this requests the highs and lows of the 34 calendar week of 2023).

```json
{
    "success": true,
    "interval": "year",
    "data": {
        "tempOut": {
            "low": {
                "value": -12.4,
                "time": "2004-01-28"
            },
            "high": {
                "value": 39.2,
                "time": "2004-08-27"
            }
        },
        ...
    }
}
```

### `/summary/:interval`

This route will return a summary of the passed interval.
Possible values will be: `hour`, `day`, `week`, `month`, `year`.

```json
{
    "success": true,
    "interval": "day",
    "data": {
        "rain": 7.4,
        "windDir": "W",
        "tempOut": {
            "low": {
                "value": 9.4,
                "time": "05:34"
            },
            "high": {
                "value": 14.9,
                "time": "14:22"
            }
        },
        ...
    }
}
```

This route will be useful for generating graphs that visualize the weather of a specified interval.