import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import UserRight from '@/models/UserRight';
import { AppError } from '@/types/error';
import mongoose from 'mongoose';

// GET /api/user-rights?userId=123 - Get user rights for a specific user
export async function GET(req: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    if (session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    await dbConnect();
    
    // Find all user rights for the specified user
    const userRights = await UserRight.find({ userId })
      .populate('routeId', 'path name description')
      .sort({ 'routeId.name': 1 });
    
    // Transform the user rights to include id instead of _id
    const transformedUserRights = userRights.map(right => ({
      id: right._id.toString(),
      userId: right.userId.toString(),
      routeId: right.routeId._id.toString(),
      routePath: right.routeId.path,
      routeName: right.routeId.name,
      routeDescription: right.routeId.description,
      canAdd: right.canAdd,
      canEdit: right.canEdit,
      canSave: right.canSave,
      canDelete: right.canDelete,
      canPrint: right.canPrint,
    }));
    
    return NextResponse.json(transformedUserRights);
  } catch (error) {
    const appError = error as AppError;
    console.error('Error fetching user rights:', appError.message);
    return NextResponse.json(
      { message: 'Internal Server Error', error: appError.message },
      { status: 500 }
    );
  }
}

// POST /api/user-rights - Update or create user rights
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
    const { userId, rights } = body;
    
    // Validate required fields
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }
    
    if (!rights || !Array.isArray(rights) || rights.length === 0) {
      return NextResponse.json({ message: 'Rights data is required' }, { status: 400 });
    }
    
    const updatedRights = [];
    
    // Process each right in the array
    for (const right of rights) {
      const { routeId, canAdd, canEdit, canSave, canDelete, canPrint } = right;
      
      if (!routeId || !mongoose.Types.ObjectId.isValid(routeId)) {
        return NextResponse.json({ message: 'Invalid route ID' }, { status: 400 });
      }
      
      // Find existing right or create new one
      let userRight = await UserRight.findOne({ userId, routeId });
      
      if (userRight) {
        // Update existing right
        userRight.canAdd = canAdd !== undefined ? canAdd : userRight.canAdd;
        userRight.canEdit = canEdit !== undefined ? canEdit : userRight.canEdit;
        userRight.canSave = canSave !== undefined ? canSave : userRight.canSave;
        userRight.canDelete = canDelete !== undefined ? canDelete : userRight.canDelete;
        userRight.canPrint = canPrint !== undefined ? canPrint : userRight.canPrint;
      } else {
        // Create new right
        userRight = new UserRight({
          userId,
          routeId,
          canAdd: canAdd || false,
          canEdit: canEdit || false,
          canSave: canSave || false,
          canDelete: canDelete || false,
          canPrint: canPrint || false,
        });
      }
      
      await userRight.save();
      updatedRights.push({
        id: userRight._id.toString(),
        userId: userRight.userId.toString(),
        routeId: userRight.routeId.toString(),
        canAdd: userRight.canAdd,
        canEdit: userRight.canEdit,
        canSave: userRight.canSave,
        canDelete: userRight.canDelete,
        canPrint: userRight.canPrint,
      });
    }
    
    return NextResponse.json({
      message: 'User rights updated successfully',
      rights: updatedRights
    }, { status: 200 });
  } catch (error) {
    const appError = error as AppError;
    console.error('Error updating user rights:', appError.message);
    return NextResponse.json(
      { message: 'Internal Server Error', error: appError.message },
      { status: 500 }
    );
  }
}