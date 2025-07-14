import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { onboardingResponses, userProfiles, users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { clerkId, answers } = await request.json();

    if (!clerkId || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user exists, if not create one
    let existingUser = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
    
    let userId: number;
    if (existingUser.length === 0) {
      // Create new user
      const newUser = await db.insert(users).values({
        clerkId,
        email: '', // Will be updated when we get user info from Clerk
        name: '', // Will be updated when we get user info from Clerk
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      userId = newUser[0].id;
    } else {
      userId = existingUser[0].id;
    }

    // Save onboarding responses
    for (const [questionId, answer] of Object.entries(answers)) {
      await db.insert(onboardingResponses).values({
        userId,
        questionId: parseInt(questionId),
        answer: String(answer),
      });
    }

    // Check if user profile exists
    const existingProfile = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
    
    if (existingProfile.length === 0) {
      // Create new profile
      await db.insert(userProfiles).values({
        userId,
        experienceLevel: answers[1] || '',
        preferredLanguages: answers[2] || '',
        learningGoals: answers[3] || '',
        hasCompletedOnboarding: true,
        subscriptionTier: 'free',
      });
    } else {
      // Update existing profile
      await db.update(userProfiles)
        .set({
          experienceLevel: answers[1] || '',
          preferredLanguages: answers[2] || '',
          learningGoals: answers[3] || '',
          hasCompletedOnboarding: true,
        })
        .where(eq(userProfiles.userId, userId));
    }

    return NextResponse.json(
      { message: 'Onboarding completed successfully', userId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get('clerkId');

    if (!clerkId) {
      return NextResponse.json(
        { error: 'Missing clerkId parameter' },
        { status: 400 }
      );
    }

    // Get user and their onboarding status
    const user = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
    
    if (user.length === 0) {
      return NextResponse.json(
        { onboardingCompleted: false },
        { status: 200 }
      );
    }

    const profile = await db.select().from(userProfiles).where(eq(userProfiles.userId, user[0].id)).limit(1);
    
    return NextResponse.json({
      hasCompletedOnboarding: profile.length > 0 ? profile[0].hasCompletedOnboarding : false,
      profile: profile.length > 0 ? profile[0] : null,
    });
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}