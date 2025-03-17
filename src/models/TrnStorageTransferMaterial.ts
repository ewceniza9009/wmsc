import mongoose, { Document, Schema } from 'mongoose';

export interface ITrnStorageTransferMaterial extends Document {
  StorageStockTransferId: Schema.Types.ObjectId;
  StorageReceivingPalletId: Schema.Types.ObjectId;
  LocationId: Schema.Types.ObjectId;
  MaterialId: Schema.Types.ObjectId;
  Quantity: number;
  UnitId: Schema.Types.ObjectId;
  Weight: number;
}

export interface StorageTransferMaterial {
  StorageStockTransferId: string;
  StorageReceivingPalletId: string;
  LocationId: string;
  MaterialId: string;
  Quantity: number;
  UnitId: string;
  Weight: number;
}

const TrnStorageTransferMaterialSchema: Schema = new Schema({
  StorageStockTransferId: {
    type: Schema.Types.ObjectId,
    ref: 'TrnStorageStockTransfer',
    required: true,
  },
  StorageReceivingPalletId: {
    type: Schema.Types.ObjectId,
    ref: 'TrnStorageReceivingPallet',
    required: true,
  },
  LocationId: { type: Schema.Types.ObjectId, ref: 'MstLocation', required: true },
  MaterialId: { type: Schema.Types.ObjectId, ref: 'MstMaterial', required: true },
  Quantity: { type: Number, required: true },
  UnitId: { type: Schema.Types.ObjectId, ref: 'MstUnit', required: true },
  Weight: { type: Number, required: true },
});

export default mongoose.model<ITrnStorageTransferMaterial>(
  'TrnStorageTransferMaterial',
  TrnStorageTransferMaterialSchema
);