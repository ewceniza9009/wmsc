const mongoose = require("mongoose");
const { Schema } = mongoose;

// -------------------------------------------------------
// Define Models for your tables (collections)
// -------------------------------------------------------

const MstAccountCategorySchema = new Schema({
  accountCategoryNumber: { type: String, required: true },
  accountCategoryName: { type: String, required: true },
  isLocked: { type: Boolean, default: false },
});
const MstAccountCategory = mongoose.model(
  "MstAccountCategory",
  MstAccountCategorySchema
);

const MstAccountTypeSchema = new Schema({
  accountTypeDescription: { type: String, required: true },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "MstAccountCategory",
    required: true,
  },
  accountSeriesType: { type: String, required: true },
  remarks: { type: String, required: true },
  isLocked: { type: Boolean, default: false },
});
const MstAccountType = mongoose.model("MstAccountType", MstAccountTypeSchema);

const MstAccountSchema = new Schema({
  accountNumber: { type: String, required: true },
  accountName: { type: String, required: true },
  accountTypeId: {
    type: Schema.Types.ObjectId,
    ref: "MstAccountType",
    required: true,
  },
  begBalance: { type: Number, required: true },
  begBalanceDate: { type: Date, required: true },
  isActive: { type: Boolean, default: false },
  remarks: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdDate: { type: Date, required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  updatedDate: { type: Date, required: true },
  isLocked: { type: Boolean, default: false },
});
const MstAccount = mongoose.model("MstAccount", MstAccountSchema);

const MstTermSchema = new Schema({
  terms: { type: String, required: true },
  termsValue: { type: Number, required: true },
  isLocked: { type: Boolean, default: false },
});
const MstTerm = mongoose.model("MstTerm", MstTermSchema);

const MstTaxSchema = new Schema({
  taxType: { type: String, required: true },
  taxCode: { type: String, required: true },
  rate: { type: Number, required: true },
  accountId: { type: Schema.Types.ObjectId, ref: "MstAccount", required: true },
});
const MstTax = mongoose.model("MstTax", MstTaxSchema);

const MstCustomerSchema = new Schema({
  customerNumber: { type: String, required: true },
  customerName: { type: String, required: true },
  accountId: { type: Schema.Types.ObjectId, ref: "MstAccount", required: true },
  creditLimit: { type: Number, required: true },
  termId: { type: Schema.Types.ObjectId, ref: "MstTerm", required: true },
  address: { type: String, required: true },
  emailAddress: { type: String, required: true },
  tinNumber: { type: String, required: true },
  faxNumber: { type: String, required: true },
  contactNumber: { type: String, required: true },
  contactPerson: { type: String, required: true },
  contactPosition: { type: String, required: true },
  salesPerson: { type: String, required: true },
  companyName: { type: String, required: true },
  billingAddress: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  taxId: { type: Schema.Types.ObjectId, ref: "MstTax", required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdDate: { type: Date, required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  updatedDate: { type: Date, required: true },
  isLocked: { type: Boolean, default: false },
  status: { type: String, required: true },
});
const MstCustomer = mongoose.model("MstCustomer", MstCustomerSchema);

const MstUnitSchema = new Schema({
  unitNumber: { type: String, required: true },
  unitName: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdDate: { type: Date, required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  updatedDate: { type: Date, required: true },
  isLocked: { type: Boolean, default: false },
});
const MstUnit = mongoose.model("MstUnit", MstUnitSchema);

const MstMaterialCategorySchema = new Schema({
  code: { type: String, required: true },
  description: { type: String, required: true },
  materialInitials: { type: String, required: true },
  unitId: { type: Schema.Types.ObjectId, ref: "MstUnit", required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdDate: { type: Date, required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  updatedDate: { type: Date, required: true },
  isLocked: { type: Boolean, default: false },
});
const MstMaterialCategory = mongoose.model(
  "MstMaterialCategory",
  MstMaterialCategorySchema
);

const MstMaterialSchema = new Schema({
  materialNumber: { type: String, required: true },
  brandCode: { type: String, required: true },
  materialName: { type: String, required: true },
  materialCategoryId: {
    type: Schema.Types.ObjectId,
    ref: "MstMaterialCategory",
    required: true,
  },
  numberOfDaysToExpiry: { type: Number, required: true },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "MstCustomer",
    required: true,
  },
  unitId: { type: Schema.Types.ObjectId, ref: "MstUnit", required: true },
  fixedWeight: { type: Number, required: true },
  weightType: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdDate: { type: Date, required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  updatedDate: { type: Date, required: true },
  isLocked: { type: Boolean, default: false },
});
const MstMaterial = mongoose.model("MstMaterial", MstMaterialSchema);

const MstRoomSchema = new Schema({
  roomNumber: { type: String, required: true },
  roomName: { type: String, required: true },
  temperatureFrom: { type: Number, required: true },
  temperatureTo: { type: Number, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdDate: { type: Date, required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  updatedDate: { type: Date, required: true },
  isLocked: { type: Boolean, default: false },
});
const MstRoom = mongoose.model("MstRoom", MstRoomSchema);

const MstLocationSchema = new Schema({
  locationNumber: { type: String, required: true },
  locationName: { type: String, required: true },
  locBay: { type: String, required: true },
  locColumn: { type: String, required: true },
  locRow: { type: String, required: true },
  roomId: { type: Schema.Types.ObjectId, ref: "MstRoom", required: true },
  capacity: { type: Number, required: true },
  totalWeight: { type: Number, required: true },
  palletCount: { type: Number, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdDate: { type: Date, required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  updatedDate: { type: Date, required: true },
  isLocked: { type: Boolean, default: false },
});
const MstLocation = mongoose.model("MstLocation", MstLocationSchema);

const MstMaterialInventorySchema = new Schema({
  inventoryCode: { type: String, required: true },
  storageReceivingId: {
    type: Schema.Types.ObjectId,
    ref: "TrnStorageReceiving",
    required: true,
  },
  warehouseId: {
    type: Schema.Types.ObjectId,
    ref: "MstWarehouse",
    required: true,
  },
  locationId: {
    type: Schema.Types.ObjectId,
    ref: "MstLocation",
    required: true,
  },
  materialId: {
    type: Schema.Types.ObjectId,
    ref: "MstMaterial",
    required: true,
  },
  unitId: { type: Schema.Types.ObjectId, ref: "MstUnit", required: true },
  totalIn: { type: Number, required: true },
  totalOut: { type: Number, required: true },
  balance: { type: Number, required: true },
  weight: { type: Number, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdDate: { type: Date, required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  updatedDate: { type: Date, required: true },
  isLocked: { type: Boolean, default: false },
});
const MstMaterialInventory = mongoose.model(
  "MstMaterialInventory",
  MstMaterialInventorySchema
);

const TrnStorageReceivingSchema = new Schema({
  receivingOrderId: {
    type: Schema.Types.ObjectId,
    ref: "TrnStorageReceiving",
    default: null,
  },
  receivingNumber: { type: String, required: true },
  warehouseId: {
    type: Schema.Types.ObjectId,
    ref: "MstWarehouse",
    required: true,
  },
  pickFromWarehouseId: {
    type: Schema.Types.ObjectId,
    ref: "MstWarehouse",
    default: null,
  },
  storagePickId: { type: Schema.Types.ObjectId, default: null },
  receivingDate: { type: Date, required: true },
  receivingTime: { type: Date, required: true },
  truckPlateNumber: { type: String, required: true },
  manufactureDateHeader: { type: Date, required: true },
  noDaysToPrompAlertHeader: { type: Number, required: true },
  quantity: { type: Number, required: true },
  weight: { type: Number, required: true },
  containerNumber: { type: String, required: true },
  remarks: { type: String, required: true },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "MstCustomer",
    required: true,
  },
  isFreezing: { type: Boolean, default: false },
  receivedBy: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdDate: { type: Date, required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  updatedDate: { type: Date, required: true },
  isLocked: { type: Boolean, default: false },
});
const TrnStorageReceiving = mongoose.model(
  "TrnStorageReceiving",
  TrnStorageReceivingSchema
);

const TrnStorageReceivingPalletSchema = new Schema({
  storageReceivingId: {
    type: Schema.Types.ObjectId,
    ref: "TrnStorageReceiving",
    required: true,
  },
  palletNumber: { type: String, required: true },
  manualPalletNumber: { type: String, default: null },
  locationId: {
    type: Schema.Types.ObjectId,
    ref: "MstLocation",
    default: null,
  },
  materialId: {
    type: Schema.Types.ObjectId,
    ref: "MstMaterial",
    required: true,
  },
  quantity: { type: Number, required: true },
  unitId: { type: Schema.Types.ObjectId, ref: "MstUnit", required: true },
  remarks: { type: String, required: true },
  boxNumber: { type: String, default: null },
  vendorBatchNumber: { type: String, default: null },
  batchCode: { type: String, default: null },
  expiryDate: { type: Date, default: null },
  noDaysToPrompAlert: { type: Number, default: null },
  manufactureDate: { type: Date, default: null },
  isDisplayUnitCode: { type: Boolean, default: null },
  weightPerQuantity: { type: Number, required: true },
  grossWeight: { type: Number, required: true },
  packageTareWeight: { type: Number, default: null },
  palletTareWeight: { type: Number, default: null },
  netWeight: { type: Number, required: true },
  arrivalSequenceNo: { type: Number, default: null },
  barCode: { type: String, default: null },
  sourceBarcode: { type: String, default: null },
  isLastMaterial: { type: Boolean, default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  createdDate: { type: Date, default: null },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  updatedDate: { type: Date, default: null },
  isLocked: { type: Boolean, default: false },
  returnedStoragePickId: { type: Schema.Types.ObjectId, default: null },
  originalBarcode: { type: String, default: null },
  isCancelled: { type: Boolean, default: null },
});
const TrnStorageReceivingPallet = mongoose.model(
  "TrnStorageReceivingPallet",
  TrnStorageReceivingPalletSchema
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

    const UserSchema = new mongoose.Schema(
      {
        name: {
          type: String,
          required: [true, "Please provide a name"],
          maxlength: [50, "Name cannot be more than 50 characters"],
        },
        email: {
          type: String,
          required: [true, "Please provide an email"],
          match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email",
          ],
          unique: true,
        },
        password: {
          type: String,
          required: [true, "Please provide a password"],
          minlength: [6, "Password must be at least 6 characters"],
        },
        role: {
          type: String,
          enum: ["admin", "manager", "worker"],
          default: "worker",
        },
      },
      { timestamps: true }
    );

    // Hash password before saving
    UserSchema.pre("save", async function (next) {
      if (!this.isModified("password")) return next();

      try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
      } catch (error) {
        next(error);
      }
    });

    // Define MstWarehouse Schema
    const MstWarehouseSchema = new mongoose.Schema(
      {
        warehouseCode: {
          type: String,
          required: [true, "Please provide a warehouse code"],
          unique: true,
        },
        warehouseName: {
          type: String,
          required: [true, "Please provide a warehouse name"],
        },
        companyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MstCompany",
          required: [true, "Please provide a company ID"],
        },
        address: {
          type: String,
          required: [true, "Please provide an address"],
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

    const User = mongoose.models.User || mongoose.model("User", UserSchema);
    const Warehouse =  mongoose.models.MstWarehouse ||
      mongoose.model("MstWarehouse", MstWarehouseSchema);

    // const User = mongoose.models.User;
    // const Warehouse = mongoose.models.MstWarehouse;

    const user = await User.findById("67c943d2229205c98c6cef40");
    const warehouse = await Warehouse.findById("67c943d2229205c98c6cef6c");

    // Clear out existing data
    await Promise.all([
      MstAccountCategory.deleteMany({}),
      MstAccountType.deleteMany({}),
      MstAccount.deleteMany({}),
      MstTerm.deleteMany({}),
      MstTax.deleteMany({}),
      MstCustomer.deleteMany({}),
      MstUnit.deleteMany({}),
      MstMaterialCategory.deleteMany({}),
      MstMaterial.deleteMany({}),
      MstRoom.deleteMany({}),
      MstLocation.deleteMany({}),
      TrnStorageReceiving.deleteMany({}),
      MstMaterialInventory.deleteMany({}),
      TrnStorageReceivingPallet.deleteMany({}),
    ]);

    // Seed MstAccountCategory
    const accountCategory = await MstAccountCategory.create({
      accountCategoryNumber: "AC001",
      accountCategoryName: "Asset",
      isLocked: false,
    });

    // Seed MstAccountType
    const accountType = await MstAccountType.create({
      accountTypeDescription: "Savings",
      categoryId: accountCategory._id,
      accountSeriesType: "Series A",
      remarks: "Default account type",
      isLocked: false,
    });

    // Seed MstAccount
    const account = await MstAccount.create({
      accountNumber: "ACC001",
      accountName: "Primary Account",
      accountTypeId: accountType._id,
      begBalance: 1000.0,
      begBalanceDate: new Date(),
      isActive: true,
      remarks: "Seed account",
      createdBy: user._id,
      createdDate: new Date(),
      updatedBy: user._id,
      updatedDate: new Date(),
      isLocked: false,
    });

    // Seed MstTerm
    const term = await MstTerm.create({
      terms: "Net 30",
      termsValue: 30,
      isLocked: false,
    });

    // Seed MstTax
    const tax = await MstTax.create({
      taxType: "VAT",
      taxCode: "VAT01",
      rate: 0.12,
      accountId: account._id,
    });

    // Seed MstCustomer
    const customer = await MstCustomer.create({
      customerNumber: "CUST001",
      customerName: "John Doe",
      accountId: account._id,
      creditLimit: 5000.0,
      termId: term._id,
      address: "123 Main St",
      emailAddress: "john@example.com",
      tinNumber: "TIN123",
      faxNumber: "1234567890",
      contactNumber: "0987654321",
      contactPerson: "Jane Doe",
      contactPosition: "Manager",
      salesPerson: "Sales Rep",
      companyName: "Doe Enterprises",
      billingAddress: "123 Main St",
      shippingAddress: "123 Main St",
      taxId: tax._id,
      createdBy: user._id,
      createdDate: new Date(),
      updatedBy: user._id,
      updatedDate: new Date(),
      isLocked: false,
      status: "Active",
    });

    // Seed MstUnit
    const unit = await MstUnit.create({
      unitNumber: "U001",
      unitName: "Kilogram",
      createdBy: user._id,
      createdDate: new Date(),
      updatedBy: user._id,
      updatedDate: new Date(),
      isLocked: false,
    });

    // Seed MstMaterialCategory
    const materialCategory = await MstMaterialCategory.create({
      code: "MC001",
      description: "Raw Materials",
      materialInitials: "RM",
      unitId: unit._id,
      createdBy: user._id,
      createdDate: new Date(),
      updatedBy: user._id,
      updatedDate: new Date(),
      isLocked: false,
    });

    // Seed MstMaterial
    const material = await MstMaterial.create({
      materialNumber: "MAT001",
      brandCode: "BR001",
      materialName: "Steel",
      materialCategoryId: materialCategory._id,
      numberOfDaysToExpiry: 365,
      customerId: customer._id,
      unitId: unit._id,
      fixedWeight: 10.0,
      weightType: "Fixed",
      createdBy: user._id,
      createdDate: new Date(),
      updatedBy: user._id,
      updatedDate: new Date(),
      isLocked: false,
    });

    // Seed MstRoom
    const room = await MstRoom.create({
      roomNumber: "R001",
      roomName: "Cold Storage",
      temperatureFrom: 2,
      temperatureTo: 8,
      createdBy: user._id,
      createdDate: new Date(),
      updatedBy: user._id,
      updatedDate: new Date(),
      isLocked: false,
    });

    // Seed MstLocation
    const location = await MstLocation.create({
      locationNumber: "LOC001",
      locationName: "Aisle 1",
      locBay: "Bay 1",
      locColumn: "Col 1",
      locRow: "Row 1",
      roomId: room._id,
      capacity: 100,
      totalWeight: 500,
      palletCount: 50,
      createdBy: user._id,
      createdDate: new Date(),
      updatedBy: user._id,
      updatedDate: new Date(),
      isLocked: false,
    });

    // Seed TrnStorageReceiving
    const storageReceiving = await TrnStorageReceiving.create({
      receivingOrderId: null,
      receivingNumber: "SR001",
      warehouseId: warehouse._id,
      pickFromWarehouseId: null,
      storagePickId: null,
      receivingDate: new Date(),
      receivingTime: new Date(),
      truckPlateNumber: "XYZ-123",
      manufactureDateHeader: new Date(),
      noDaysToPrompAlertHeader: 30,
      quantity: 100,
      weight: 1000,
      containerNumber: "CONT001",
      remarks: "Received goods",
      customerId: customer._id,
      isFreezing: false,
      receivedBy: "Receiver",
      createdBy: user._id,
      createdDate: new Date(),
      updatedBy: user._id,
      updatedDate: new Date(),
      isLocked: false,
    });

    // Seed MstMaterialInventory
    await MstMaterialInventory.create({
      inventoryCode: "INV001",
      storageReceivingId: storageReceiving._id,
      warehouseId: warehouse._id,
      locationId: location._id,
      materialId: material._id,
      unitId: unit._id,
      totalIn: 100,
      totalOut: 0,
      balance: 100,
      weight: 1000,
      createdBy: user._id,
      createdDate: new Date(),
      updatedBy: user._id,
      updatedDate: new Date(),
      isLocked: false,
    });

    // Seed TrnStorageReceivingPallet
    await TrnStorageReceivingPallet.create({
      storageReceivingId: storageReceiving._id,
      palletNumber: "PALT001",
      manualPalletNumber: "MPALT001",
      locationId: location._id,
      materialId: material._id,
      quantity: 10,
      unitId: unit._id,
      remarks: "Pallet remarks",
      boxNumber: "BOX001",
      vendorBatchNumber: "VB001",
      batchCode: "BC001",
      expiryDate: new Date(),
      noDaysToPrompAlert: 15,
      manufactureDate: new Date(),
      isDisplayUnitCode: true,
      weightPerQuantity: 10,
      grossWeight: 110,
      packageTareWeight: 5,
      palletTareWeight: 5,
      netWeight: 100,
      arrivalSequenceNo: 1,
      barCode: "BAR001",
      sourceBarcode: "SRC001",
      isLastMaterial: false,
      createdBy: user._id,
      createdDate: new Date(),
      updatedBy: user._id,
      updatedDate: new Date(),
      isLocked: false,
      returnedStoragePickId: null,
      originalBarcode: "OBAR001",
      isCancelled: false,
    });

    console.log("Seeding completed");
    await mongoose.disconnect();
  } catch (err) {
    console.error("Seeding error:", err);
    await mongoose.disconnect();
  }
}

seedData();
