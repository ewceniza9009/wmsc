import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import MstRoom from "@/models/MstRoom";
import mongoose, { isValidObjectId } from "mongoose";

// GET /api/rooms - Get rooms with pagination and search
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

    // Check authorization (only admin and manager can access rooms)
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
          { roomNumber: { $regex: search, $options: "i" } },
          { roomName: { $regex: search, $options: "i" } }
        ];
      }
    }

    // Build the sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Fetch rooms with pagination
    const rooms = await MstRoom.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .lean();

    // Get total count for pagination metadata
    const total = await MstRoom.countDocuments(query);

    // Transform rooms for response
    const transformedAccounts = rooms.map(room => ({
      id: room._id.toString(),
      roomNumber: room.roomNumber,
      roomName: room.roomName
    }));

    // Return paginated results with metadata
    return NextResponse.json({
      rooms: transformedAccounts,
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
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST /api/rooms - Create a new room
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

    // Check authorization (only admin and manager can create rooms)
    if (session.user?.role && !['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Connect to the database
    await dbConnect();

    // Parse request body
    const body = await request.json();
    const { roomNumber, roomName, temperatureFrom, temparatureTo, isLocked } = body;

    // Validate required fields
    if (!roomNumber || !roomName) {
      return NextResponse.json(
        { message: "Account number and room name are required" },
        { status: 400 }
      );
    }

    // Check if room with the same number already exists
    const existingAccount = await MstRoom.findOne({ roomNumber });
    if (existingAccount) {
      return NextResponse.json(
        { message: "An room with this room number already exists" },
        { status: 409 }
      );
    }

    // Create new room
    const newRoom = new MstRoom({
      roomNumber,
      roomName,
      temperatureFrom: temperatureFrom || 0,
      temperatureTo: temparatureTo || 0,
      createdBy: session.user.id,
      updatedBy: session.user.id,
      isLocked: isLocked || false,
    });

    // Save the room to the database
    await newRoom.save();

    // Return the created room
    return NextResponse.json(
      {
        message: "Account created successfully",
        room: {
          id: newRoom.id.toString(),
          roomNumber: newRoom.roomNumber,
          roomName: newRoom.roomName
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
