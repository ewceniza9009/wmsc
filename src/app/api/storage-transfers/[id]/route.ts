import dbConnect from "@/lib/mongoose";
import TrnStorageTransfer from "@/models/TrnStorageTransfer";
import TrnStorageTransferMaterial from "@/models/TrnStorageTransferMaterial";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

interface Params {
  id: string;
}

// GET /api/storage-transfers/[id] - Get a specific storage transfer record
export async function GET(request: NextRequest, { params }: { params: Params }) {
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
  }

  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Allow 'user' role for GET requests as well
    if (!["admin", "manager", "user"].includes(session.user.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Find the transfer document by ID and populate related fields
    const storageTransfer = await TrnStorageTransfer.findById(id)
      .populate("WarehouseId", "warehouseName") // Populate warehouse name
      .populate("ToWarehouseId", "warehouseName") // Populate destination warehouse name
      .populate({
          path: 'materials', // Populate the virtual 'materials' field
          model: TrnStorageTransferMaterial, // Explicitly specify the model for population
          // Optionally populate fields within materials if needed
          // populate: { path: 'MaterialId', select: 'materialName' }
      });


    if (!storageTransfer) {
      return NextResponse.json({ message: "Storage transfer not found" }, { status: 404 });
    }

    // Transform the result if necessary (e.g., converting IDs to strings)
    // The .populate('materials') should automatically include the materials array
    const result = {
        id: storageTransfer._id.toString(),
        WarehouseId: storageTransfer.WarehouseId?._id.toString(),
        WarehouseName: (storageTransfer.WarehouseId as any)?.warehouseName,
        STNumber: storageTransfer.STNumber,
        STDate: storageTransfer.STDate,
        ToWarehouseId: storageTransfer.ToWarehouseId?._id.toString(),
        ToWarehouseName: (storageTransfer.ToWarehouseId as any)?.warehouseName,
        Particulars: storageTransfer.Particulars,
        ManualSTNumber: storageTransfer.ManualSTNumber,
        IsLocked: storageTransfer.IsLocked,
        CreatedById: storageTransfer.CreatedById?.toString(),
        CreatedDateTime: storageTransfer.CreatedDateTime,
        UpdatedById: storageTransfer.UpdatedById?.toString(),
        UpdatedDateTime: storageTransfer.UpdatedDateTime,
        materials: storageTransfer.materials?.map((mat: any) => ({ // Ensure materials are mapped correctly
            id: mat._id.toString(),
            StorageStockTransferId: mat.StorageStockTransferId.toString(),
            StorageReceivingPalletId: mat.StorageReceivingPalletId.toString(),
            LocationId: mat.LocationId.toString(),
            MaterialId: mat.MaterialId.toString(),
            Quantity: mat.Quantity,
            UnitId: mat.UnitId.toString(),
            Weight: mat.Weight,
            // Add any other fields from TrnStorageTransferMaterial you need
        })) || [], // Default to empty array if materials is undefined
    };


    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Error fetching storage transfer:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch storage transfer" },
      { status: 500 }
    );
  }
}


// PUT /api/storage-transfers/[id] - Update a specific storage transfer record
export async function PUT(request: NextRequest, { params }: { params: Params }) {
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
  }

  const session_db = await mongoose.startSession();
  session_db.startTransaction();

  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      await session_db.abortTransaction();
      session_db.endSession();
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!["admin", "manager"].includes(session.user.role)) {
      await session_db.abortTransaction();
      session_db.endSession();
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    // Find the existing transfer document
    const existingTransfer = await TrnStorageTransfer.findById(id).session(session_db);

    if (!existingTransfer) {
      await session_db.abortTransaction();
      session_db.endSession();
      return NextResponse.json({ message: "Storage transfer not found" }, { status: 404 });
    }

    // Update the main transfer document fields (excluding materials)
    const { materials, ...updateData } = body;
    Object.assign(existingTransfer, {
        ...updateData,
        UpdatedById: session.user.id,
        UpdatedDateTime: new Date(), // Explicitly set update time
    });

    // Handle materials: Delete existing and create new ones
    await TrnStorageTransferMaterial.deleteMany({ StorageStockTransferId: id }).session(session_db);

    if (materials && Array.isArray(materials)) {
      const materialDocs = materials.map((materialData: any) => ({
        ...materialData,
        StorageStockTransferId: existingTransfer._id, // Link to the transfer
      }));
      if (materialDocs.length > 0) {
        await TrnStorageTransferMaterial.insertMany(materialDocs, { session: session_db });
      }
    }

    // Save the updated transfer document
    await existingTransfer.save({ session: session_db });

    await session_db.commitTransaction();
    session_db.endSession();

    return NextResponse.json({
      message: "Storage transfer updated successfully",
      id: existingTransfer._id.toString(),
    });

  } catch (error: any) {
    await session_db.abortTransaction();
    session_db.endSession();
    console.error("Error updating storage transfer:", error);
     let errorMessage = "Failed to update storage transfer";
      if (error instanceof mongoose.Error.ValidationError) {
          errorMessage = `Validation Error: ${error.message}`;
      } else {
          errorMessage = error.message || errorMessage;
      }
    return NextResponse.json(
      { message: errorMessage },
      { status: error instanceof mongoose.Error.ValidationError ? 400 : 500 }
    );
  }
}

// DELETE /api/storage-transfers/[id] - Delete a specific storage transfer record
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
  }

  const session_db = await mongoose.startSession();
  session_db.startTransaction();

  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      await session_db.abortTransaction();
      session_db.endSession();
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!["admin", "manager"].includes(session.user.role)) {
       await session_db.abortTransaction();
       session_db.endSession();
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // First, delete associated materials
    await TrnStorageTransferMaterial.deleteMany({ StorageStockTransferId: id }).session(session_db);

    // Then, delete the main transfer document
    const deletedTransfer = await TrnStorageTransfer.findByIdAndDelete(id).session(session_db);

    if (!deletedTransfer) {
      await session_db.abortTransaction();
      session_db.endSession();
      return NextResponse.json({ message: "Storage transfer not found" }, { status: 404 });
    }

    await session_db.commitTransaction();
    session_db.endSession();

    // Return 204 No Content for successful deletion is common, or 200 OK with message
    // return new NextResponse(null, { status: 204 });
     return NextResponse.json({ message: "Storage transfer deleted successfully" });


  } catch (error: any) {
    await session_db.abortTransaction();
    session_db.endSession();
    console.error("Error deleting storage transfer:", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete storage transfer" },
      { status: 500 }
    );
  }
}