# vant-api

API for storing and retrieving vantage weather data.

### ⚠️ Development in early progress

This package is still in active development. There will be many breaking changes and improvements in the future.

### Running the prototype

To start the `vant-api` prototype just clone this repository and create the following `.env` file in the root directory.
*Comment: In the future you don't need to clone the repository. You will be able to simply install it as package using npm.*

```sh
# unit settings (for api & recorder), don't have to match the units of the vant-web-gui
WIND_UNIT=mph               # wind unit
TEMPERATURE_UNIT='°F'       # temperature unit
SOLAR_RADIATION_UNIT='W/m²' # solar radiation unit
RAIN_UNIT=in                # rain unit
PRESSURE_UNIT=inHg          # pressure unit

# environment (use production for a production build)
ENV=development

# log-settings (for api & recorder)
LOG_LEVEL=debug
FILE_LOG=true
CONSOLE_LOG=true
LOG_ERROR_INFORMATION=false

# api specific settings
PORT=8000

# recorder specific settings
BAUD_RATE=19200                 # has to match your console's settings
MODEL=Pro2                      # supported models: Pro2, Vue
RAIN_COLLECTOR_SIZE='0.2mm'     # possible values: 0.2mm, 0.1mm, 0.1in
API=http://localhost:8000/api   
SERIAL_PATH=COM5                # change!
API_KEY=your-write-api-key      # is logged to the console when you start the vant-api
CURRENT_CONDITIONS_INTERVAL=1   # the interval the current conditions get updated (min: 1)
```

After that you have to build the src folder. Just run `npm install && npm run build`. This may take a while!

Finally start the `vant-api` with `npm run vant-api` and the `vant-recorder` with `npm run vant-recorder`.

You **don't** have to execute both programs on the same machine!