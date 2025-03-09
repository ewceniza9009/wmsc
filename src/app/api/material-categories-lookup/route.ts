import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import MstMaterialCategory from "@/models/MstMaterialCategory";

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
          { code: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
          { materialInitials: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    // Fetch material categories with pagination and search - only return necessary fields for combobox
    const materialCategories = await MstMaterialCategory.find(query)
      .select("_id code description")
      .sort({ description: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await MstMaterialCategory.countDocuments(query);

    // Format the response for the searchable combobox
    const transformedMaterialCategories = materialCategories.map(materialCategory => ({
      id: materialCategory._id.toString(),
      code: materialCategory.code,
      description: materialCategory.description
    }));

    return NextResponse.json({
      materialCategories: transformedMaterialCategories,
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
