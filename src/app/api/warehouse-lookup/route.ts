import dbConnect from "@/lib/mongoose";
import MstWarehouse from "@/models/MstWarehouse"; // Import the Warehouse model
import { isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route"; // Adjust path as needed

// GET /api/warehouse-lookup - Get warehouses with pagination and search
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check authorization (Allow admin, manager, and user for lookup)
    if (session.user?.role && !['admin', 'manager', 'user'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Connect to the database
    await dbConnect();

    // Get query parameters for search and pagination
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "warehouseName"; // Default sort by name
    const sortOrder = searchParams.get("sortOrder") || "asc";

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build query for searching
    const query: any = {};
    if (search) {
      if (isValidObjectId(search)) {
        // If search term is a valid ObjectId, search by ID
        query._id = search;
      } else {
        // Otherwise, search by warehouse code or name (case-insensitive)
        query.$or = [
          { warehouseCode: { $regex: search, $options: "i" } },
          { warehouseName: { $regex: search, $options: "i" } }
        ];
      }
    }

    // Build the sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Fetch warehouses with pagination, sorting, and select only necessary fields
    const warehouses = await MstWarehouse.find(query)
      .select('warehouseCode warehouseName') // Select only code and name
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .lean(); // Use lean for performance as we only need plain objects

    // Get total count for pagination metadata
    const total = await MstWarehouse.countDocuments(query);

    // Transform warehouses for response (id, code, name)
    const transformedWarehouses = warehouses.map(warehouse => ({
      id: (warehouse._id as any).toString(), // Cast _id to any to resolve TS error with lean()
      warehouseCode: warehouse.warehouseCode,
      warehouseName: warehouse.warehouseName
    }));

    // Return paginated results with metadata
    return NextResponse.json({
      items: transformedWarehouses, // Use 'items' for consistency? Or 'warehouses'? Let's use 'items'.
      pagination: {
        page,
        limit,
        totalItems: total, // Use totalItems for clarity
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total, // Use hasNextPage
        hasPrevPage: page > 1 // Use hasPrevPage
      }
    });

  } catch (error) {
    console.error("Error fetching warehouses:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}