import dbConnect from "@/lib/mongoose";
import MstWarehouse from "@/models/MstWarehouse";
import TrnStorageTransfer from "@/models/TrnStorageTransfer";
import TrnStorageTransferMaterial from "@/models/TrnStorageTransferMaterial"; // Ensure import is here
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

// GET /api/storage-transfers - Get all storage transfer records with pagination and search support
export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check authorization
    if (!["admin", "manager", "user"].includes(session.user.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Get query parameters for pagination and search
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const searchTerm = url.searchParams.get("search") || "";

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build search query if search term is provided
    let query = {};
    if (searchTerm) {
      query = {
        $or: [
          { STNumber: { $regex: searchTerm, $options: "i" } },
          { Particulars: { $regex: searchTerm, $options: "i" } },
          { ManualSTNumber: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    // Get total count for pagination
    const totalItems = await TrnStorageTransfer.countDocuments(query);

    // Fetch storage transfer records with pagination and search
    const storageTransfers = await TrnStorageTransfer.find(query)
      .populate("WarehouseId", "warehouseName")
      .populate("ToWarehouseId", "warehouseName")
      .sort({ STDate: -1 })
      .skip(skip)
      .limit(limit);

  const transformedStorageTransfers = storageTransfers.map((transfer) => {
    const { id: warehouseId, name: warehouseName } = getIdAndName(transfer.WarehouseId);
    const { id: toWarehouseId, name: toWarehouseName } = getIdAndName(transfer.ToWarehouseId);

    return {
      id: transfer._id?.toString() ?? null,
      WarehouseId: warehouseId,
      WarehouseName: warehouseName,
      STNumber: transfer.STNumber ?? null,
      STDate: transfer.STDate ? new Date(transfer.STDate).toISOString() : null,
      ToWarehouseId: toWarehouseId,
      ToWarehouseName: toWarehouseName,
      Particulars: transfer.Particulars ?? null,
      ManualSTNumber: transfer.ManualSTNumber ?? null,
      IsLocked: Boolean(transfer.IsLocked),
      CreatedById: transfer.CreatedById?.toString() ?? null,
      CreatedDateTime: transfer.CreatedDateTime ? new Date(transfer.CreatedDateTime).toISOString() : null,
      UpdatedById: transfer.UpdatedById?.toString() ?? null,
      UpdatedDateTime: transfer.UpdatedDateTime ? new Date(transfer.UpdatedDateTime).toISOString() : null,
    };
  });

    return NextResponse.json({
      items: transformedStorageTransfers,
      totalItems,
      currentPage: page,
      itemsPerPage: limit,
    });
  } catch (error: any) {
    console.error("Error fetching storage transfer records:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch storage transfer records" },
      { status: 500 }
    );
  }
}

function getIdAndName(obj: any): { id: string | null; name: string | null } {
  if (!obj) return { id: null, name: null };

  // If it's a Mongoose Document (populated), get from .._id and .warehouseName
  if (typeof obj === 'object' && '_id' in obj) {
    const id = obj._id?.toString() ?? null;
    const name = obj.warehouseName ?? obj.name ?? null;
    return { id, name };
  }

  // If it's just an ObjectId string
  if (typeof obj === 'string') {
    return { id: obj, name: null };
  }

  return { id: null, name: null };
}

// POST /api/storage-transfers - Create a new storage transfer record
export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    var warehousePlaceholder = MstWarehouse.find({});

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check authorization
    if (!["admin", "manager"].includes(session.user.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    // Validate required fields for storage transfer
    const requiredFields = [
      "WarehouseId",
      "STNumber",
      "STDate",
      "ToWarehouseId",
      "Particulars",
      "ManualSTNumber",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Start a transaction
    const session_db = await mongoose.startSession();
    session_db.startTransaction();

    try {
      // Create the storage transfer record
      const storageTransfer = new TrnStorageTransfer({
        ...body,
        materials: undefined, // Exclude materials from the main document body initially
        CreatedById: session.user.id,
        UpdatedById: session.user.id,
      });

      // Save the main transfer document within the transaction
      await storageTransfer.save({ session: session_db });

      // Check if materials data is provided and is an array
      if (body.materials && Array.isArray(body.materials)) {
        // Create and save each material document
        for (const materialData of body.materials) {
          // Basic validation for material data (can be expanded)
          if (!materialData.StorageReceivingPalletId || !materialData.MaterialId || !materialData.Quantity) {
             throw new Error("Missing required fields in material data.");
          }

          const transferMaterial = new TrnStorageTransferMaterial({
            ...materialData, // Spread the material data from the request
            StorageStockTransferId: storageTransfer._id, // Link to the created transfer
          });
          await transferMaterial.save({ session: session_db });
        }
      } else {
        // If materials are mandatory, you might want to throw an error here
        // For now, we assume an empty materials array is acceptable if body.materials is missing/not an array
        console.log("No materials data provided or data is not an array. Proceeding without materials.");
      }

      // Commit the transaction
      await session_db.commitTransaction();
      session_db.endSession();

      return NextResponse.json(
        {
          message: "Storage transfer created successfully",
          id: storageTransfer._id.toString(),
        },
        { status: 201 }
      );
    } catch (error: any) {
      // Abort transaction on error
      await session_db.abortTransaction();
      session_db.endSession();
      console.error("Error during storage transfer creation transaction:", error); // Log the specific error
      // Provide more specific error messages if possible
      let errorMessage = "Failed to create storage transfer";
      if (error.message.includes("Missing required fields in material data")) {
          errorMessage = error.message;
      } else if (error instanceof mongoose.Error.ValidationError) {
          errorMessage = `Validation Error: ${error.message}`;
      } else {
          errorMessage = error.message || errorMessage;
      }
      return NextResponse.json(
        { message: errorMessage },
        { status: error.message.includes("Missing required fields") ? 400 : 500 } // Return 400 for validation errors
      );
    }
  } catch (error: any) {
    console.error("Error creating storage transfer (outer):", error);
    return NextResponse.json(
      { message: error.message || "Failed to create storage transfer" },
      { status: 500 }
    );
  }
}
