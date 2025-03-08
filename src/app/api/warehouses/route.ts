import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import MstWarehouse from '@/models/MstWarehouse';

// GET /api/warehouses - Get all warehouses with pagination and search
export async function GET(req: NextRequest) {
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
    
    // Get query parameters for pagination and search
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Build search query
    const searchQuery = search
      ? {
          $or: [
            { warehouseCode: { $regex: search, $options: 'i' } },
            { warehouseName: { $regex: search, $options: 'i' } },
            { address: { $regex: search, $options: 'i' } },
          ],
        }
      : {};
    
    // Get total count for pagination
    const total = await MstWarehouse.countDocuments(searchQuery);
    
    // Fetch warehouses with pagination and search
    const warehouses = await MstWarehouse.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const transformedWarehouses = warehouses.map(warehouse => ({
      id: warehouse._id.toString(),
      warehouseCode: warehouse.warehouseCode,
      warehouseName: warehouse.warehouseName,
      companyId: warehouse.companyId.toString(), // Reference to MstCompany
      address: warehouse.address,
      contact: warehouse.contact,
      contactNumber: warehouse.contactNumber,
      createdAt: warehouse.createdAt,
      updatedAt: warehouse.updatedAt
    }));
    
    return NextResponse.json({
      data: transformedWarehouses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error fetching warehouses:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch warehouses' }, { status: 500 });
  }
}

// POST /api/warehouses - Create a new warehouse
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can create warehouses)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    
    const body = await req.json();
    
    // Validate required fields
    if (!body.warehouseCode || !body.warehouseName || !body.companyId || !body.address) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if warehouse code already exists
    const existingWarehouse = await MstWarehouse.findOne({ warehouseCode: body.warehouseCode });
    if (existingWarehouse) {
      return NextResponse.json({ message: 'Warehouse code already exists' }, { status: 400 });
    }

    const warehouse = await MstWarehouse.create(body);
    
    return NextResponse.json(warehouse, { status: 201 });
  } catch (error: any) {
    console.error('Error creating warehouse:', error);
    return NextResponse.json({ message: error.message || 'Failed to create warehouse' }, { status: 500 });
  }
}