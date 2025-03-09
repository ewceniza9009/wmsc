import dbConnect from "@/lib/mongoose";
import MstTax from "@/models/MstTax";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

// GET /api/taxs - Get taxs with pagination and search
export async function GET() {
  try {
    // Connect to the database
    await dbConnect();

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check authorization (only admin and manager can access taxs)
    if (session.user?.role && !['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Fetch all companies
    const companies = await MstTax.find({}).sort({ companyName: 1 });

    const transformedTaxs = companies.map(tax => ({
      id: tax._id.toString(),
      taxType: tax.taxType,
      taxCode: tax.taxCode,
      rate: tax.rate,
      accountId: tax.accountId
    }));

    return NextResponse.json(transformedTaxs);

  } catch (error) {
    console.error("Error fetching taxs:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST /api/taxs - Create a new tax
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check authorization (only admin and manager can create taxs)
    if (session.user?.role && !['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Connect to the database
    await dbConnect();

    // Parse request body
    const body = await request.json();
    const { taxType, taxCode, rate, accountId } = body;

    // Validate required fields
    if (!taxType || !taxCode) {
      return NextResponse.json(
        { message: "Tax number and tax name are required" },
        { status: 400 }
      );
    }

    // Check if tax with the same number already exists
    const existingTax = await MstTax.findOne({ taxCode });
    if (existingTax) {
      return NextResponse.json(
        { message: "A tax with this tax type already exists" },
        { status: 409 }
      );
    }

    // Create new tax
    const newTax = new MstTax({
      taxType,
      taxCode,
      rate,
      accountId,
    });

    // Save the tax to the database
    await newTax.save();

    // Return the created tax
    return NextResponse.json(
      {
        message: "Tax created successfully",
        tax: {
          id: newTax.id.toString(),
          taxType: newTax.taxType,
          taxCode: newTax.taxCode,
          rate: newTax.rate,
          accountId: newTax.accountId
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating tax:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
