
import mongoose, { Model } from "mongoose";
import units from "simple-units";
import { UnitSettings} from "vant-environment/units";
import { RichRealtimeData } from "vant-environment/structures";
import api from "../api/api";

export const Intervals = {
    "live": 0 as 0,
    "1h": 1 as 1,
    "12h": 12 as 12,
    "24h": 24 as 24
};

export type IntervalValue = (typeof Intervals)[keyof typeof Intervals];
export type IntervalDescriptor = keyof typeof Intervals;
export const IntervalDescriptors: IntervalDescriptor[] = Object.keys(Intervals) as IntervalDescriptor[];
export const IntervalValues: IntervalValue[] = Object.values(Intervals) as IntervalValue[];



export const intervalOf = (descr: IntervalDescriptor) => {
    return Intervals[descr];
}

export interface ICurrentConditions extends Omit<RichRealtimeData, 'time'>{
    /**
     * The time the record was created
     */
    time: Date,

    /** The interval the record is corresponding to.
     * - `0`: Live entry (only 1 exists)
     * - `1`: Entry of one hour interval
     * - `12`: Entry of 12 hour interval
     * - `24`: Entry of 24 hour interval
     */
    interval: IntervalValue,

    /**
     * The index of the record inside the interval.
     */
    index: number
}

interface ICurrentConditionsMethods {
  changeUnits(unitSettings : Partial<UnitSettings>): void
}

// Create a new Model type that knows about IUserMethods...
type CurrentConditionsModel = Model<ICurrentConditions, {}, ICurrentConditionsMethods>;

const currentConditionsSchema = new mongoose.Schema<ICurrentConditions, CurrentConditionsModel, ICurrentConditionsMethods>({
    interval: {
        type: Number,
        default: 0,
    },
    index: {
        type: Number,
        default: 0,
    },
    altimeter: {
        type: Number,
        default: null
    },
    chill: {
        type: Number,
        default: null
    },
    consoleBatteryVoltage: {
        type: Number,
        default: null
    },
    dewpoint: {
        type: Number,
        default: null
    },
    etDay: {
        type: Number,
        default: null
    },
    etMonth: {
        type: Number,
        default: null
    },
    etYear: {
        type: Number,
        default: null
    },
    forecast: {
        type: String,
        enum: [
            null,
            "Mostly Clear",
            "Partly Cloudy",
            "Mostly Cloudy",
            "Mostly Cloudy",
            "Rain within 12 hours",
            "Mostly Cloudy",
            "Snow within 12 hours",
            "Mostly Cloudy",
            "Rain or Snow within 12 hours",
            "Partly Cloudy",
            "Rain within 12 hours",
            "Partly Cloudy",
            "Rain or Snow within 12 hours",
            "Partly Cloudy",
            "Snow within 12 hours",
        ],
        default: null,
    },
    forecastID: {
        type: Number,
        enum: [8, 6, 2, 3, 18, 19, 7, 22, 23],
        default: null
    },
    forecastRule: {
        type: Number,
        default: null
    },
    heat: {
        type: Number,
        default: null
    },
    humExtra: {
        type: [Number],
        default: [null, null, null, null, null, null, null]
    },
    humIn: {
        type: Number,
        default: null
    },
    humOut: {
        type: Number,
        default: null
    },
    leafTemps: {
        type: [Number],
        default: [null, null, null, null]
    },
    leafWetnesses: {
        type: [Number],
        default: [null, null, null, null]
    },
    press: {
        type: Number,
        default: null
    },
    pressAbs: {
        type: Number,
        default: null
    },
    pressCalibrationOffset: {
        type: Number,
        default: null
    },
    pressRaw: {
        type: Number,
        default: null
    },
    pressReductionMethod: {
        type: String,
        enum: [null, "user offset", "altimeter setting", "NOAA bar reduction"],
        default: null
    },
    pressReductionMethodID: {
        type: Number,
        default: null
    },
    pressTrend: {
        type: String,
        enum: [null, "Falling Rapidly", "Falling Slowly", "Steady", "Rising Slowly", "Rising Rapidly"],
        default: null,
    },
    pressTrendID: {
        type: Number,
        enum: [-60, -20, 0, 20, 60],
        default: null
    },
    pressUserOffset: {
        type: Number,
        default: null
    },
    rain15m: {
        type: Number,
        default: null
    },
    rain1h: {
        type: Number,
        default: null
    },
    rain24h: {
        type: Number,
        default: null
    },
    rainDay: {
        type: Number,
        default: null
    },
    rainMonth: {
        type: Number,
        default: null
    },
    rainRate: {
        type: Number,
        default: null
    },
    rainYear: {
        type: Number,
        default: null
    },
    soilMoistures: {
        type: [Number],
        default: [null, null, null, null]
    },
    soilTemps: {
        type: [Number],
        default: [null, null, null, null]
    },
    solarRadiation: {
        type: Number,
        default: null
    },
    stormRain: {
        type: Number,
        default: null
    },
    stormStartDate: {
        type: String,
        default: null
    },
    sunrise: {
        type: String,
        default: null
    },
    sunset: {
        type: String,
        default: null
    },
    tempExtra: {
        type: [Number],
        default: [null, null, null, null, null, null, null]
    },
    tempIn: {
        type: Number,
        default: null
    },
    tempOut: {
        type: Number,
        default: null
    },
    thsw: {
        type: Number,
        default: null
    },
    time: {
        type: Date,
        default: null
    },
    transmitterBatteryStatus: {
        type: Number,
        default: null
    },
    uv: {
        type: Number,
        default: null
    },
    wind: {
        type: Number,
        default: null
    },
    windAvg10m: {
        type: Number,
        default: null
    },
    windAvg2m: {
        type: Number,
        default: null
    },
    windDir: {
        type: String,
        enum: [null, "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"],
        default: null
    },
    windDirDeg: {
        type: Number,
        default: null,
        min: 1,
        max: 360,
    },
    windGust: {
        type: Number,
        default: null
    },
    windGustDir: {
        type: String,
        enum: [null, "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"],
        default: null
    },
    windGustDirDeg: {
        type: Number,
        default: null,
        min: 1,
        max: 360,
    },
});

