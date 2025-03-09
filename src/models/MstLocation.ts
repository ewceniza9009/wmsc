import mongoose, { Document, Schema } from "mongoose";

export interface IMstLocation extends Document {
  locationNumber: string;
  locationName: string;
  locBay: string;
  locColumn: string;
  locRow: string;
  roomId: Schema.Types.ObjectId;
  capacity: number;
  totalWeight: number;
  palletCount: number;
  isLocked: boolean;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
  createdDate: Date;
  updatedDate: Date;
  __v: number;
}

export interface Location {
  id: string;
  locationNumber: string;
  locationName: string;
  locBay: string;
  locColumn: string;
  locRow: string;
  roomId: string;
  roomName?: string; // For display purposes
  capacity: number;
  totalWeight: number;
  palletCount: number;
  isLocked: boolean;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
  createdDate: Date;
  updatedDate: Date;
  __v: number;
}

// Define Location Schema
const MstLocationSchema = new mongoose.Schema(
  {
    locationNumber: {
      type: String,
      required: [true, "Please provide a location number"],
      unique: true,
    },
    locationName: {
      type: String,
      required: [true, "Please provide a location name"],
    },
    locBay: {
      type: String,
      default: "",
    },
    locColumn: {
      type: String,
      default: "",
    },
    locRow: {
      type: String,
      default: "",
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MstRoom",
      required: [true, "Please provide a room"],
    },
    capacity: {
      type: Number,
      default: 0,
    },
    totalWeight: {
      type: Number,
      default: 0,
    },
    palletCount: {
      type: Number,
      default: 0,
    },
    isLocked: {
      type: Boolean,
      default: false,
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

// Create Location model
const MstLocation =
  mongoose.models.MstLocation ||
  mongoose.model("MstLocation", MstLocationSchema);

export default MstLocation;
