import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import MstRoom from '@/models/MstRoom';

// GET /api/rooms/[id] - Get a specific room
export async function GET(req: NextRequest, context : { params: { id: string } }) {
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

    const {id} = await context.params;
    
    const room = await MstRoom.findById(id);
    
    if (!room) {
      return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    }
    
    return NextResponse.json(room);
  } catch (error: any) {
    console.error('Error fetching room:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch room' }, { status: 500 });
  }
}

// PUT /api/rooms/[id] - Update a room
export async function PUT(req: NextRequest, context : { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can update rooms)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    
    const body = await req.json();
    
    // Validate required fields
    if (!body.roomNumber || !body.roomName) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const {id} = await context.params;

    // Check if room exists
    const room = await MstRoom.findById(id);
    if (!room) {
      return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    }

    // Check if room number already exists (for another room)
    const existingRoom = await MstRoom.findOne({ 
      roomNumber: body.roomNumber,
      _id: { $ne: id }
    });
    
    if (existingRoom) {
      return NextResponse.json({ message: 'Room number already exists' }, { status: 400 });
    }

    // Add user ID to updated by field
    body.updatedBy = session.user.id;

    // Update room
    const updatedRoom = await MstRoom.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(updatedRoom);
  } catch (error: any) {
    console.error('Error updating room:', error);
    return NextResponse.json({ message: error.message || 'Failed to update room' }, { status: 500 });
  }
}

// DELETE /api/rooms/[id] - Delete a room
export async function DELETE(req: NextRequest, context : { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can delete rooms)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    
    const {id} = await context.params;

    // Check if room exists
    const room = await MstRoom.findById(id);
    if (!room) {
      return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    }

    // Delete room
    await MstRoom.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Room deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting room:', error);
    return NextResponse.json({ message: error.message || 'Failed to delete room' }, { status: 500 });
  }
}