/**
 * Converts the weather data from the environment units to the passed units. **Only works a single time!**
 * @param unitSettings the desired unit settings
 */
currentConditionsSchema.methods.changeUnits = function (unitSettings : Partial<UnitSettings>) {
    const databaseRainUnit = api.settings.units.rain;
    const databaseWindUnit = api.settings.units.wind;
    const databaseTemperatureUnit = api.settings.units.temperature;
    const databaseSolarRadiationUnit = api.settings.units.solarRadiation;
    const databasePressureUnit = api.settings.units.pressure;

    if (unitSettings.rain) {
        if(this.etDay !== null && this.etDay !== undefined) this.etDay = units.from(this.etDay, databaseRainUnit).to(unitSettings.rain);
        if(this.etMonth !== null && this.etMonth !== undefined) this.etMonth = units.from(this.etMonth, databaseRainUnit).to(unitSettings.rain);
        if(this.etYear !== null && this.etYear !== undefined) this.etYear = units.from(this.etYear, databaseRainUnit).to(unitSettings.rain);
        if(this.rain15m !== null && this.rain15m !== undefined) this.rain15m = units.from(this.rain15m, databaseRainUnit).to(unitSettings.rain);
        if(this.rain1h !== null && this.rain1h !== undefined) this.rain1h = units.from(this.rain1h, databaseRainUnit).to(unitSettings.rain);
        if(this.rain24h !== null && this.rain24h !== undefined) this.rain24h = units.from(this.rain24h, databaseRainUnit).to(unitSettings.rain);
        if(this.rainDay !== null && this.rainDay !== undefined) this.rainDay = units.from(this.rainDay, databaseRainUnit).to(unitSettings.rain);
        if(this.rainMonth !== null && this.rainMonth !== undefined) this.rainMonth = units.from(this.rainMonth, databaseRainUnit).to(unitSettings.rain);
        if(this.rainRate !== null && this.rainRate !== undefined) this.rainRate = units.from(this.rainRate, databaseRainUnit).to(unitSettings.rain);
        if(this.rainYear !== null && this.rainYear !== undefined) this.rainYear = units.from(this.rainYear, databaseRainUnit).to(unitSettings.rain);
        if(this.stormRain !== null && this.stormRain !== undefined) this.stormRain = units.from(this.stormRain, databaseRainUnit).to(unitSettings.rain);
    }

    if (unitSettings.temperature) {
        if(this.tempExtra) this.tempExtra = this.tempExtra.map((extraTemp: number | null) => extraTemp === null ? null : units.from(extraTemp, databaseTemperatureUnit).to(unitSettings.temperature!));
        if(this.tempIn !== null && this.tempIn !== undefined) this.tempIn = units.from(this.tempIn, databaseTemperatureUnit).to(unitSettings.temperature);
        if(this.tempOut !== null && this.tempOut !== undefined) this.tempOut = units.from(this.tempOut, databaseTemperatureUnit).to(unitSettings.temperature);
        if(this.leafTemps) this.leafTemps = this.leafTemps.map((leafTemp : number | null) => leafTemp === null ? null : units.from(leafTemp, databaseTemperatureUnit).to(unitSettings.temperature!));
        if(this.soilTemps) this.soilTemps = this.soilTemps.map((soilTemp : number | null) => soilTemp === null ? null : units.from(soilTemp, databaseTemperatureUnit).to(unitSettings.temperature!));
        if(this.chill !== null && this.chill !== undefined) this.chill = units.from(this.chill, databaseTemperatureUnit).to(unitSettings.temperature);
        if(this.heat !== null && this.heat !== undefined) this.heat = units.from(this.heat, databaseTemperatureUnit).to(unitSettings.temperature);
        if(this.dewpoint !== null && this.dewpoint !== undefined) this.dewpoint = units.from(this.dewpoint, databaseTemperatureUnit).to(unitSettings.temperature);
        if(this.thsw !== null && this.thsw !== undefined) this.thsw = units.from(this.thsw, databaseTemperatureUnit).to(unitSettings.temperature);
    }

    if (unitSettings.pressure) {
        if(this.altimeter !== null && this.altimeter !== undefined) this.altimeter = units.from(this.altimeter, databasePressureUnit).to(unitSettings.pressure);
        if(this.press !== null && this.press !== undefined) this.press = units.from(this.press, databasePressureUnit).to(unitSettings.pressure);
        if(this.pressAbs !== null && this.pressAbs !== undefined) this.pressAbs = units.from(this.pressAbs, databasePressureUnit).to(unitSettings.pressure);
        if(this.pressCalibrationOffset !== null && this.pressCalibrationOffset !== undefined) this.pressCalibrationOffset = units.from(this.pressCalibrationOffset, databasePressureUnit).to(unitSettings.pressure);
        if(this.pressRaw !== null && this.pressRaw !== undefined) this.pressRaw = units.from(this.pressRaw, databasePressureUnit).to(unitSettings.pressure);
        if(this.pressUserOffset !== null && this.pressUserOffset !== undefined) this.pressUserOffset = units.from(this.pressUserOffset, databasePressureUnit).to(unitSettings.pressure);
    }

    if (unitSettings.solarRadiation) {
        if(this.solarRadiation !== null && this.solarRadiation !== undefined) this.solarRadiation = units.from(this.solarRadiation, databaseSolarRadiationUnit).to(unitSettings.solarRadiation);
    }

    if (unitSettings.wind) {
        if(this.wind !== null && this.wind !== undefined) this.wind = units.from(this.wind, databaseWindUnit).to(unitSettings.wind);
        if(this.windAvg10m !== null && this.windAvg10m !== undefined) this.windAvg10m = units.from(this.windAvg10m, databaseWindUnit).to(unitSettings.wind);
        if(this.windAvg2m !== null && this.windAvg2m !== undefined) this.windAvg2m = units.from(this.windAvg2m, databaseWindUnit).to(unitSettings.wind);
        if(this.windGust !== null && this.windGust !== undefined) this.windGust = units.from(this.windGust, databaseWindUnit).to(unitSettings.wind);
    }
};

const currentModel = mongoose.model<ICurrentConditions, CurrentConditionsModel>("CurrentConditions", currentConditionsSchema);
export default currentModel;

const test = new currentModel();

export type CurrentConditionsType = typeof test;
export type CurrentConditionsElement = Exclude<keyof ICurrentConditions, "id" | "interval" | "time" | "index">;
export const CurrentConditionsElements: CurrentConditionsElement[] = Object.keys(test.toJSON()).filter((val) => !["id", "interval", "time", "index", "__v", "_id"].includes(val)) as CurrentConditionsElement[];