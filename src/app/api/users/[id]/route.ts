import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import mongoose from 'mongoose';
import { AppError } from '@/types/error';

// GET /api/users/[id] - Get a specific user
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    if (session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    await dbConnect();
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    const appError = error as AppError;
    console.error('Error fetching user:', appError);
    return NextResponse.json(
      { message: 'Internal Server Error', error: appError.message },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update a user
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    if (session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    await dbConnect();
    
    const body = await req.json();
    const { name, email, password, role } = body;
    
    // Find user
    const user = await User.findById(id);
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { message: 'User with this email already exists' },
          { status: 400 }
        );
      }
    }
    
    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // This will trigger the pre-save hook to hash the password
    if (role) user.role = role;
    
    await user.save();
    
    return NextResponse.json({
      message: 'User updated successfully',
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
    console.error('Error updating user:', appError);
    return NextResponse.json(
      { message: 'Internal Server Error', error: appError.message },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete a user
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    if (session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    // Prevent deleting yourself
    if (id === session.user.id) {
      return NextResponse.json(
        { message: 'You cannot delete your own account' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    const appError = error as AppError;
    console.error('Error deleting user:', appError);
    return NextResponse.json(
      { message: 'Internal Server Error', error: appError.message },
      { status: 500 }
    );
  }
}