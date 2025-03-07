import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { AppError } from '@/types/error';

// GET /api/user/profile - Get current user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    // Find the user by ID
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return user data without sensitive information
    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    const appError = error as AppError;
    console.error('Error getting user profile:', appError);
    return NextResponse.json(
      { message: 'Internal Server Error', error: appError.message },
      { status: 500 }
    );
  }
}

// PATCH /api/user/profile - Update user profile
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const body = await req.json();
    const { name, email } = body;
    
    // Validate required fields
    if (!name && !email) {
      return NextResponse.json(
        { message: 'At least one field (name or email) is required to update' },
        { status: 400 }
      );
    }
    
    // Find the user by ID
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if new email already exists for a different user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== session.user.id) {
        return NextResponse.json(
          { message: 'Email already in use by another account' },
          { status: 400 }
        );
      }
    }
    
    // Update user fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    
    // Save the updated user
    await user.save();
    
    // Return updated user data
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    const appError = error as AppError;
    console.error('Error updating user profile:', appError);
    
    // Handle validation errors from Mongoose
    if (appError.name === 'ValidationError') {
      return NextResponse.json(
        { message: 'Validation Error', error: appError.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal Server Error', error: appError.message },
      { status: 500 }
    );
  }
}

