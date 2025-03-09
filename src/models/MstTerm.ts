import mongoose, { Document } from "mongoose";

export interface IMstTerm extends Document {
  id: string;
  terms: string;
  termsValue: number;
  isLocked: boolean;
}

export interface Term {
  id: string;
  terms: string;
  termsValue: number;
  isLocked: boolean;
  __v: number;
}

const MstTermSchema = new mongoose.Schema(
  {
    terms: {
      type: String,
      required: [true, "Please provide a term"],
      unique: true,
    },
    termsValue: {
      type: Number,
      default: 0,
    },
    isLocked: {
      type: Boolean,
    },   
    __v: {
      type: Number,
      default: 0,
    },
  }
);

const MstTerm =
  mongoose.models.MstTerm || mongoose.model("MstTerm", MstTermSchema);

export default MstTerm;
