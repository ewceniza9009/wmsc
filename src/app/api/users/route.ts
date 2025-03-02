import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { AppError } from '@/types/error';

// GET /api/users - Get all users
export async function GET() {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    if (session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    
    // Find all users but don't return passwords
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    
    // Transform the users to include id instead of _id
    const transformedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
    
    return NextResponse.json(transformedUsers);
  } catch (error) {
    const appError = error as AppError;
    console.error('Error fetching users:', appError.message);
    return NextResponse.json(
      { message: 'Internal Server Error', error: appError.message },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(req: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    if (session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    
    const body = await req.json();
    const { name, email, password, role } = body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || 'worker', // Default to worker if no role provided
    });
    
    await user.save();
    
    // Return user without password
    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      },
      { status: 201 }
    );
  } catch (error) {
    const appError = error as AppError;
    console.error('Error creating user:', appError);
    return NextResponse.json(
      { message: 'Internal Server Error', error: appError.message },
      { status: 500 }
    );
  }
}