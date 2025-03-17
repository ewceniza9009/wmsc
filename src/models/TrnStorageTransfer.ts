import mongoose, { Document, Schema } from 'mongoose';

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

const TrnStorageTransfer =
  mongoose.models.TrnStorageTransfer ||
  mongoose.model<ITrnStorageTransfer>(
    "TrnStorageTransfer",
    TrnStorageTransferSchema
  );

  export default TrnStorageTransfer;
