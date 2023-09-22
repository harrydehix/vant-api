import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import CurrentConditions from "../models/CurrentConditions";
import APIUser from "../models/APIUser";

main().catch((err) => console.error(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/vant-db');

    console.log("Connected!")

    /*const apiUser = await APIUser.createNew("read");
    await apiUser.save();*/
    const apiUser = await APIUser.findByAPIKey("02c10a51-a613-4a02-979ab-32c14562a7db");
    if(apiUser !== null){
        console.log(apiUser.mayAccess("write"));
    }else{
        console.log("Not a valid api key!");
    }

    console.log("Saved!")
}