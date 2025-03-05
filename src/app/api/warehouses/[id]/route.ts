import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import MstWarehouse from '@/models/MstWarehouse';

// GET /api/warehouses/[id] - Get a specific warehouse
export async function GET(req: NextRequest, context : { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can access warehouses)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();

    const {id} = await context.params;
    
    const warehouse = await MstWarehouse.findById(id);
    
    if (!warehouse) {
      return NextResponse.json({ message: 'Warehouse not found' }, { status: 404 });
    }
    
    return NextResponse.json(warehouse);
  } catch (error: any) {
    console.error('Error fetching warehouse:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch warehouse' }, { status: 500 });
  }
}

// PUT /api/warehouses/[id] - Update a warehouse
export async function PUT(req: NextRequest, context : { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can update warehouses)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    
    const body = await req.json();
    
    // Validate required fields
    if (!body.warehouseCode || !body.warehouseName || !body.companyId || !body.address) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const {id} = await context.params;

    // Check if warehouse exists
    const warehouse = await MstWarehouse.findById(id);
    if (!warehouse) {
      return NextResponse.json({ message: 'Warehouse not found' }, { status: 404 });
    }

    // Check if warehouse code already exists (for another warehouse)
    const existingWarehouse = await MstWarehouse.findOne({ 
      warehouseCode: body.warehouseCode,
      _id: { $ne: id }
    });
    
    if (existingWarehouse) {
      return NextResponse.json({ message: 'Warehouse code already exists' }, { status: 400 });
    }

    // Update warehouse
    const updatedWarehouse = await MstWarehouse.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(updatedWarehouse);
  } catch (error: any) {
    console.error('Error updating warehouse:', error);
    return NextResponse.json({ message: error.message || 'Failed to update warehouse' }, { status: 500 });
  }
}

// DELETE /api/warehouses/[id] - Delete a warehouse
export async function DELETE(req: NextRequest, context : { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can delete warehouses)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    
    const {id} = await context.params;

    // Check if warehouse exists
    const warehouse = await MstWarehouse.findById(id);
    if (!warehouse) {
      return NextResponse.json({ message: 'Warehouse not found' }, { status: 404 });
    }

    // Delete warehouse
    await MstWarehouse.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Warehouse deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting warehouse:', error);
    return NextResponse.json({ message: error.message || 'Failed to delete warehouse' }, { status: 500 });
  }
}