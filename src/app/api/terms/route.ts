import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongoose";
import MstTerm from "@/models/MstTerm";
import mongoose, { isValidObjectId } from "mongoose";

// GET /api/terms - Get terms with pagination and search
export async function GET(request: NextRequest) {
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

    // Check authorization (only admin and manager can access terms)
    if (session.user?.role && !['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    // Fetch all companies
    const companies = await MstTerm.find({}).sort({ companyName: 1 });

    const transformedTerms = companies.map(term => ({
      id: term._id.toString(),
      terms: term.terms,
      termsValue: term.termsValue,
      isLocked: term.isLocked
    }));

    return NextResponse.json(transformedTerms);

  } catch (error) {
    console.error("Error fetching terms:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST /api/terms - Create a new term
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

    // Check authorization (only admin and manager can create terms)
    if (session.user?.role && !['admin', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Connect to the database
    await dbConnect();

    // Parse request body
    const body = await request.json();
    const { terms, termsValue, isLocked } = body;

    // Validate required fields
    if (!terms || !termsValue) {
      return NextResponse.json(
        { message: "Term number and term name are required" },
        { status: 400 }
      );
    }

    // Check if term with the same number already exists
    const existingTerm = await MstTerm.findOne({ terms });
    if (existingTerm) {
      return NextResponse.json(
        { message: "An term with this term number already exists" },
        { status: 409 }
      );
    }

    // Create new term
    const newTerm = new MstTerm({
      terms,
      termsValue,
      isLocked: isLocked || false,
    });

    // Save the term to the database
    await newTerm.save();

    // Return the created term
    return NextResponse.json(
      {
        message: "Term created successfully",
        term: {
          id: newTerm.id.toString(),
          terms: newTerm.terms,
          termsValue: newTerm.termsValue,
          isLocked: newTerm.isLocked
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating term:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
