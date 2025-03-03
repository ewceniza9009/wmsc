import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { AppError } from '@/types/error';

// POST /api/auth/register - Register a new user
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { name, email, password } = body;
    
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
    
    // Create new user with default role of worker
    const user = new User({
      name,
      email,
      password,
      role: 'worker', // Default role for self-registered users
    });
    
    await user.save();
    
    // Return success without password
    return NextResponse.json(
      {
        message: 'Registration successful',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role
        }
      },
      { status: 201 }
    );
  } catch (error) {
    const appError = error as AppError;
    console.error('Error registering user:', appError);
    return NextResponse.json(
      { message: 'Internal Server Error', error: appError.message },
      { status: 500 }
    );
  }
}