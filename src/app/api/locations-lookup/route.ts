import dbConnect from "@/lib/mongoose";
import MstLocation from "@/models/MstLocation";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

// GET /api/material-category-search - Search material categories with pagination
export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check authorization (only admin and manager can access material categories)
    if (!["admin", "manager"].includes(session.user.role)) {
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
          { locationNumber: { $regex: searchTerm, $options: "i" } },
          { locationName: { $regex: searchTerm, $options: "i" } },
          { locationBay: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    // Fetch material categories with pagination and search - only return necessary fields for combobox
    const materialCategories = await MstLocation.find(query)
      .select("_id locationNumber locationName")
      .sort({ locationName: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await MstLocation.countDocuments(query);

    // Format the response for the searchable combobox
    const transformedLocations = materialCategories.map(location => ({
      id: location._id.toString(),
      locationNumber: location.locationNumber,
      locationName: location.locationName
    }));

    return NextResponse.json({
      materialCategories: transformedLocations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching material categories:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
