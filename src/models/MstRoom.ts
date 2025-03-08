import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IMstRoom extends Document {
    roomNumber: string;
    roomName: string;
    temperatureFrom: number;
    temperatureTo: number;
    createdBy: Schema.Types.ObjectId;
    updatedBy: Schema.Types.ObjectId;
    createdDate: Date;
    updatedDate: Date;
    __v: number;
}

export interface Room {
    id: string;
    roomNumber: string;
    roomName: string;
    temperatureFrom: number;
    temperatureTo: number;
    createdBy: Schema.Types.ObjectId;
    updatedBy: Schema.Types.ObjectId;
    createdDate: Date;
    updatedDate: Date;
    __v: number;
}

// Define Room Schema
const MstRoomSchema = new mongoose.Schema(
    {
        roomNumber: {
            type: String,
            required: [true, "Please provide a room number"],
            unique: true,
        },
        roomName: {
            type: String,
            required: [true, "Please provide a room name"],
        },
        temperatureFrom: {
            type: Number,
            default: 0,
        },
        temperatureTo: {
            type: Number,
            default: 0,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
        },
        __v: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: {
            createdAt: "createdDate",
            updatedAt: "updatedDate",
        },
    }
);
// Create Room model
const MstRoom =
    mongoose.models.MstRoom ||
    mongoose.model("MstRoom", MstRoomSchema);

export default MstRoom;
