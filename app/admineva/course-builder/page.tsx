'use client';

import CourseBuilder from '@/components/CourseBuilder';

export default function CourseBuilderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <CourseBuilder />
    </div>
  );
}