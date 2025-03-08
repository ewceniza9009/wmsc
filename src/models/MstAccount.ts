import mongoose, { Schema, Document, models, Model } from "mongoose";

export interface IMstAccount extends Document { 
  accountNumber: string;
  accountName: string;
  remarks?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MstAccountSchema = new Schema<IMstAccount>(
  {   
    accountNumber: { type: String, required: true, unique: true },
    accountName: { type: String, required: true },
    remarks: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better search performance
MstAccountSchema.index({ accountName: 1 });
MstAccountSchema.index({ accountNumber: 1 });
MstAccountSchema.index({ isActive: 1 });

// Create and export the model
const MstAccount: Model<IMstAccount> =
  models.MstAccount || mongoose.model<IMstAccount>("MstAccount", MstAccountSchema);

export default MstAccount;

