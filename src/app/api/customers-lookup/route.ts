import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import MstCustomer from "@/models/MstCustomer";
import { isValidObjectId } from "mongoose";

// GET /api/customers - Get customers with pagination and search
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

    // Check authorization (only admin and manager can access customers)
    if (session.user?.role && !['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Connect to the database
    await dbConnect();

    // Get query parameters for search and pagination
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    
    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build query for searching
    const query: any = {};
    if (search) {
      if (isValidObjectId(search)) {
        query._id = search;
      } else {
        query.$or = [
          { customerName: { $regex: search, $options: "i" } },
          { customerNumber: { $regex: search, $options: "i" } }
        ];
      }
    }

    // Build the sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Fetch customers with pagination
    const customers = await MstCustomer.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .lean();

    // Get total count for pagination metadata
    const total = await MstCustomer.countDocuments(query);

    // Transform customers for response
    const transformedCustomers = customers.map(customer => ({
      id: customer._id.toString(),
      customerNumber: customer.customerNumber,
      customerName: customer.customerName
    }));

    // Return paginated results with metadata
    return NextResponse.json({
      customers: transformedCustomers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
