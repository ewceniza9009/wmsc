import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import MstMaterial from '@/models/MstMaterial';

// GET /api/materials/[id] - Get a specific material
export async function GET(req: NextRequest, context : { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can access materials)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();

    const {id} = await context.params;
    
    const material = await MstMaterial.findById(id);
    
    if (!material) {
      return NextResponse.json({ message: 'Material not found' }, { status: 404 });
    }
    
    // Transform the material data to return a clean object
    const transformedMaterial = {
      id: material._id.toString(),
      materialNumber: material.materialNumber,
      brandCode: material.brandCode,
      materialName: material.materialName,
      materialCategoryId: material.materialCategoryId,
      numberOfDaysToExpiry: material.numberOfDaysToExpiry,
      customerId: material.customerId,
      unitId: material.unitId,
      fixedWeight: material.fixedWeight,
      weightType: material.weightType,
      isLocked: material.isLocked,
      createdBy: material.createdBy,
      updatedBy: material.updatedBy,
      createdDate: material.createdDate,
      updatedDate: material.updatedDate,
    };
    
    return NextResponse.json(transformedMaterial);
  } catch (error: any) {
    console.error('Error fetching material:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch material' }, { status: 500 });
  }
}

// PUT /api/materials/[id] - Update a material
export async function PUT(req: NextRequest, context : { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can update materials)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    
    const body = await req.json();
    
    // Validate required fields
    const requiredFields = ['materialNumber', 'brandCode', 'materialName', 'materialCategoryId', 'numberOfDaysToExpiry', 'customerId', 'unitId', 'fixedWeight', 'weightType'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    const {id} = await context.params;

    // Check if material exists
    const material = await MstMaterial.findById(id);
    if (!material) {
      return NextResponse.json({ message: 'Material not found' }, { status: 404 });
    }

    // Check if material number already exists (for another material)
    const existingMaterial = await MstMaterial.findOne({ 
      materialNumber: body.materialNumber,
      _id: { $ne: id }
    });
    
    if (existingMaterial) {
      return NextResponse.json({ 
        message: `Material with number ${body.materialNumber} already exists` 
      }, { status: 409 });
    }

    // Update material with the current user as updatedBy
    const updatedMaterial = await MstMaterial.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedBy: session.user.id,
      },
      { new: true, runValidators: true }
    );
    
    // Transform the updated material data to return a clean object
    const transformedMaterial = {
      id: updatedMaterial._id.toString(),
      ...updatedMaterial.toObject(),
      _id: undefined,
      __v: undefined
    };
    
    return NextResponse.json(transformedMaterial);
  } catch (error: any) {
    console.error('Error updating material:', error);
    return NextResponse.json({ message: error.message || 'Failed to update material' }, { status: 500 });
  }
}

// DELETE /api/materials/[id] - Delete a material
export async function DELETE(req: NextRequest, context : { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can delete materials)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    
    const {id} = await context.params;

    // Check if material exists
    const material = await MstMaterial.findById(id);
    if (!material) {
      return NextResponse.json({ message: 'Material not found' }, { status: 404 });
    }

    // Delete material
    await MstMaterial.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Material deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting material:', error);
    return NextResponse.json({ message: error.message || 'Failed to delete material' }, { status: 500 });
  }
}
