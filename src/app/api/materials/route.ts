import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import MstMaterial from '@/models/MstMaterial';

// GET /api/materials - Get all materials
export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can access materials)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Fetch all materials
    const materials = await MstMaterial.find({}).sort({ materialName: 1 });

    const transformedMaterials = materials.map(material => ({
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
      updatedDate: material.updatedDate
    }));

    return NextResponse.json(transformedMaterials);
  } catch (error: any) {
    console.error('Error fetching materials:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch materials' }, { status: 500 });
  }
}

// POST /api/materials - Create a new material
export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can create materials)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Parse request body
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['materialNumber', 'brandCode', 'materialName', 'materialCategoryId', 'numberOfDaysToExpiry', 'customerId', 'unitId', 'fixedWeight', 'weightType'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Check if material with same number already exists
    const existingMaterial = await MstMaterial.findOne({ materialNumber: data.materialNumber });
    if (existingMaterial) {
      return NextResponse.json({ 
        message: `Material with number ${data.materialNumber} already exists` 
      }, { status: 409 });
    }

    // Create new material
    const material = new MstMaterial({
      ...data,
      createdBy: session.user.id,
      updatedBy: session.user.id,
    });

    // Save to database
    await material.save();

    return NextResponse.json({
      id: material._id.toString(),
      ...material.toObject(),
      _id: undefined,
      __v: undefined
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating material:', error);
    return NextResponse.json({ 
      message: error.message || 'Failed to create material' 
    }, { status: 500 });
  }
}
