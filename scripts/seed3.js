const mongoose = require("mongoose");
const { Schema } = mongoose;

// -------------------------------------------------------
// Define Models for your tables (collections)
// -------------------------------------------------------

const TrnStorageTransferSchema = new Schema({
  WarehouseId: { type: Schema.Types.ObjectId, ref: "MstWarehouse", required: true },
  STNumber: { type: String, required: true },
  STDate: { type: Date, required: true },
  ToWarehouseId: { type: Schema.Types.ObjectId, ref: "MstWarehouse", required: true },
  Particulars: { type: String, required: true },
  ManualSTNumber: { type: String, required: true },
  IsLocked: { type: Boolean, default: false },
  CreatedById: { type: Schema.Types.ObjectId, ref: "User", required: false },
  CreatedDateTime: { type: Date, required: false },
  UpdatedById: { type: Schema.Types.ObjectId, ref: "User", required: false },
  UpdatedDateTime: { type: Date, required: false },
});

const TrnStorageTransfer = mongoose.model(
  "TrnStorageTransfer",
  TrnStorageTransferSchema
);

const TrnStorageTransferMaterialSchema = new Schema({
  StorageTransferId: {
    type: Schema.Types.ObjectId,
    ref: "TrnStorageTransfer",
    required: true,
  },
  StorageReceivingPalletId: {
    type: Schema.Types.ObjectId,
    ref: "TrnStorageReceivingPallet",
    required: true,
  },
  LocationId: { type: Schema.Types.ObjectId, ref: "MstLocation", required: true },
  MaterialId: { type: Schema.Types.ObjectId, ref: "MstMaterial", required: true },
  Quantity: { type: Number, required: true },
  UnitId: { type: Schema.Types.ObjectId, ref: "MstUnit", required: true },
  Weight: { type: Number, required: true },
});

const TrnStorageTransferMaterial = mongoose.model(
  "TrnStorageTransferMaterial",
  TrnStorageTransferMaterialSchema
);

// -------------------------------------------------------
// Seed Data Function
// -------------------------------------------------------

async function seedData() {
  try {
    await mongoose.connect("mongodb://localhost:27017/wmsc", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear out existing data
    await Promise.all([
      TrnStorageTransfer.deleteMany({}),
      TrnStorageTransferMaterial.deleteMany({}),
    ]);

    // Get references to existing documents (replace with actual IDs)
    // You'll need to adjust these IDs to match your existing data
    const warehouseId = "67c943d2229205c98c6cef6c"; // Replace with a valid MstWarehouse ID
    const toWarehouseId = "67c943d2229205c98c6cef6c"; // Replace with a valid MstWarehouse ID
    const createdById = "67c943d2229205c98c6cef40"; // Replace with a valid User ID
    const storageReceivingPalletId = "67c943d2229205c98c6cef7a"; // Replace with a valid TrnStorageReceivingPallet ID
    const locationId = "67c943d2229205c98c6cef74"; // Replace with a valid MstLocation ID
    const materialId = "67c943d2229205c98c6cef71"; // Replace with a valid MstMaterial ID
    const unitId = "67c943d2229205c98c6cef6e"; // Replace with a valid MstUnit ID

    // Seed TrnStorageTransfer
    const stockTransfer = await TrnStorageTransfer.create({
      WarehouseId: warehouseId,
      STNumber: "ST001",
      STDate: new Date(),
      ToWarehouseId: toWarehouseId,
      Particulars: "Stock transfer particulars",
      ManualSTNumber: "MST001",
      IsLocked: false,
      CreatedById: createdById,
      CreatedDateTime: new Date(),
      UpdatedById: createdById,
      UpdatedDateTime: new Date(),
    });

    // Seed TrnStorageTransferMaterial
    await TrnStorageTransferMaterial.create({
      StorageTransferId: stockTransfer._id,
      StorageReceivingPalletId: storageReceivingPalletId,
      LocationId: locationId,
      MaterialId: materialId,
      Quantity: 10,
      UnitId: unitId,
      Weight: 100,
    });

    console.log("Seeding completed");
    await mongoose.disconnect();
  } catch (err) {
    console.error("Seeding error:", err);
    await mongoose.disconnect();
  }
}

seedData();