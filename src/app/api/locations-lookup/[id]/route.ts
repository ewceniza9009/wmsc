import dbConnect from '@/lib/mongoose';
import MstLocation from '@/models/MstLocation';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/locations/[id] - Get a specific location
export async function GET(req: NextRequest, context : { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can access locations)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();

    const {id} = await context.params;
    
    const location = await MstLocation.findById(id);
    
    if (!location) {
      return NextResponse.json({ message: 'Location not found' }, { status: 404 });
    }
    
    const transformedLocation = {
      id: location._id.toString(),
      locationNumber: location.locationNumber,
      locationName: location.locationName
    };
    
    return NextResponse.json(transformedLocation);
  } catch (error: any) {
    console.error('Error fetching location:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch location' }, { status: 500 });
  }
}