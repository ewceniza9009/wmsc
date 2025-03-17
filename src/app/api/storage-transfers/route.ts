import dbConnect from "@/lib/mongoose";
import MstWarehouse from "@/models/MstWarehouse";
import TrnStorageTransfer from "@/models/TrnStorageTransfer";
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

    const transformedStorageTransfers = storageTransfers.map((transfer) => ({
      id: transfer._id.toString(),
      WarehouseId: transfer.WarehouseId.toString(),
      WarehouseName: transfer.WarehouseId?.warehouseName,
      STNumber: transfer.STNumber,
      STDate: transfer.STDate,
      ToWarehouseId: transfer.ToWarehouseId.toString(),
      ToWarehouseName: transfer.ToWarehouseId?.warehouseName,
      Particulars: transfer.Particulars,
      ManualSTNumber: transfer.ManualSTNumber,
      IsLocked: transfer.IsLocked,
      CreatedById: transfer.CreatedById
        ? transfer.CreatedById.toString()
        : null,
      CreatedDateTime: transfer.CreatedDateTime,
      UpdatedById: transfer.UpdatedById
        ? transfer.UpdatedById.toString()
        : null,
      UpdatedDateTime: transfer.UpdatedDateTime,
    }));

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

// POST /api/storage-transfers - Create a new storage transfer record
export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

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
        CreatedById: session.user.id,
        UpdatedById: session.user.id,
      });

      await storageTransfer.save();
      
      const warehouse = await MstWarehouse.findById(body.warehouseId);

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
      throw error;
    }
  } catch (error: any) {
    console.error("Error creating storage transfer:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create storage transfer" },
      { status: 500 }
    );
  }
}
