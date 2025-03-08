import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import MstLocation from "@/models/MstLocation";
import MstRoom from "@/models/MstRoom";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    // Get query parameters for pagination and search
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const searchTerm = url.searchParams.get('search') || '';
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Build search query if search term is provided
    let query = {};
    if (searchTerm) {
      query = {
        $or: [
          { locationNumber: { $regex: searchTerm, $options: 'i' } },
          { locationName: { $regex: searchTerm, $options: 'i' } },
          { locBay: { $regex: searchTerm, $options: 'i' } },
          { locColumn: { $regex: searchTerm, $options: 'i' } },
          { locRow: { $regex: searchTerm, $options: 'i' } }
        ]
      };
    }

    // Get total count for pagination
    const totalItems = await MstLocation.countDocuments(query);
    
    // Get all locations and populate room information with pagination and search
    const locations = await MstLocation.find(query)
      .populate("roomId", "roomName roomNumber")
      .sort({ locationName: 1 })
      .skip(skip)
      .limit(limit);

    // Transform the data for the frontend
    const transformedLocations = locations.map((location: any) => ({
      id: location._id.toString(),
      locationNumber: location.locationNumber,
      locationName: location.locationName,
      locBay: location.locBay,
      locColumn: location.locColumn,
      locRow: location.locRow,
      roomId: location.roomId?._id.toString(),
      roomName: location.roomId?.roomName,
      capacity: location.capacity,
      totalWeight: location.totalWeight,
      palletCount: location.palletCount,
      isLocked: location.isLocked,
      createdBy: location.createdBy,
      updatedBy: location.updatedBy,
      createdDate: location.createdDate,
      updatedDate: location.updatedDate,
      __v: location.__v,
    }));

    return NextResponse.json({
      items: transformedLocations,
      totalItems,
      currentPage: page,
      itemsPerPage: limit
    })
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch locations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    // Get user role
    const userRole = session.user.role;
    if (!userRole || !['admin', 'manager'].includes(userRole)) {
      return NextResponse.json(
        { message: "You do not have permission to create a location." },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Check if the room exists
    const room = await MstRoom.findById(data.roomId);
    if (!room) {
      return NextResponse.json(
        { message: "Room not found" },
        { status: 404 }
      );
    }

    // Check if location number already exists
    const existingLocation = await MstLocation.findOne({ locationNumber: data.locationNumber });
    if (existingLocation) {
      return NextResponse.json(
        { message: "Location number already exists" },
        { status: 400 }
      );
    }

    // Create new location
    const location = new MstLocation({
      ...data,
      createdBy: session.user.id,
      updatedBy: session.user.id,
    });

    await location.save();

    return NextResponse.json(
      { message: "Location created successfully", id: location._id },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create location" },
      { status: 500 }
    );
  }
}
