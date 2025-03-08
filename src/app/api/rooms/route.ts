import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import MstRoom from '@/models/MstRoom';

// GET /api/rooms - Get all rooms with pagination and search support
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can access rooms)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    
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
          { roomNumber: { $regex: searchTerm, $options: 'i' } },
          { roomName: { $regex: searchTerm, $options: 'i' } }
        ]
      };
    }

    // Get total count for pagination
    const totalItems = await MstRoom.countDocuments(query);
    
    // Fetch rooms with pagination and search
    const rooms = await MstRoom.find(query)
      .sort({ createdDate: -1 })
      .skip(skip)
      .limit(limit);

    const transformedRooms = rooms.map(room => ({
      id: room._id.toString(),
      roomNumber: room.roomNumber,
      roomName: room.roomName,
      temperatureFrom: room.temperatureFrom,
      temperatureTo: room.temperatureTo,
      createdBy: room.createdBy,
      updatedBy: room.updatedBy,
      createdDate: room.createdDate,
      updatedDate: room.updatedDate,
      __v: room.__v
    }));
    
    return NextResponse.json({
      items: transformedRooms,
      totalItems,
      currentPage: page,
      itemsPerPage: limit
    });
  } catch (error: any) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch rooms' }, { status: 500 });
  }
}

// POST /api/rooms - Create a new room
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can create rooms)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    
    const body = await req.json();
    
    // Validate required fields
    if (!body.roomNumber || !body.roomName) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if room number already exists
    const existingRoom = await MstRoom.findOne({ roomNumber: body.roomNumber });
    if (existingRoom) {
      return NextResponse.json({ message: 'Room number already exists' }, { status: 400 });
    }

    // Add user ID to created by field
    body.createdBy = session.user.id;

    const room = await MstRoom.create(body);
    
    return NextResponse.json(room, { status: 201 });
  } catch (error: any) {
    console.error('Error creating room:', error);
    return NextResponse.json({ message: error.message || 'Failed to create room' }, { status: 500 });
  }
}
