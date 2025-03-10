import dbConnect from "@/lib/mongoose";
import MstMaterial from "@/models/MstMaterial";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

// GET /api/material-search - Search material categories with pagination
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
    if (!["admin", "manager", "workker"].includes(session.user.role)) {
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
          { materialNumber: { $regex: searchTerm, $options: "i" } },
          { materialName: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }

    // Fetch materials with pagination and search - only return necessary fields for combobox
    const materials = await MstMaterial.find(query)
      .select("_id materialNumber materialName")
      .sort({ materialName: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await MstMaterial.countDocuments(query);

    // Format the response for the searchable combobox
    const transformedMaterials = materials.map(material => ({
      id: material._id.toString(),
      materialNumber: material.materialNumber,
      materialName: material.materialName
    }));

    return NextResponse.json({
      materials: transformedMaterials,
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
    console.error("Error fetching materials:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
