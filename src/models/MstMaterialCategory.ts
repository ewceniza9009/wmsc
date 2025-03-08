import mongoose, { Schema, Document } from 'mongoose';

export interface MaterialCategory extends Document {
  id: string;
  code: string;
  description: string;
  materialInitials: string;
  unitId: mongoose.Types.ObjectId | string;
  isLocked: boolean;
  createdBy: mongoose.Types.ObjectId | string;
  createdDate: Date;
  updatedBy: mongoose.Types.ObjectId | string;
  updatedDate: Date;
}

const MaterialCategorySchema = new Schema(
  {
    code: { type: String, required: true },
    description: { type: String, required: true },
    materialInitials: { type: String, required: true },
    unitId: { type: Schema.Types.ObjectId, ref: 'MstUnit', required: true },
    isLocked: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdDate: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedDate: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export default mongoose.models.MstMaterialCategory || mongoose.model('MstMaterialCategory', MaterialCategorySchema);