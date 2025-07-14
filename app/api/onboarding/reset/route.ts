import { NextRequest, NextResponse } from 'next/server';
import { resetUserOnboarding } from '@/lib/db-utils';

export async function POST(request: NextRequest) {
  try {
    const { clerkId } = await request.json();

    if (!clerkId) {
      return NextResponse.json(
        { error: 'Missing clerkId parameter' },
        { status: 400 }
      );
    }

    // Only allow in development environment for safety
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'This endpoint is only available in development' },
        { status: 403 }
      );
    }

    const result = await resetUserOnboarding(clerkId);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error resetting onboarding:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}