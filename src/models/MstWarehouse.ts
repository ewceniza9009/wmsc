import mongoose, { Schema, Document, ObjectId } from 'mongoose';

interface IMstWarehouse extends Document {
    warehouseCode: string;
    warehouseName: string;
    companyId: Schema.Types.ObjectId; // Reference to MstCompany
    address: string;
    contact: string;
    contactNumber: string;
  }
  
// Define MstWarehouse Schema
const MstWarehouseSchema = new mongoose.Schema(
    {
      warehouseCode: {
        type: String,
        required: [true, 'Please provide a warehouse code'],
        unique: true,
      },
      warehouseName: {
        type: String,
        required: [true, 'Please provide a warehouse name'],
      },
      companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MstCompany',
        required: [true, 'Please provide a company ID'],
      },
      address: {
        type: String,
        required: [true, 'Please provide an address'],
      },
      contact: {
        type: String,
      },
      contactNumber: {
        type: String,
      },
    },
    { timestamps: true }
  );
  
  // Create MstWarehouse model
  const MstWarehouse = mongoose.models.MstWarehouse || mongoose.model('MstWarehouse', MstWarehouseSchema);

  export default MstWarehouse;