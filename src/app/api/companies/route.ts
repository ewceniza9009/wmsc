import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import  {authOptions} from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import MstCompany from '@/models/MstCompany';

// GET /api/companies - Get all companies with pagination and search support
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
          { companyName: { $regex: searchTerm, $options: 'i' } },
          { companyAddress: { $regex: searchTerm, $options: 'i' } },
          { contactPerson: { $regex: searchTerm, $options: 'i' } }
        ]
      };
    }

    // Get total count for pagination
    const totalItems = await MstCompany.countDocuments(query);
    
    // Fetch companies with pagination and search
    const companies = await MstCompany.find(query)
      .sort({ companyName: 1 })
      .skip(skip)
      .limit(limit);

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

    return NextResponse.json({
      items: transformedCompanies,
      totalItems,
      currentPage: page,
      itemsPerPage: limit
    })
  } catch (error: any) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch companies' }, { status: 500 });
  }
}