import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongoose';
import Route from '@/models/Route';
import { AppError } from '@/types/error';

// GET /api/routes - Get all routes
export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    // Find all routes
    const routes = await Route.find({}).sort({ name: 1 });
    
    // Transform the routes to include id instead of _id
    const transformedRoutes = routes.map(route => ({
      id: route._id.toString(),
      path: route.path,
      name: route.name,
      description: route.description,
    }));
    
    return NextResponse.json(transformedRoutes);
  } catch (error) {
    const appError = error as AppError;
    console.error('Error fetching routes:', appError.message);
    return NextResponse.json(
      { message: 'Internal Server Error', error: appError.message },
      { status: 500 }
    );
  }
}