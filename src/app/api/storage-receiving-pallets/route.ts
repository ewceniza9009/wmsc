import dbConnect from "@/lib/mongoose";
import TrnStorageReceivingPallet from "@/models/TrnStorageReceivingPallet";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

// GET /api/storage-receiving-pallets - Get all storage receiving pallets with pagination and search support
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
          { palletNumber: { $regex: searchTerm, $options: "i" } },
          { remarks: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    // Get total count for pagination
    const totalItems = await TrnStorageReceivingPallet.countDocuments(query);

    // Fetch storage receiving pallets with pagination and search
    const storageReceivingPallets = await TrnStorageReceivingPallet.find(query)
      .sort({ createdDate: -1 })
      .skip(skip)
      .limit(limit);

    const transformedStorageReceivingPallets = storageReceivingPallets.map(
      (pallet) => ({
        id: pallet._id.toString(),
        storageReceivingId: pallet.storageReceivingId.toString(),
        palletNumber: pallet.palletNumber,
        manufactureDate: pallet.manufactureDate,
        expirationDate: pallet.expirationDate,
        quantity: pallet.quantity,
        weight: pallet.weight,
        remarks: pallet.remarks,
        createdBy: pallet.createdBy.toString(),
        updatedBy: pallet.updatedBy.toString(),
        createdDate: pallet.createdDate,
        updatedDate: pallet.updatedDate,
      })
    );

    return NextResponse.json({
      items: transformedStorageReceivingPallets,
      totalItems,
      currentPage: page,
      itemsPerPage: limit,
    });
  } catch (error: any) {
    console.error("Error fetching storage receiving pallets:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch storage receiving pallets" },
      { status: 500 }
    );
  }
}

// POST /api/storage-receiving-pallets - Create a new storage receiving pallet
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

    if (body.locationId === "") {
      delete body.locationId;
    }

    // Validate required fields
    const requiredFields = ["storageReceivingId", "palletNumber", "quantity"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    if (body.palletNumber === "NA") {
      const lastPallet = await TrnStorageReceivingPallet.findOne().sort({
        palletNumber: -1,
      });

      if (lastPallet) {
        const lastPalletNumber = lastPallet.palletNumber;
        const lastPalletNumberSuffix = lastPalletNumber.slice(4); 
        const nextPalletNumberSuffix = (parseInt(lastPalletNumberSuffix) + 1)
          .toString()
          .padStart(9, "0");
        const nextPalletNumber = `PALT${nextPalletNumberSuffix}`;
        body.palletNumber = nextPalletNumber;
        if (!body.manualPalletNumber) {
          body.manualPalletNumber = nextPalletNumber;
        }
      } else {
        body.palletNumber = "PALT000000001";
        if (!body.manualPalletNumber) {
          body.manualPalletNumber = "PALT000000001";
        }
      }
    }

    // Create the storage receiving pallet
    const storageReceivingPallet = new TrnStorageReceivingPallet({
      ...body,
      createdBy: session.user.id,
      updatedBy: session.user.id,
    });

    await storageReceivingPallet.save();

    return NextResponse.json(
      {
        message: "Storage receiving pallet created successfully",
        id: storageReceivingPallet._id.toString(),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating storage receiving pallet:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create storage receiving pallet" },
      { status: 500 }
    );
  }
}
