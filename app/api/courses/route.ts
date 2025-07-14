import { NextRequest, NextResponse } from 'next/server';
import { getAllCourses } from '@/lib/db-utils';
import { db } from '@/lib/db';
import { courses } from '@/lib/schema';

// GET all courses
export async function GET() {
  try {
    const allCourses = await getAllCourses();
    return NextResponse.json(allCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST create a new course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, difficulty, language, imageUrl } = body;

    if (!title || !difficulty || !language) {
      return NextResponse.json(
        { error: 'Title, difficulty, and language are required' },
        { status: 400 }
      );
    }

    const [newCourse] = await db.insert(courses).values({
      title,
      description,
      difficulty,
      language,
      imageUrl,
      isPublished: true, // Auto-publish for demo
    }).returning();

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}