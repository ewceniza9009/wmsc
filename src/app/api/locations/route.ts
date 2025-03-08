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

    // Get all locations and populate room information
    const locations = await MstLocation.find({}).populate("roomId", "roomName roomNumber");

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

    return NextResponse.json(transformedLocations);
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
