import mongoose, { Document } from "mongoose";

export interface IMstAccount extends Document {
  id: string;
  accountNumber: string;
  accountName: string;
  remarks?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  accountNumber: string;
  accountName: string;
  remarks?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

const MstAccountSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: String,
      required: [true, "Please provide a account number"],
      unique: true,
    },
    accountName: {
      type: String,
      required: [true, "Please provide a account name"],
    },
    accountTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please provide an account type ID"],
    },
    begBalance: {
      type: Number,
      default: 0,
    },
    begBalanceDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
    },
    remarks: {
      type: String,
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

// Create and export the model
// const MstAccount: Model<IMstAccount> =
//   models.MstAccount || mongoose.model<IMstAccount>("MstAccount", MstAccountSchema);
const MstAccount =
  mongoose.models.MstAccount || mongoose.model("MstAccount", MstAccountSchema);

export default MstAccount;
