import mongoose, { Document, Schema } from 'mongoose';
import { ITrnStorageTransferMaterial, StorageTransferMaterial } from './TrnStorageTransferMaterial';

export interface ITrnStorageTransfer extends Document {
  WarehouseId: Schema.Types.ObjectId;
  WarehouseName: string;
  STNumber: string;
  STDate: Date;
  ToWarehouseId: Schema.Types.ObjectId;
  ToWarehouseName: string;
  Particulars: string;
  ManualSTNumber: string;
  IsLocked: boolean;
  CreatedById?: Schema.Types.ObjectId;
  CreatedDateTime?: Date;
  UpdatedById?: Schema.Types.ObjectId;
  UpdatedDateTime?: Date;
  // Virtual property for related materials
  materials?: ITrnStorageTransferMaterial[];
}

export interface StorageTransfer {
  id: string;
  WarehouseId: string;
  WarehouseName: string;
  STNumber: string;
  STDate: Date;
  ToWarehouseId: string;
  ToWarehouseName: string;
  Particulars: string;
  ManualSTNumber: string;
  IsLocked: boolean;
  CreatedById?: string;
  CreatedDateTime?: Date;
  UpdatedById?: string;
  UpdatedDateTime?: Date;
  // Virtual property for related material objects
  materials?: StorageTransferMaterial[];
}

const TrnStorageTransferSchema: Schema = new Schema({
  WarehouseId: { type: Schema.Types.ObjectId, ref: 'MstWarehouse', required: true },
  STNumber: { type: String, required: true },
  STDate: { type: Date, required: true },
  ToWarehouseId: { type: Schema.Types.ObjectId, ref: 'MstWarehouse', required: true },
  Particulars: { type: String, required: true },
  ManualSTNumber: { type: String, required: true },
  IsLocked: { type: Boolean, default: false },
  CreatedById: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  CreatedDateTime: { type: Date, required: false },
  UpdatedById: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  UpdatedDateTime: { type: Date, required: false },
});

// Add a virtual property for related materials
TrnStorageTransferSchema.virtual("materials", {
  ref: "TrnStorageTransferMaterial",   // The model to use
  localField: "_id",                    // Field in this schema to match
  foreignField: "StorageStockTransferId", // Field in the material schema
  justOne: false,                       // Indicates an array of materials
});

// Ensure that virtual fields are serialized.
TrnStorageTransferSchema.set("toObject", { virtuals: true });
TrnStorageTransferSchema.set("toJSON", { virtuals: true });

const TrnStorageTransfer =
  mongoose.models.TrnStorageTransfer ||
  mongoose.model<ITrnStorageTransfer>(
    "TrnStorageTransfer",
    TrnStorageTransferSchema
  );

  export default TrnStorageTransfer;
