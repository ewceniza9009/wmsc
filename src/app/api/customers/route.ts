import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import  {authOptions} from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import MstCustomer from '@/models/MstCustomer';

// GET /api/customers - Get all customers with pagination and search support
export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can access customers)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

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
          { customerNumber: { $regex: searchTerm, $options: 'i' } },
          { customerName: { $regex: searchTerm, $options: 'i' } },
          { companyName: { $regex: searchTerm, $options: 'i' } },
          { contactPerson: { $regex: searchTerm, $options: 'i' } }
        ]
      };
    }

    // Get total count for pagination
    const totalItems = await MstCustomer.countDocuments(query);
    
    // Fetch customers with pagination and search
    const customers = await MstCustomer.find(query)
      .sort({ customerName: 1 })
      .skip(skip)
      .limit(limit);

    const transformedCustomers = customers.map(customer => ({
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
      updatedDate: customer.updatedDate
    }));

    return NextResponse.json({
      items: transformedCustomers,
      totalItems,
      currentPage: page,
      itemsPerPage: limit
    })
  } catch (error: any) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch customers' }, { status: 500 });
  }
}

// POST /api/customers - Create a new customer
export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can create customers)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Parse request body
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['customerNumber', 'customerName', 'accountId', 'address'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Check if customer with same number already exists
    const existingCustomer = await MstCustomer.findOne({ customerNumber: data.customerNumber });
    if (existingCustomer) {
      return NextResponse.json({ 
        message: `Customer with number ${data.customerNumber} already exists` 
      }, { status: 409 });
    }

    // Create new customer
    const customer = new MstCustomer({
      ...data,
      createdBy: session.user.id,
      updatedBy: session.user.id,
    });

    // Save to database
    await customer.save();

    return NextResponse.json({
      id: customer._id.toString(),
      ...customer.toObject(),
      _id: undefined,
      __v: undefined
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ 
      message: error.message || 'Failed to create customer' 
    }, { status: 500 });
  }
}
