import { db } from './db';
import { users, courses, lessons, enrollments, userProgress, userProfiles } from './schema';
import { eq, and } from 'drizzle-orm';

// User operations
export async function createUser(clerkId: string, email: string, name: string) {
  try {
    const [user] = await db.insert(users).values({
      clerkId,
      email,
      name,
    }).returning();
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId));
    return user;
  } catch (error) {
    console.error('Error getting user by Clerk ID:', error);
    throw error;
  }
}

// Course operations
export async function getAllCourses() {
  try {
    return await db.select().from(courses).where(eq(courses.isPublished, true));
  } catch (error) {
    console.error('Error getting all courses:', error);
    throw error;
  }
}

export async function getCourseById(courseId: number) {
  try {
    const [course] = await db.select().from(courses).where(eq(courses.id, courseId));
    return course;
  } catch (error) {
    console.error('Error getting course by ID:', error);
    throw error;
  }
}

// Lesson operations
export async function getLessonsByCourseId(courseId: number) {
  try {
    return await db.select().from(lessons)
      .where(and(eq(lessons.courseId, courseId), eq(lessons.isPublished, true)))
      .orderBy(lessons.orderIndex);
  } catch (error) {
    console.error('Error getting lessons by course ID:', error);
    throw error;
  }
}

// Enrollment operations
export async function enrollUserInCourse(userId: number, courseId: number) {
  try {
    const [enrollment] = await db.insert(enrollments).values({
      userId,
      courseId,
    }).returning();
    return enrollment;
  } catch (error) {
    console.error('Error enrolling user in course:', error);
    throw error;
  }
}

export async function getUserEnrollments(userId: number) {
  try {
    return await db.select({
      id: enrollments.id,
      enrolledAt: enrollments.enrolledAt,
      course: courses,
    })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.userId, userId));
  } catch (error) {
    console.error('Error getting user enrollments:', error);
    throw error;
  }
}

// Progress operations
export async function markLessonComplete(userId: number, courseId: number, lessonId: number) {
  try {
    const [progress] = await db.insert(userProgress).values({
      userId,
      courseId,
      lessonId,
      isCompleted: true,
      completedAt: new Date(),
    }).returning();
    return progress;
  } catch (error) {
    console.error('Error marking lesson complete:', error);
    throw error;
  }
}

export async function getUserProgress(userId: number, courseId: number) {
  try {
    return await db.select()
      .from(userProgress)
      .where(and(
        eq(userProgress.userId, userId),
        eq(userProgress.courseId, courseId)
      ));
  } catch (error) {
    console.error('Error getting user progress:', error);
    throw error;
  }
}

// Onboarding operations
export async function getUserOnboardingStatus(clerkId: string) {
  try {
    const user = await getUserByClerkId(clerkId);
    if (!user) {
      return { hasCompletedOnboarding: false, profile: null };
    }

    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, user.id));
    return {
      hasCompletedOnboarding: profile?.hasCompletedOnboarding || false,
      profile: profile || null,
    };
  } catch (error) {
    console.error('Error getting user onboarding status:', error);
    throw error;
  }
}

export async function resetUserOnboarding(clerkId: string) {
  try {
    const user = await getUserByClerkId(clerkId);
    if (!user) {
      throw new Error('User not found');
    }

    // Reset onboarding status in user profile
    await db.update(userProfiles)
      .set({ hasCompletedOnboarding: false })
      .where(eq(userProfiles.userId, user.id));

    return { success: true, message: 'Onboarding status reset successfully' };
  } catch (error) {
    console.error('Error resetting user onboarding:', error);
    throw error;
  }
}

// Test connection
export async function testDatabaseConnection() {
  try {
    const result = await db.select().from(users).limit(1);
    console.log('Database connection successful!');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}