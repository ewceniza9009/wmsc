import mongoose, { Document, Schema } from "mongoose";

export interface ITrnStorageReceiving extends Document {
  receivingOrderId: Schema.Types.ObjectId | null;
  receivingNumber: string;
  warehouseId: Schema.Types.ObjectId;
  pickFromWarehouseId: Schema.Types.ObjectId | null;
  storagePickId: Schema.Types.ObjectId | null;
  receivingDate: Date;
  receivingTime: Date;
  truckPlateNumber: string;
  manufactureDateHeader: Date;
  noDaysToPrompAlertHeader: number;
  quantity: number;
  weight: number;
  containerNumber: string;
  remarks: string;
  customerId: Schema.Types.ObjectId;
  isFreezing: boolean;
  receivedBy: string;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
  createdDate: Date;
  updatedDate: Date;
  isLocked: boolean;
  __v: number;
}

export interface StorageReceiving {
  id: string;
  receivingOrderId: string | null;
  receivingNumber: string;
  warehouseId: string;
  pickFromWarehouseId: string | null;
  storagePickId: string | null;
  receivingDate: Date;
  receivingTime: Date;
  truckPlateNumber: string;
  manufactureDateHeader: Date;
  noDaysToPrompAlertHeader: number;
  quantity: number;
  weight: number;
  containerNumber: string;
  remarks: string;
  customerId: string;
  customerName?: string;
  isFreezing: boolean;
  receivedBy: string;
  createdBy: string;
  updatedBy: string;
  createdDate: Date;
  updatedDate: Date;
  isLocked: boolean;
  __v: number;
}

// Define Storage Receiving Schema
const TrnStorageReceivingSchema = new mongoose.Schema(
  {
    receivingOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    receivingNumber: {
      type: String,
      required: [true, "Please provide a receiving number"],
      unique: true,
    },
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please provide a warehouse ID"],
    },
    pickFromWarehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    storagePickId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    receivingDate: {
      type: Date,
      required: [true, "Please provide a receiving date"],
    },
    receivingTime: {
      type: Date,
      required: [true, "Please provide a receiving time"],
    },
    truckPlateNumber: {
      type: String,
    },
    manufactureDateHeader: {
      type: Date,
    },
    noDaysToPrompAlertHeader: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    weight: {
      type: Number,
      default: 0,
    },
    containerNumber: {
      type: String,
    },
    remarks: {
      type: String,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MstCustomer",
      required: [true, "Please provide a customer ID"],
    },
    isFreezing: {
      type: Boolean,
      default: false,
    },
    receivedBy: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
    },
    isLocked: {
      type: Boolean,
      default: false,
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

// Create Storage Receiving model
const TrnStorageReceiving =
  mongoose.models.TrnStorageReceiving ||
  mongoose.model("TrnStorageReceiving", TrnStorageReceivingSchema);

export default TrnStorageReceiving;
