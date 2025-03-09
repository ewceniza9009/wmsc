import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import MstMaterialCategory from '@/models/MstMaterialCategory';

// GET /api/materialCategorys/[id] - Get a specific materialCategory
export async function GET(req: NextRequest, context : { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can access materialCategorys)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();

    const {id} = await context.params;
    
    const materialCategory = await MstMaterialCategory.findById(id);
    
    if (!materialCategory) {
      return NextResponse.json({ message: 'MaterialCategory not found' }, { status: 404 });
    }
    
    const transformedMaterialCategory = {
      id: materialCategory._id.toString(),
      code: materialCategory.code,
      description: materialCategory.description
    };
    
    return NextResponse.json(transformedMaterialCategory);
  } catch (error: any) {
    console.error('Error fetching materialCategory:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch materialCategory' }, { status: 500 });
  }
}