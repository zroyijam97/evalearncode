import { NextResponse } from 'next/server';
import { testDatabaseConnection, getAllCourses } from '@/lib/db-utils';

export async function GET() {
  try {
    // Test database connection
    const isConnected = await testDatabaseConnection();
    
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Get all courses to verify data access
    const courses = await getAllCourses();

    return NextResponse.json({
      message: 'Database connection successful!',
      connected: true,
      coursesCount: courses.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        error: 'Database test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}