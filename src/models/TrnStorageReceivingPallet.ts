import mongoose, { Document, Schema } from "mongoose";

export interface ITrnStorageReceivingPallet extends Document {
  storageReceivingId: Schema.Types.ObjectId;
  palletNumber: string;
  manualPalletNumber: string;
  locationId: Schema.Types.ObjectId;
  materialId: Schema.Types.ObjectId;
  quantity: number;
  unitId: Schema.Types.ObjectId;
  remarks: string;
  boxNumber: string;
  vendorBatchNumber: string;
  batchCode: string;
  expiryDate: Date;
  noDaysToPrompAlert: number;
  manufactureDate: Date;
  isDisplayUnitCode: boolean;
  weightPerQuantity: number;
  grossWeight: number;
  packageTareWeight: number;
  palletTareWeight: number;
  netWeight: number;
  arrivalSequenceNo: number;
  barCode: string;
  sourceBarcode: string;
  isLastMaterial: boolean;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
  createdDate: Date;
  updatedDate: Date;
  isLocked: boolean;
  returnedStoragePickId: Schema.Types.ObjectId | null;
  originalBarcode: string;
  isCancelled: boolean;
  __v: number;
}

export interface StorageReceivingPallet {
  id: string;
  storageReceivingId: string;
  palletNumber: string;
  manualPalletNumber: string;
  locationId: string;
  locationName?: string 
  materialId: string;
  materialName?: string;
  quantity: number;
  unitId: string;
  unitName?: string;
  remarks: string;
  boxNumber: string;
  vendorBatchNumber: string;
  batchCode: string;
  expiryDate: Date;
  noDaysToPrompAlert: number;
  manufactureDate: Date;
  isDisplayUnitCode: boolean;
  weightPerQuantity: number;
  grossWeight: number;
  packageTareWeight: number;
  palletTareWeight: number;
  netWeight: number;
  arrivalSequenceNo: number;
  barCode: string;
  sourceBarcode: string;
  isLastMaterial: boolean;
  createdBy: string;
  updatedBy: string;
  createdDate: Date;
  updatedDate: Date;
  isLocked: boolean;
  returnedStoragePickId: string | null;
  originalBarcode: string;
  isCancelled: boolean;
  __v: number;
}

// Define Storage Receiving Pallet Schema
const TrnStorageReceivingPalletSchema = new mongoose.Schema(
  {
    storageReceivingId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please provide a storage receiving ID"],
    },
    palletNumber: {
      type: String,
      required: [true, "Please provide a pallet number"],
    },
    manualPalletNumber: {
      type: String,
    },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MstLocation",
      required: [true, "Please provide a location ID"],
    },
    materialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MstMaterial",
      required: [true, "Please provide a material ID"],
    },
    quantity: {
      type: Number,
      required: [true, "Please provide a quantity"],
      default: 0,
    },
    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MstUnit",
      required: [true, "Please provide a unit ID"],
    },
    remarks: {
      type: String,
    },
    boxNumber: {
      type: String,
    },
    vendorBatchNumber: {
      type: String,
    },
    batchCode: {
      type: String,
    },
    expiryDate: {
      type: Date,
    },
    noDaysToPrompAlert: {
      type: Number,
      default: 0,
    },
    manufactureDate: {
      type: Date,
    },
    isDisplayUnitCode: {
      type: Boolean,
      default: false,
    },
    weightPerQuantity: {
      type: Number,
      default: 0,
    },
    grossWeight: {
      type: Number,
      default: 0,
    },
    packageTareWeight: {
      type: Number,
      default: 0,
    },
    palletTareWeight: {
      type: Number,
      default: 0,
    },
    netWeight: {
      type: Number,
      default: 0,
    },
    arrivalSequenceNo: {
      type: Number,
      default: 0,
    },
    barCode: {
      type: String,
    },
    sourceBarcode: {
      type: String,
    },
    isLastMaterial: {
      type: Boolean,
      default: false,
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
    returnedStoragePickId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    originalBarcode: {
      type: String,
    },
    isCancelled: {
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

// Create Storage Receiving Pallet model
const TrnStorageReceivingPallet =
  mongoose.models.TrnStorageReceivingPallet ||
  mongoose.model("TrnStorageReceivingPallet", TrnStorageReceivingPalletSchema);

export default TrnStorageReceivingPallet;