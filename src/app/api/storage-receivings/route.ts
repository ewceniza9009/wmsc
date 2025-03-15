import dbConnect from "@/lib/mongoose";
import MstCustomer from "@/models/MstCustomer";
import TrnStorageReceiving from "@/models/TrnStorageReceiving";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

// GET /api/storage-receiving - Get all storage receiving records with pagination and search support
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
          { receivingNumber: { $regex: searchTerm, $options: "i" } },
          { containerNumber: { $regex: searchTerm, $options: "i" } },
          { truckPlateNumber: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    // Get total count for pagination
    const totalItems = await TrnStorageReceiving.countDocuments(query);

    // Fetch storage receiving records with pagination and search
    const storageReceivings = await TrnStorageReceiving.find(query)
      .populate("customerId", "customerNumber customerName")
      .sort({ receivingDate: -1 })
      .skip(skip)
      .limit(limit);

    const transformedStorageReceivings = storageReceivings.map((receiving) => ({
      id: receiving._id.toString(),
      receivingOrderId: receiving.receivingOrderId
        ? receiving.receivingOrderId.toString()
        : null,
      receivingNumber: receiving.receivingNumber,
      warehouseId: receiving.warehouseId.toString(),
      pickFromWarehouseId: receiving.pickFromWarehouseId
        ? receiving.pickFromWarehouseId.toString()
        : null,
      storagePickId: receiving.storagePickId
        ? receiving.storagePickId.toString()
        : null,
      receivingDate: receiving.receivingDate,
      receivingTime: receiving.receivingTime,
      truckPlateNumber: receiving.truckPlateNumber,
      manufactureDateHeader: receiving.manufactureDateHeader,
      noDaysToPrompAlertHeader: receiving.noDaysToPrompAlertHeader,
      quantity: receiving.quantity,
      weight: receiving.weight,
      containerNumber: receiving.containerNumber,
      remarks: receiving.remarks,
      customerId: receiving.customerId?._id.toString(),
      customerName: receiving.customerId?.customerName,
      isFreezing: receiving.isFreezing,
      receivedBy: receiving.receivedBy,
      createdBy: receiving.createdBy.toString(),
      updatedBy: receiving.updatedBy.toString(),
      createdDate: receiving.createdDate,
      updatedDate: receiving.updatedDate,
      isLocked: receiving.isLocked,
    }));

    return NextResponse.json({
      items: transformedStorageReceivings,
      totalItems,
      currentPage: page,
      itemsPerPage: limit,
    });
  } catch (error: any) {
    console.error("Error fetching storage receiving records:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch storage receiving records" },
      { status: 500 }
    );
  }
}

// POST /api/storage-receiving - Create a new storage receiving record with pallets
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

    // Validate required fields for storage receiving
    const requiredFields = [
      "receivingNumber",
      "warehouseId",
      "receivingDate",
      "receivingTime",
      "customerId",
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

    if (body.receivingNumber === "NA") {
      const receivingNumber = await TrnStorageReceiving.findOne().sort({
        receivingNumber: -1,
      });

      if (receivingNumber) {
        const lastSRNumber = receivingNumber.receivingNumber;
        const lastReceivingNumberSuffix = lastSRNumber.slice(4);
        const nextReceivingNumberSuffix = (
          parseInt(lastReceivingNumberSuffix) + 1
        )
          .toString()
          .padStart(9, "0");
        const nextReceivingNumber = `SRNU${nextReceivingNumberSuffix}`;
        body.palletNumber = nextReceivingNumber;
      } else {
        body.palletNumber = "SRNU000000001";
      }
    }

    // Check if receiving number already exists
    const existingReceiving = await TrnStorageReceiving.findOne({
      receivingNumber: body.receivingNumber,
    });

    // Check if the room exists
    const customer = await MstCustomer.findById(body.customerId);

    if (!customer) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }

    if (existingReceiving) {
      return NextResponse.json(
        {
          message:
            "Storage receiving with this receiving number already exists",
        },
        { status: 400 }
      );
    }

    if (body.pickFromWarehouseId === "") {
      delete body.pickFromWarehouseId;
    }

    if (body.storagePickId === "") {
      delete body.storagePickId;
    }

    // Start a transaction
    const session_db = await mongoose.startSession();
    session_db.startTransaction();

    try {
      // Create the storage receiving record
      const storageReceiving = new TrnStorageReceiving(
        {
          ...body,
          createdBy: session.user.id,
          updatedBy: session.user.id,
        },
      );

      await storageReceiving.save();

      // Commit the transaction
      await session_db.commitTransaction();
      session_db.endSession();

      return NextResponse.json(
        {
          message: "Storage receiving created successfully",
          id: storageReceiving._id.toString(),
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
    console.error("Error creating storage receiving:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create storage receiving" },
      { status: 500 }
    );
  }
}
