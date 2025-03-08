import mongoose, { Schema, Document } from 'mongoose';

export interface Unit extends Document {
  id: string;
  unitNumber: string;
  unitName: string;
  isLocked: boolean;
  createdBy: mongoose.Types.ObjectId | string;
  createdDate: Date;
  updatedBy: mongoose.Types.ObjectId | string;
  updatedDate: Date;
}

const UnitSchema = new Schema(
  {
    unitNumber: { type: String, required: true },
    unitName: { type: String, required: true },
    isLocked: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdDate: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedDate: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export default mongoose.models.MstUnit || mongoose.model('MstUnit', UnitSchema);