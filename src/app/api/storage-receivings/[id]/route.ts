import dbConnect from '@/lib/mongoose';
import TrnStorageReceiving from '@/models/TrnStorageReceiving';
import TrnStorageReceivingPallet from '@/models/TrnStorageReceivingPallet';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET /api/storage-receiving/[id] - Get a specific storage receiving record with its pallets
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization
    if (!['admin', 'manager', 'user'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();

    const { id } = await context.params;
    
    // Find the storage receiving record
    const storageReceiving = await TrnStorageReceiving.findById(id);
    
    if (!storageReceiving) {
      return NextResponse.json({ message: 'Storage receiving record not found' }, { status: 404 });
    }
    
    // Find all pallets associated with this storage receiving
    const pallets = await TrnStorageReceivingPallet.find({ storageReceivingId: id });
    
    // Transform the storage receiving data
    const transformedStorageReceiving = {
      id: storageReceiving._id.toString(),
      receivingOrderId: storageReceiving.receivingOrderId ? storageReceiving.receivingOrderId.toString() : null,
      receivingNumber: storageReceiving.receivingNumber,
      warehouseId: storageReceiving.warehouseId.toString(),
      pickFromWarehouseId: storageReceiving.pickFromWarehouseId ? storageReceiving.pickFromWarehouseId.toString() : null,
      storagePickId: storageReceiving.storagePickId ? storageReceiving.storagePickId.toString() : null,
      receivingDate: storageReceiving.receivingDate,
      receivingTime: storageReceiving.receivingTime,
      truckPlateNumber: storageReceiving.truckPlateNumber,
      manufactureDateHeader: storageReceiving.manufactureDateHeader,
      noDaysToPrompAlertHeader: storageReceiving.noDaysToPrompAlertHeader,
      quantity: storageReceiving.quantity,
      weight: storageReceiving.weight,
      containerNumber: storageReceiving.containerNumber,
      remarks: storageReceiving.remarks,
      customerId: storageReceiving.customerId.toString(),
      isFreezing: storageReceiving.isFreezing,
      receivedBy: storageReceiving.receivedBy,
      createdBy: storageReceiving.createdBy.toString(),
      updatedBy: storageReceiving.updatedBy.toString(),
      createdDate: storageReceiving.createdDate,
      updatedDate: storageReceiving.updatedDate,
      isLocked: storageReceiving.isLocked,
      // Include the pallets as a navigational property
      pallets: pallets.map(pallet => ({
        id: pallet._id.toString(),
        storageReceivingId: pallet.storageReceivingId.toString(),
        palletNumber: pallet.palletNumber,
        manualPalletNumber: pallet.manualPalletNumber,
        locationId: pallet.locationId.toString(),
        materialId: pallet.materialId.toString(),
        quantity: pallet.quantity,
        unitId: pallet.unitId.toString(),
        remarks: pallet.remarks,
        boxNumber: pallet.boxNumber,
        vendorBatchNumber: pallet.vendorBatchNumber,
        batchCode: pallet.batchCode,
        expiryDate: pallet.expiryDate,
        noDaysToPrompAlert: pallet.noDaysToPrompAlert,
        manufactureDate: pallet.manufactureDate,
        isDisplayUnitCode: pallet.isDisplayUnitCode,
        weightPerQuantity: pallet.weightPerQuantity,
        grossWeight: pallet.grossWeight,
        packageTareWeight: pallet.packageTareWeight,
        palletTareWeight: pallet.palletTareWeight,
        netWeight: pallet.netWeight,
        arrivalSequenceNo: pallet.arrivalSequenceNo,
        barCode: pallet.barCode,
        sourceBarcode: pallet.sourceBarcode,
        isLastMaterial: pallet.isLastMaterial,
        returnedStoragePickId: pallet.returnedStoragePickId ? pallet.returnedStoragePickId.toString() : null,
        originalBarcode: pallet.originalBarcode,
        isCancelled: pallet.isCancelled,
        createdBy: pallet.createdBy.toString(),
        updatedBy: pallet.updatedBy.toString(),
        createdDate: pallet.createdDate,
        updatedDate: pallet.updatedDate,
        isLocked: pallet.isLocked
      }))
    };
    
    return NextResponse.json(transformedStorageReceiving);
  } catch (error: any) {
    console.error('Error fetching storage receiving record:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch storage receiving record' }, { status: 500 });
  }
}

// PUT /api/storage-receiving/[id] - Update a storage receiving record with its pallets
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    
    const body = await req.json();
    
    // Validate required fields
    const requiredFields = ['receivingNumber', 'warehouseId', 'receivingDate', 'receivingTime', 'customerId'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    const { id } = await context.params;

    // Check if storage receiving exists
    const storageReceiving = await TrnStorageReceiving.findById(id);
    if (!storageReceiving) {
      return NextResponse.json({ message: 'Storage receiving record not found' }, { status: 404 });
    }

    // Check if receiving number already exists (for another storage receiving)
    const existingReceiving = await TrnStorageReceiving.findOne({ 
      receivingNumber: body.receivingNumber,
      _id: { $ne: id }
    });
    
    if (existingReceiving) {
      return NextResponse.json({ 
        message: 'Storage receiving with this receiving number already exists' 
      }, { status: 400 });
    }

    // Start a transaction
    const session_db = await mongoose.startSession();
    session_db.startTransaction();

    try {
      // Update the storage receiving record
      const updatedStorageReceiving = await TrnStorageReceiving.findByIdAndUpdate(
        id,
        {
          ...body,
          updatedBy: session.user.id
        },
        { new: true, session: session_db }
      );

      // Process pallets if provided
      if (body.pallets && Array.isArray(body.pallets)) {
        // Get existing pallet IDs for this storage receiving
        const existingPallets = await TrnStorageReceivingPallet.find({ 
          storageReceivingId: id 
        }, '_id', { session: session_db });
        
        const existingPalletIds = existingPallets.map(p => p._id.toString());
        const incomingPalletIds = body.pallets
          .filter((p: any) => p.id)
          .map((p: any) => p.id);
        
        // Find pallets to delete (existing but not in incoming)
        const palletIdsToDelete = existingPalletIds.filter(
          existingId => !incomingPalletIds.includes(existingId)
        );
        
        // Delete pallets that are no longer in the list
        if (palletIdsToDelete.length > 0) {
          await TrnStorageReceivingPallet.deleteMany({
            _id: { $in: palletIdsToDelete },
            storageReceivingId: id
          }, { session: session_db });
        }
        
        // Update or create pallets
        for (const pallet of body.pallets) {
          if (pallet.id) {
            // Update existing pallet
            await TrnStorageReceivingPallet.findByIdAndUpdate(
              pallet.id,
              {
                ...pallet,
                storageReceivingId: id, // Ensure correct parent ID
                updatedBy: session.user.id
              },
              { session: session_db }
            );
          } else {
            // Create new pallet
            const newPallet = new TrnStorageReceivingPallet({
              ...pallet,
              storageReceivingId: id,
              createdBy: session.user.id,
              updatedBy: session.user.id
            });
            await newPallet.save({ session: session_db });
          }
        }
      }

      // Commit the transaction
      await session_db.commitTransaction();
      session_db.endSession();

      return NextResponse.json({
        message: 'Storage receiving updated successfully',
        id: updatedStorageReceiving._id.toString()
      });
    } catch (error: any) {
      // Abort transaction on error
      await session_db.abortTransaction();
      session_db.endSession();
      throw error;
    }
  } catch (error: any) {
    console.error('Error updating storage receiving:', error);
    return NextResponse.json({ message: error.message || 'Failed to update storage receiving' }, { status: 500 });
  }
}