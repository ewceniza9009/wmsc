import dbConnect from '@/lib/mongoose';
import MstUnit from '@/models/MstUnit';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/units - Get all units
export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can access units)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Get query parameters for search
    const url = new URL(request.url);
    const searchTerm = url.searchParams.get('search') || '';
    
    // Build search query if search term is provided
    let query = {};
    if (searchTerm) {
      query = {
        $or: [
          { unitNumber: { $regex: searchTerm, $options: 'i' } },
          { unitName: { $regex: searchTerm, $options: 'i' } }
        ]
      };
    }
    
    // Fetch all units
    const units = await MstUnit.find(query)
      .select('_id unitNumber unitName')
      .sort({ unitName: 1 })
      .lean();
    
    // Format the response
    const formattedUnits = units.map(unit => ({
      id: unit._id.toString(),
      unitCode: unit.unitNumber,
      unitName: unit.unitName
    }));

    return NextResponse.json(formattedUnits);
  } catch (error) {
    console.error('Error fetching units:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}