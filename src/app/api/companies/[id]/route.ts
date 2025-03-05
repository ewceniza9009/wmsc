import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import MstCompany from '@/models/MstCompany';

// GET /api/companies/[id] - Get a specific company
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Connect to database
    await dbConnect();

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can access companies)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Fetch the company
    const company = await MstCompany.findById(params.id);
    if (!company) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }

    // Transform the company data
    const transformedCompany = {
      id: company._id.toString(),
      companyName: company.companyName,
      companyAddress: company.companyAddress,
      contactPerson: company.contactPerson,
      contactNo: company.contactNo,
      tiin: company.tiin,
      bookNumber: company.bookNumber,
      accreditationNumber: company.accreditationNumber,
      serialNumber: company.serialNumber,
      permitNumber: company.permitNumber,
      accountant: company.accountant,
      financeManager: company.financeManager,
      operationsManager: company.operationsManager,
      managingDirector: company.managingDirector,
      defaultApproveBy: company.defaultApproveBy,
      imagePath: company.imagePath,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt
    };

    return NextResponse.json(transformedCompany);
  } catch (error: any) {
    console.error('Error fetching company:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch company' }, { status: 500 });
  }
}

// PUT /api/companies/[id] - Update a company
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Connect to database
    await dbConnect();

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can update companies)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Get request body
    const body = await request.json();

    // Update the company
    const updatedCompany = await MstCompany.findByIdAndUpdate(
      params.id,
      {
        companyName: body.companyName,
        companyAddress: body.companyAddress,
        contactPerson: body.contactPerson,
        contactNo: body.contactNo,
        tiin: body.tiin,
        bookNumber: body.bookNumber,
        accreditationNumber: body.accreditationNumber,
        serialNumber: body.serialNumber,
        permitNumber: body.permitNumber,
        accountant: body.accountant,
        financeManager: body.financeManager,
        operationsManager: body.operationsManager,
        managingDirector: body.managingDirector,
        defaultApproveBy: body.defaultApproveBy,
        imagePath: body.imagePath,
      },
      { new: true, runValidators: true }
    );

    if (!updatedCompany) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Company updated successfully' });
  } catch (error: any) {
    console.error('Error updating company:', error);
    return NextResponse.json({ message: error.message || 'Failed to update company' }, { status: 500 });
  }
}

// DELETE /api/companies/[id] - Delete a company
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Connect to database
    await dbConnect();

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check authorization (only admin and manager can delete companies)
    if (!['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Delete the company
    const deletedCompany = await MstCompany.findByIdAndDelete(params.id);
    if (!deletedCompany) {
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Company deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting company:', error);
    return NextResponse.json({ message: error.message || 'Failed to delete company' }, { status: 500 });
  }
}