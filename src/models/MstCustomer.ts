import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IMstCustomer extends Document {
  customerNumber: string;
  customerName: string;
  accountId: Schema.Types.ObjectId;
  creditLimit: number;
  termId: Schema.Types.ObjectId;
  address: string;
  emailAddress: string;
  tinNumber: string;
  faxNumber: string;
  contactNumber: string;
  contactPerson: string;
  contactPosition: string;
  salesPerson: string;
  companyName: string;
  billingAddress: string;
  shippingAddress: string;
  taxId: Schema.Types.ObjectId;
  isLocked: boolean;
  status: string;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
  createdDate: Date;
  updatedDate: Date;
  __v: number;
}

export interface Customer {
  id: string;
  customerNumber: string;
  customerName: string;
  accountId: string;
  creditLimit: number;
  termId: string;
  address: string;
  emailAddress: string;
  tinNumber: string;
  faxNumber: string;
  contactNumber: string;
  contactPerson: string;
  contactPosition: string;
  salesPerson: string;
  companyName: string;
  billingAddress: string;
  shippingAddress: string;
  taxId: string;
  isLocked: boolean;
  status: string;
  createdBy: string;
  updatedBy: string;
  createdDate: Date;
  updatedDate: Date;
  __v: number;
}

// Define Customer Schema
const MstCustomerSchema = new mongoose.Schema(
  {
    customerNumber: {
      type: String,
      required: [true, "Please provide a customer number"],
      unique: true,
    },
    customerName: {
      type: String,
      required: [true, "Please provide a customer name"],
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please provide an account ID"],
    },
    creditLimit: {
      type: Number,
      default: 0,
    },
    termId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    address: {
      type: String,
      required: [true, "Please provide an address"],
    },
    emailAddress: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    tinNumber: {
      type: String,
    },
    faxNumber: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
    contactPerson: {
      type: String,
    },
    contactPosition: {
      type: String,
    },
    salesPerson: {
      type: String,
    },
    companyName: {
      type: String,
    },
    billingAddress: {
      type: String,
    },
    shippingAddress: {
      type: String,
    },
    taxId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "Active",
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
// Create Customer model
const MstCustomer =
  mongoose.models.MstCustomer ||
  mongoose.model("MstCustomer", MstCustomerSchema);

export default MstCustomer;
