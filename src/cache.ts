import CurrentConditions, { CurrentConditionsType } from "./models/CurrentConditions";
import { Request } from "express";
import hash from "string-hash";

export default class Cache<T>{
    private map : Map<string, T>;
    private timeoutMap : Map<string, NodeJS.Timeout>;

    constructor(){
        this.map = new Map<string, T>();
        this.timeoutMap = new Map<string, NodeJS.Timeout>();
    }

    public set(id: string, item : T, time?: number){
        this.map.set(id, item);

        if(time){
            const oldTimeout = this.timeoutMap.get(id);
            clearTimeout(oldTimeout);
            this.timeoutMap.set(id, setTimeout(() => {
                this.map.delete(id);
            }, time));
        }
    }

    public get(id: string){
        return this.map.get(id);
    }
}