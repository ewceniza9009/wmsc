import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import MstMaterialCategory from '@/models/MstMaterialCategory';

// GET /api/material-categories/[id] - Get a specific material category by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const materialCategory = await MstMaterialCategory.findById(params.id);
    if (!materialCategory) {
      return NextResponse.json({ message: 'Material category not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: materialCategory._id.toString(),
      code: materialCategory.code,
      description: materialCategory.description,
      materialInitials: materialCategory.materialInitials,
      unitId: materialCategory.unitId,
      isLocked: materialCategory.isLocked,
      createdBy: materialCategory.createdBy,
      updatedBy: materialCategory.updatedBy,
      createdDate: materialCategory.createdDate,
      updatedDate: materialCategory.updatedDate
    });
  } catch (error: any) {
    console.error('Error fetching material category:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch material category' }, { status: 500 });
  }
}

// PUT /api/material-categories/[id] - Update a material category
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Connect to database
    await dbConnect();

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can update material categories)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    const materialCategory = await MstMaterialCategory.findById(params.id);
    if (!materialCategory) {
      return NextResponse.json({ message: 'Material category not found' }, { status: 404 });
    }

    // Update material category
    const updatedMaterialCategory = await MstMaterialCategory.findByIdAndUpdate(
      params.id,
      {
        ...body,
        updatedBy: session.user.id,
        updatedDate: new Date()
      },
      { new: true }
    );

    return NextResponse.json({
      id: updatedMaterialCategory._id.toString(),
      code: updatedMaterialCategory.code,
      description: updatedMaterialCategory.description,
      materialInitials: updatedMaterialCategory.materialInitials,
      unitId: updatedMaterialCategory.unitId,
      isLocked: updatedMaterialCategory.isLocked,
      createdBy: updatedMaterialCategory.createdBy,
      updatedBy: updatedMaterialCategory.updatedBy,
      createdDate: updatedMaterialCategory.createdDate,
      updatedDate: updatedMaterialCategory.updatedDate
    });
  } catch (error: any) {
    console.error('Error updating material category:', error);
    return NextResponse.json({ message: error.message || 'Failed to update material category' }, { status: 500 });
  }
}

// DELETE /api/material-categories/[id] - Delete a material category
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Connect to database
    await dbConnect();

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can delete material categories)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const materialCategory = await MstMaterialCategory.findById(params.id);
    if (!materialCategory) {
      return NextResponse.json({ message: 'Material category not found' }, { status: 404 });
    }

    // Delete material category
    await MstMaterialCategory.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Material category deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting material category:', error);
    return NextResponse.json({ message: error.message || 'Failed to delete material category' }, { status: 500 });
  }
}