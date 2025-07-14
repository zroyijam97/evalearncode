import { db } from './db';
import { courses, lessons } from './schema';

export async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    // Insert sample courses
    const sampleCourses = await db.insert(courses).values([
      {
        title: 'JavaScript Fundamentals',
        description: 'Learn the basics of JavaScript programming language',
        difficulty: 'beginner',
        language: 'javascript',
        imageUrl: '/javascript-course.jpg',
        isPublished: true,
      },
      {
        title: 'Python for Beginners',
        description: 'Start your programming journey with Python',
        difficulty: 'beginner',
        language: 'python',
        imageUrl: '/python-course.jpg',
        isPublished: true,
      },
      {
        title: 'React Development',
        description: 'Build modern web applications with React',
        difficulty: 'intermediate',
        language: 'javascript',
        imageUrl: '/react-course.jpg',
        isPublished: true,
      },
      {
        title: 'Node.js Backend',
        description: 'Create powerful backend applications with Node.js',
        difficulty: 'intermediate',
        language: 'javascript',
        imageUrl: '/nodejs-course.jpg',
        isPublished: true,
      },
      {
        title: 'Data Structures & Algorithms',
        description: 'Master computer science fundamentals',
        difficulty: 'advanced',
        language: 'python',
        imageUrl: '/dsa-course.jpg',
        isPublished: true,
      },
    ]).returning();

    console.log(`✅ Created ${sampleCourses.length} courses`);

    // Insert sample lessons for the first course
    if (sampleCourses.length > 0) {
      const jsLessons = await db.insert(lessons).values([
        {
          courseId: sampleCourses[0].id,
          title: 'Introduction to JavaScript',
          content: 'Welcome to JavaScript! In this lesson, you will learn what JavaScript is and why it is important.',
          orderIndex: 1,
          isPublished: true,
        },
        {
          courseId: sampleCourses[0].id,
          title: 'Variables and Data Types',
          content: 'Learn about different data types in JavaScript and how to declare variables.',
          orderIndex: 2,
          isPublished: true,
        },
        {
          courseId: sampleCourses[0].id,
          title: 'Functions and Scope',
          content: 'Understand how to create and use functions in JavaScript.',
          orderIndex: 3,
          isPublished: true,
        },
      ]).returning();

      console.log(`✅ Created ${jsLessons.length} lessons for JavaScript course`);
    }

    console.log('🎉 Database seeding completed successfully!');
    return { success: true, coursesCreated: sampleCourses.length };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}