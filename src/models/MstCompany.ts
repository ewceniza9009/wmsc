import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IMstCompany extends Document {
    companyName: string;
    companyAddress: string;
    contactPerson: string;
    contactNo: string;
    tiin: string;
    bookNumber: string;
    accreditationNumber: string;
    serialNumber: string;
    permitNumber: string;
    accountant: string;
    financeManager: string;
    operationsManager: string;
    managingDirector: string;
    defaultApproveBy: string;
    imagePath: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Company {
    id: string;
    companyName: string;
    companyAddress: string;
    contactPerson: string;
    contactNo: string;
    tiin: string;
    bookNumber: string;
    accreditationNumber: string;
    serialNumber: string;
    permitNumber: string;
    accountant: string;
    financeManager: string;
    operationsManager: string;
    managingDirector: string;
    defaultApproveBy: string;
    imagePath: string;
    createdAt: Date;
    updatedAt: Date;
  }

// Define MstCompany Schema
const MstCompanySchema = new mongoose.Schema(
    {
      companyName: {
        type: String,
        required: [true, 'Please provide a company name'],
        maxlength: [100, 'Company name cannot be more than 100 characters'],
      },
      companyAddress: {
        type: String,
        required: [true, 'Please provide a company address'],
      },
      contactPerson: {
        type: String,
        required: [true, 'Please provide a contact person'],
      },
      contactNo: {
        type: String,
        required: [true, 'Please provide a contact number'],
      },
      tiin: {
        type: String,
      },
      bookNumber: {
        type: String,
      },
      accreditationNumber: {
        type: String,
      },
      serialNumber: {
        type: String,
      },
      permitNumber: {
        type: String,
      },
      accountant: {
        type: String,
      },
      financeManager: {
        type: String,
      },
      operationsManager: {
        type: String,
      },
      managingDirector: {
        type: String,
      },
      defaultApproveBy: {
        type: String,
      },
      imagePath: {
        type: String,
      },
    },
    { timestamps: true }
  );
  
  // Create MstCompany model
  const MstCompany = mongoose.models.MstCompany || mongoose.model('MstCompany', MstCompanySchema);

  export default MstCompany