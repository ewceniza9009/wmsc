import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import MstMaterialCategory from '@/models/MstMaterialCategory';

// GET /api/material-categories - Get all material categories
export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can access material categories)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
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
          { code: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { materialInitials: { $regex: searchTerm, $options: 'i' } }
        ]
      };
    }

    // Get total count for pagination
    const totalItems = await MstMaterialCategory.countDocuments(query);
    
    // Fetch material categories with pagination and search
    const materialCategories = await MstMaterialCategory.find(query)
      .sort({ description: 1 })
      .skip(skip)
      .limit(limit);

    const transformedCategories = materialCategories.map(category => ({
      id: category._id.toString(),
      code: category.code,
      description: category.description,
      materialInitials: category.materialInitials,
      unitId: category.unitId,
      isLocked: category.isLocked,
      createdBy: category.createdBy,
      updatedBy: category.updatedBy,
      createdDate: category.createdDate,
      updatedDate: category.updatedDate
    }));

    // If no pagination parameters are provided, just return the array
    if (!url.searchParams.has('page') && !url.searchParams.has('limit')) {
      return NextResponse.json(transformedCategories);
    }

    // Otherwise return with pagination metadata
    return NextResponse.json({
      items: transformedCategories,
      totalItems,
      currentPage: page,
      itemsPerPage: limit
    });
  } catch (error: any) {
    console.error('Error fetching material categories:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch material categories' }, { status: 500 });
  }
}

// POST /api/material-categories - Create a new material category
export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can create material categories)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    // Create new material category
    const materialCategory = await MstMaterialCategory.create({
      ...body,
      createdBy: session.user.id,
      updatedBy: session.user.id
    });

    return NextResponse.json(materialCategory, { status: 201 });
  } catch (error: any) {
    console.error('Error creating material category:', error);
    return NextResponse.json({ message: error.message || 'Failed to create material category' }, { status: 500 });
  }
}