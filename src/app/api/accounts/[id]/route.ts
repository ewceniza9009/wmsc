import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import MstAccount from '@/models/MstAccount';

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
    
    const account = await MstAccount.findById(id);
    
    if (!account) {
      return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
    }
    
    const transformedAccount = {
      id: account._id.toString(),
      accountNumber: account.accountNumber,
      accountName: account.accountName,
      remarks: account.remarks,
      isActive: account.isActive
    };
    
    return NextResponse.json(transformedAccount);
  } catch (error: any) {
    console.error('Error fetching customer:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch customer' }, { status: 500 });
  }
}