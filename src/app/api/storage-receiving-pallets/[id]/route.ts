import dbConnect from '@/lib/mongoose';
import TrnStorageReceiving from '@/models/TrnStorageReceiving';
import TrnStorageReceivingPallet from '@/models/TrnStorageReceivingPallet';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/storage-receiving-pallets/[id] - Get a specific storage receiving pallet by ID
export async function GET(request: NextRequest, context: { params: { id: string } }) {
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

    const { id } = await context.params;

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
export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    // Connect to database
    await dbConnect();

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check authorization
    if (!["admin", "manager"].includes(session.user.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await request.json();

    // Find the storage receiving pallet by ID and update it
    const storageReceivingPallet = await TrnStorageReceivingPallet.findByIdAndUpdate(
      id,
      body,
      {
        new: true, // Return the updated document
      }
    );

    if (!storageReceivingPallet) {
      return NextResponse.json({ message: "Storage receiving pallet not found" }, { status: 404 });
    }

    // Get the storageReceivingId from the updated pallet
    const storageReceivingId = storageReceivingPallet.storageReceivingId;

    // Find all pallets associated with the storage receiving
    const pallets = await TrnStorageReceivingPallet.find({ storageReceivingId });

    // Calculate the total quantity and weight
    let totalQuantity = 0;
    let totalWeight = 0;

    pallets.forEach((pallet) => {
      totalQuantity += pallet.quantity;
      totalWeight += pallet.netWeight;
    });

    // Update the storage receiving record
    await TrnStorageReceiving.findByIdAndUpdate(storageReceivingId, {
      quantity: totalQuantity,
      weight: totalWeight,
    });

    return NextResponse.json({
      message: "Storage receiving pallet updated successfully",
      data: storageReceivingPallet,
    });
  } catch (error: any) {
    console.error("Error updating storage receiving pallet:", error);
    return NextResponse.json({ message: error.message || "Failed to update storage receiving pallet" }, { status: 500 });
  }
}

// DELETE /api/storage-receiving-pallets/[id] - Delete a specific storage receiving pallet by ID
export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
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

        const { id } = await context.params;

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