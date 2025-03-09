import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import MstAccount from "@/models/MstAccount";
import { isValidObjectId } from "mongoose";

// GET /api/accounts - Get accounts with pagination and search
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

    // Check authorization (only admin and manager can access accounts)
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
          { accountName: { $regex: search, $options: "i" } },
          { accountNumber: { $regex: search, $options: "i" } },
          { remarks: { $regex: search, $options: "i" } }
        ];
      }
    }

    // Build the sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Fetch accounts with pagination
    const accounts = await MstAccount.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .lean();

    // Get total count for pagination metadata
    const total = await MstAccount.countDocuments(query);

    // Transform accounts for response
    const transformedAccounts = accounts.map(account => ({
      id: account._id.toString(),
      accountNumber: account.accountNumber,
      accountName: account.accountName,
      remarks: account.remarks,
      isActive: account.isActive
    }));

    // Return paginated results with metadata
    return NextResponse.json({
      accounts: transformedAccounts,
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
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST /api/accounts - Create a new account
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check authorization (only admin and manager can create accounts)
    if (session.user?.role && !['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Connect to the database
    await dbConnect();

    // Parse request body
    const body = await request.json();
    const { accountNumber, accountName, remarks, isActive } = body;

    // Validate required fields
    if (!accountNumber || !accountName) {
      return NextResponse.json(
        { message: "Account number and account name are required" },
        { status: 400 }
      );
    }

    // Check if account with the same number already exists
    const existingAccount = await MstAccount.findOne({ accountNumber });
    if (existingAccount) {
      return NextResponse.json(
        { message: "An account with this account number already exists" },
        { status: 409 }
      );
    }

    // Create new account
    const newAccount = new MstAccount({
      accountNumber,
      accountName,
      remarks: remarks || "",
      isActive: isActive || false,
      createdBy: session.user.id,
      updatedBy: session.user.id,
    });

    // Save the account to the database
    await newAccount.save();

    // Return the created account
    return NextResponse.json(
      {
        message: "Account created successfully",
        account: {
          id: newAccount.id.toString(),
          accountNumber: newAccount.accountNumber,
          accountName: newAccount.accountName,
          remarks: newAccount.remarks,
          isActive: newAccount.isActive
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating account:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
