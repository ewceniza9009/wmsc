import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import MstCustomer from '@/models/MstCustomer';

// GET /api/customers/[id] - Get a specific customer
export async function GET(req: NextRequest, context : { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can access customers)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();

    const {id} = await context.params;
    
    const customer = await MstCustomer.findById(id);
    
    if (!customer) {
      return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
    }
    
    // Transform the customer data to return a clean object
    const transformedCustomer = {
      id: customer._id.toString(),
      customerNumber: customer.customerNumber,
      customerName: customer.customerName,
      accountId: customer.accountId,
      creditLimit: customer.creditLimit,
      termId: customer.termId,
      address: customer.address,
      emailAddress: customer.emailAddress,
      tinNumber: customer.tinNumber,
      faxNumber: customer.faxNumber,
      contactNumber: customer.contactNumber,
      contactPerson: customer.contactPerson,
      contactPosition: customer.contactPosition,
      salesPerson: customer.salesPerson,
      companyName: customer.companyName,
      billingAddress: customer.billingAddress,
      shippingAddress: customer.shippingAddress,
      taxId: customer.taxId,
      isLocked: customer.isLocked,
      status: customer.status,
      createdBy: customer.createdBy,
      updatedBy: customer.updatedBy,
      createdDate: customer.createdDate,
      updatedDate: customer.updatedDate,
    };
    
    return NextResponse.json(transformedCustomer);
  } catch (error: any) {
    console.error('Error fetching customer:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch customer' }, { status: 500 });
  }
}

// PUT /api/customers/[id] - Update a customer
export async function PUT(req: NextRequest, context : { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can update customers)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    
    const body = await req.json();
    
    // Validate required fields
    if (!body.customerNumber || !body.customerName || !body.accountId || !body.address) {
      return NextResponse.json({ 
        message: 'Missing required fields: customerNumber, customerName, accountId, and address are required' 
      }, { status: 400 });
    }

    const {id} = await context.params;

    // Check if customer exists
    const customer = await MstCustomer.findById(id);
    if (!customer) {
      return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
    }

    // Check if customer number already exists (for another customer)
    const existingCustomer = await MstCustomer.findOne({ 
      customerNumber: body.customerNumber,
      _id: { $ne: id }
    });
    
    if (existingCustomer) {
      return NextResponse.json({ 
        message: `Customer with number ${body.customerNumber} already exists` 
      }, { status: 409 });
    }

    // Update customer with the current user as updatedBy
    const updatedCustomer = await MstCustomer.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedBy: session.user.id,
      },
      { new: true, runValidators: true }
    );
    
    // Transform the updated customer data to return a clean object
    const transformedCustomer = {
      id: updatedCustomer._id.toString(),
      ...updatedCustomer.toObject(),
      _id: undefined,
      __v: undefined
    };
    
    return NextResponse.json(transformedCustomer);
  } catch (error: any) {
    console.error('Error updating customer:', error);
    return NextResponse.json({ message: error.message || 'Failed to update customer' }, { status: 500 });
  }
}

// DELETE /api/customers/[id] - Delete a customer
export async function DELETE(req: NextRequest, context : { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can delete customers)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    
    const {id} = await context.params;

    // Check if customer exists
    const customer = await MstCustomer.findById(id);
    if (!customer) {
      return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
    }

    // Delete customer
    await MstCustomer.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Customer deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting customer:', error);
    return NextResponse.json({ message: error.message || 'Failed to delete customer' }, { status: 500 });
  }
}

