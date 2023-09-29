import CurrentConditions, { IntervalValue, IntervalValues, CurrentConditionsType } from "./models/CurrentConditions";
import log from "./log";
import mongoose from "mongoose";


class Recorder{
    private storeIntervalEntry: { [K in IntervalValue]: boolean } = {
        0: true,
        1: true,
        12: true,
        24: true,
    };

    private nextIntervalIndex: { [K in IntervalValue]: number } = {
        0: 0,
        1: 0,
        12: 0,
        24: 0
    }

    private pointsPerInterval: { [K in IntervalValue]: number } = {
        0: 1,
        1: 60,
        12: 60,
        24: 60
    };

    private timeout: { [K in IntervalValue]?: NodeJS.Timeout } = {}

    private offset: { [K in IntervalValue]? : number } = {};

    constructor(){
        for(const interval of IntervalValues){
            this.offset[interval] = 60 * 60 * interval / this.pointsPerInterval[interval];
        }
    }

    public stop(){
        for(const interval of IntervalValues){
            clearTimeout(this.timeout[interval]);
        }
    }

    
    public reset = () => {
        this.stop();
        for(const interval of IntervalValues){
            this.storeIntervalEntry[interval] = true;
            this.nextIntervalIndex[interval] = 0;
        }
    }

    public async process(record: CurrentConditionsType){
        for(const interval of IntervalValues){
            if(this.storeIntervalEntry[interval]){
                record._id = new mongoose.Types.ObjectId();
                record.isNew = true;

                // Set index and interval type
                record.interval = interval;
                record.index = this.nextIntervalIndex[interval];
                this.nextIntervalIndex[interval] = (this.nextIntervalIndex[interval] + 1) % this.pointsPerInterval[interval];
                
                // Save new entry, delete old ones
                await record.save({ validateBeforeSave: false });

                await CurrentConditions.deleteMany({ _id: { $ne: record._id }, interval: interval, index: record.index });
                log.debug(`Deleted existing entries of interval '${interval}h' with index '${record.index}'!`);

                this.storeIntervalEntry[interval] = false;
                log.info(`Stored '${interval}h' entry with index '${record.index}'`);

                // Calculate next record time
                const newRecordTime = new Date(record.time);
                newRecordTime.setSeconds(record.time.getSeconds() + this.offset[interval]!);
                newRecordTime.setMilliseconds(0);
                const timeoutTime = Math.max(newRecordTime.getTime() - record.time.getTime(), 0);
                this.timeout[interval] = setTimeout(() => {
                    log.debug(`Ready to store '${interval}' record!`);
                    this.storeIntervalEntry[interval] = true;
                }, timeoutTime);
                log.debug(`Next record for interval '${interval}h' scheduled at ${newRecordTime.toISOString()}`);
            }
        }
        log.info("Processed weather record!");
    }
}

const recorder = new Recorder();
export default recorder;