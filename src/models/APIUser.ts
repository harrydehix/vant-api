
import mongoose, { Model, Schema, HydratedDocument } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export type APIUserRole = "write" | "read" | "readwrite" | "admin";
export const APIUserRoles = ["write", "read", "readwrite", "admin"];

interface IAPIUser{
    key: string,
    generated: Date,
    role: APIUserRole,
}

interface IAPIUserMethods {
    mayAccess(role: APIUserRole): boolean
}

// Create a new Model type that knows about IUserMethods...
interface APIUserModel extends Model<IAPIUser, {}, IAPIUserMethods>{
    createNew(role: APIUserRole): Promise<HydratedDocument<IAPIUser, IAPIUserMethods>>,
    findByAPIKey(key: string): Promise<HydratedDocument<IAPIUser, IAPIUserMethods> | null>,
}

const apiUserSchema = new mongoose.Schema<IAPIUser, APIUserModel, IAPIUserMethods>({
    key: {
        type: String,
        required: true,
    },
    generated: {
        type: Date,
        required: true,
    },
    role: {
        type: String,
        enum: APIUserRoles,
        required: true,
    }
});

apiUserSchema.method("mayAccess", function(role: APIUserRole){
    if(role === "read"){
        return this.role === "read" || this.role === "readwrite" || this.role === "admin";
    }else if(role === "admin"){
        return this.role === "admin";
    }else if(role === "write"){
        return this.role === "write" || this.role === "readwrite" || this.role === "admin";
    }else{
        return this.role === "readwrite" || this.role === "admin";
    }
})

apiUserSchema.static("createNew", function(role: APIUserRole){
    return this.create({ key: uuidv4(), role: role, generated: new Date() });
})

apiUserSchema.static("findByAPIKey", function(key: string){
    return this.findOne({key: key}).exec();
})


export default mongoose.model<IAPIUser, APIUserModel>("APIUser", apiUserSchema);