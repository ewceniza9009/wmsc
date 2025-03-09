import mongoose, { Document } from "mongoose";

export interface IMstTax extends Document {
  id: string;
  taxType: string;
  taxCode: string;
  rate: number;
  accountId: string;
}

export interface Tax {
  id: string;
  taxType: string;
  taxCode: string;
  rate: number;
  accountId: string;
  __v: number;
}

const MstTaxSchema = new mongoose.Schema(
  {
    taxType: {
      type: String,
      required: [true, "Please provide a tax type"],
      unique: true,
    },
    taxCode: {
        type: String,
        required: [true, "Please provide a tax code"],
        unique: true,
      },
    rate: {
      type: Number,
      default: 0,
    },  
    __v: {
      type: Number,
      default: 0,
    },
  }
);

const MstTax =
  mongoose.models.MstTax || mongoose.model("MstTax", MstTaxSchema);

export default MstTax;
