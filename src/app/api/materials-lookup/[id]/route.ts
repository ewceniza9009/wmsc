import dbConnect from '@/lib/mongoose';
import MstMaterial from '@/models/MstMaterial';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

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
    
    const transformedMaterial = {
      id: material._id.toString(),
      materialNumber: material.materialNumber,
      materialName: material.materialName
    };
    
    return NextResponse.json(transformedMaterial);
  } catch (error: any) {
    console.error('Error fetching material:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch material' }, { status: 500 });
  }
}