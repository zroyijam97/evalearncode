'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Course {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  language: string;
  imageUrl: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CourseListProps {
  language: 'en' | 'id';
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const languageIcons: { [key: string]: string } = {
  javascript: '🟨',
  python: '🐍',
  html: '🌐',
  css: '🎨',
  react: '⚛️',
  typescript: '🔷',
};

export default function CourseList({ language }: CourseListProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/courses');
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-48"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400 mb-4">
          {language === 'en' ? 'Error loading courses:' : 'Ralat memuatkan kursus:'} {error}
        </p>
        <button
          onClick={fetchCourses}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          {language === 'en' ? 'Try Again' : 'Cuba Lagi'}
        </button>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {language === 'en' ? 'No courses available yet.' : 'Tiada kursus tersedia lagi.'}
        </p>
        <button
          onClick={async () => {
            try {
              const response = await fetch('/api/seed', { method: 'POST' });
              if (response.ok) {
                fetchCourses();
              }
            } catch (err) {
              console.error('Failed to seed database:', err);
            }
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {language === 'en' ? 'Add Sample Courses' : 'Tambah Kursus Contoh'}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div
          key={course.id}
          className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">
                {languageIcons[course.language.toLowerCase()] || '📚'}
              </span>
              <h3 className="font-[family-name:var(--font-inter)] text-xl font-bold text-gray-900 dark:text-white">
                {course.title}
              </h3>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                difficultyColors[course.difficulty as keyof typeof difficultyColors] ||
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {course.difficulty}
            </span>
          </div>
          
          <p className="font-[family-name:var(--font-inter)] text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {course.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {course.language}
            </span>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg text-sm transition-all duration-300 transform hover:scale-105">
              {language === 'en' ? 'Start Course' : 'Mula Kursus'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}