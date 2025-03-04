import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import  {authOptions} from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import MstCompany from '@/models/MstCompany';

// GET /api/companies - Get all companies
export async function GET(request: NextRequest) {
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

    // Fetch all companies
    const companies = await MstCompany.find({}).sort({ companyName: 1 });

    const transformedCompanies = companies.map(company => ({
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
    }));

    return NextResponse.json(transformedCompanies);
  } catch (error: any) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch companies' }, { status: 500 });
  }
}