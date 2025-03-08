import mongoose, { Schema, Document } from 'mongoose';

export interface Material extends Document {
  id: string;
  materialNumber: string;
  brandCode: string;
  materialName: string;
  materialCategoryId: mongoose.Types.ObjectId | string;
  numberOfDaysToExpiry: number;
  customerId: mongoose.Types.ObjectId | string;
  unitId: mongoose.Types.ObjectId | string;
  fixedWeight: number;
  weightType: string;
  isLocked: boolean;
  createdBy: mongoose.Types.ObjectId | string;
  createdDate: Date;
  updatedBy: mongoose.Types.ObjectId | string;
  updatedDate: Date;
}

const MaterialSchema = new Schema(
  {
    materialNumber: { type: String, required: true, unique: true },
    brandCode: { type: String, required: true },
    materialName: { type: String, required: true },
    materialCategoryId: { type: Schema.Types.ObjectId, ref: 'MstMaterialCategory', required: true },
    numberOfDaysToExpiry: { type: Number, required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'MstCustomer', required: true },
    unitId: { type: Schema.Types.ObjectId, ref: 'MstUnit', required: true },
    fixedWeight: { type: Number, required: true },
    weightType: { type: String, required: true, enum: ['Fixed', 'Variable'] },
    isLocked: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdDate: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedDate: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export default mongoose.models.MstMaterial || mongoose.model('MstMaterial', MaterialSchema);
