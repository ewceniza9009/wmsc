import dbConnect from '@/lib/mongoose';
import TrnStorageReceivingPallet from '@/models/TrnStorageReceivingPallet';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/storage-receiving-pallets/[id] - Get a specific storage receiving pallet by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Connect to database
    await dbConnect();

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization
    if (!['admin', 'manager', 'user'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;

    // Find the storage receiving pallet by ID
    const storageReceivingPallet = await TrnStorageReceivingPallet.findById(id);

    if (!storageReceivingPallet) {
      return NextResponse.json({ message: 'Storage receiving pallet not found' }, { status: 404 });
    }

    const transformedStorageReceivingPallet = {
      id: storageReceivingPallet._id.toString(),
      storageReceivingId: storageReceivingPallet.storageReceivingId.toString(),
      palletNumber: storageReceivingPallet.palletNumber,
      manufactureDate: storageReceivingPallet.manufactureDate,
      expirationDate: storageReceivingPallet.expirationDate,
      quantity: storageReceivingPallet.quantity,
      weight: storageReceivingPallet.weight,
      remarks: storageReceivingPallet.remarks,
      createdBy: storageReceivingPallet.createdBy.toString(),
      updatedBy: storageReceivingPallet.updatedBy.toString(),
      createdDate: storageReceivingPallet.createdDate,
      updatedDate: storageReceivingPallet.updatedDate
    };

    return NextResponse.json(transformedStorageReceivingPallet);
  } catch (error: any) {
    console.error('Error fetching storage receiving pallet:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch storage receiving pallet' }, { status: 500 });
  }
}

// PUT /api/storage-receiving-pallets/[id] - Update a specific storage receiving pallet by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Connect to database
        await dbConnect();

        // Get user session
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Check authorization
        if (!['admin', 'manager'].includes(session.user.role)) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const { id } = params;
        const body = await request.json();

        // Find the storage receiving pallet by ID and update it
        const storageReceivingPallet = await TrnStorageReceivingPallet.findByIdAndUpdate(id, body, {
            new: true, // Return the updated document
        });

        if (!storageReceivingPallet) {
            return NextResponse.json({ message: 'Storage receiving pallet not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Storage receiving pallet updated successfully', data: storageReceivingPallet });
    } catch (error: any) {
        console.error('Error updating storage receiving pallet:', error);
        return NextResponse.json({ message: error.message || 'Failed to update storage receiving pallet' }, { status: 500 });
    }
}

// DELETE /api/storage-receiving-pallets/[id] - Delete a specific storage receiving pallet by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Connect to database
        await dbConnect();

        // Get user session
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Check authorization
        if (!['admin', 'manager'].includes(session.user.role)) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const { id } = params;

        // Find the storage receiving pallet by ID and delete it
        const storageReceivingPallet = await TrnStorageReceivingPallet.findByIdAndDelete(id);

        if (!storageReceivingPallet) {
            return NextResponse.json({ message: 'Storage receiving pallet not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Storage receiving pallet deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting storage receiving pallet:', error);
        return NextResponse.json({ message: error.message || 'Failed to delete storage receiving pallet' }, { status: 500 });
    }
}