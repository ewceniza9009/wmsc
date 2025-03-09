import dbConnect from "@/lib/mongoose";
import MstLocation from "@/models/MstLocation";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    // Get location by ID and populate room information
    const location = await MstLocation.findById(id).populate("roomId", "roomName roomNumber");

    if (!location) {
      return NextResponse.json(
        { message: "Location not found" },
        { status: 404 }
      );
    }

    // Transform the data for the frontend
    const transformedLocation = {
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
    };

    return NextResponse.json(transformedLocation);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch location" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
        { message: "You do not have permission to update a location." },
        { status: 403 }
      );
    }

    const { id } = params;
    const data = await request.json();

    // Check if location exists
    const location = await MstLocation.findById(id);
    if (!location) {
      return NextResponse.json(
        { message: "Location not found" },
        { status: 404 }
      );
    }

    // Check if location number already exists (if changed)
    if (data.locationNumber !== location.locationNumber) {
      const existingLocation = await MstLocation.findOne({ locationNumber: data.locationNumber });
      if (existingLocation) {
        return NextResponse.json(
          { message: "Location number already exists" },
          { status: 400 }
        );
      }
    }

    // Update location
    await MstLocation.findByIdAndUpdate(
      id,
      {
        ...data,
        updatedBy: session.user.id,
      },
      { new: true }
    );

    return NextResponse.json(
      { message: "Location updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update location" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
        { message: "You do not have permission to delete a location." },
        { status: 403 }
      );
    }

    const { id } = params;

    // Check if location exists
    const location = await MstLocation.findById(id);
    if (!location) {
      return NextResponse.json(
        { message: "Location not found" },
        { status: 404 }
      );
    }

    // Delete location
    await MstLocation.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Location deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete location" },
      { status: 500 }
    );
  }
}
