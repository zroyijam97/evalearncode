'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { 
  BookOpenIcon, 
  ChartBarIcon, 
  TrophyIcon, 
  ClockIcon,
  CodeBracketIcon,
  AcademicCapIcon,
  FireIcon,
  StarIcon
} from '@heroicons/react/24/outline';

type Language = 'en' | 'id';

interface DashboardProps {}

interface UserStats {
  coursesCompleted: number;
  lessonsCompleted: number;
  streakDays: number;
  totalHours: number;
  certificates: number;
  currentLevel: string;
}

interface Course {
  id: string;
  title: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  difficulty: string;
  category: string;
  color: string;
}

const mockStats: UserStats = {
  coursesCompleted: 3,
  lessonsCompleted: 47,
  streakDays: 12,
  totalHours: 89,
  certificates: 2,
  currentLevel: 'Intermediate'
};

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    progress: 85,
    totalLessons: 20,
    completedLessons: 17,
    difficulty: 'Beginner',
    category: 'Web Development',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: '2',
    title: 'React Development',
    progress: 60,
    totalLessons: 25,
    completedLessons: 15,
    difficulty: 'Intermediate',
    category: 'Frontend',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    id: '3',
    title: 'Node.js Backend',
    progress: 30,
    totalLessons: 18,
    completedLessons: 5,
    difficulty: 'Intermediate',
    category: 'Backend',
    color: 'from-green-400 to-emerald-500'
  }
];

export default function Dashboard({}: DashboardProps) {
  const { user } = useUser();
  const [stats, setStats] = useState<UserStats>(mockStats);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [greeting, setGreeting] = useState('');
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting(language === 'en' ? 'Good morning' : 'Selamat pagi');
    } else if (hour < 18) {
      setGreeting(language === 'en' ? 'Good afternoon' : 'Selamat petang');
    } else {
      setGreeting(language === 'en' ? 'Good evening' : 'Selamat malam');
    }
  }, [language]);

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    color: string;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const CourseCard = ({ course }: { course: Course }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{course.title}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center">
              <AcademicCapIcon className="h-4 w-4 mr-1" />
              {course.difficulty}
            </span>
            <span>{course.category}</span>
          </div>
        </div>
        <div className={`p-2 rounded-lg bg-gradient-to-r ${course.color}`}>
          <CodeBracketIcon className="h-5 w-5 text-white" />
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>{course.completedLessons}/{course.totalLessons} {language === 'en' ? 'lessons' : 'pelajaran'}</span>
          <span>{course.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`bg-gradient-to-r ${course.color} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
      </div>
      
      <button className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors duration-200">
        {language === 'en' ? 'Continue Learning' : 'Teruskan Belajar'}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Language Toggle */}
        <div className="flex justify-end mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                language === 'en'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('id')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                language === 'id'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Bahasa Malaysia
            </button>
          </div>
        </div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {greeting}, {user?.firstName || 'Learner'}! 👋
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {language === 'en' 
              ? 'Ready to continue your coding journey?' 
              : 'Bersedia untuk meneruskan perjalanan pengaturcaraan anda?'
            }
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={TrophyIcon}
            title={language === 'en' ? 'Courses Completed' : 'Kursus Selesai'}
            value={stats.coursesCompleted}
            color="from-yellow-400 to-orange-500"
          />
          <StatCard
            icon={BookOpenIcon}
            title={language === 'en' ? 'Lessons Completed' : 'Pelajaran Selesai'}
            value={stats.lessonsCompleted}
            color="from-blue-400 to-cyan-500"
          />
          <StatCard
            icon={FireIcon}
            title={language === 'en' ? 'Learning Streak' : 'Rentetan Belajar'}
            value={stats.streakDays}
            subtitle={language === 'en' ? 'days' : 'hari'}
            color="from-red-400 to-pink-500"
          />
          <StatCard
            icon={ClockIcon}
            title={language === 'en' ? 'Total Hours' : 'Jumlah Jam'}
            value={stats.totalHours}
            subtitle={language === 'en' ? 'hours' : 'jam'}
            color="from-green-400 to-emerald-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Courses */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {language === 'en' ? 'Your Courses' : 'Kursus Anda'}
              </h2>
              <button className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium">
                {language === 'en' ? 'View All' : 'Lihat Semua'}
              </button>
            </div>
            <div className="grid gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievement Card */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl p-6 text-white">
              <div className="flex items-center mb-4">
                <StarIcon className="h-8 w-8 mr-3" />
                <h3 className="text-xl font-bold">
                  {language === 'en' ? 'Level Progress' : 'Kemajuan Tahap'}
                </h3>
              </div>
              <p className="text-lg mb-2">{stats.currentLevel}</p>
              <div className="bg-white/20 rounded-full h-3 mb-2">
                <div className="bg-white h-3 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-sm opacity-90">
                {language === 'en' ? '650/1000 XP to Advanced' : '650/1000 XP ke Mahir'}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {language === 'en' ? 'Quick Actions' : 'Tindakan Pantas'}
              </h3>
              <div className="space-y-3">
                <button className="w-full p-3 text-left rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700 transition-all duration-200">
                  {language === 'en' ? '📚 Browse Courses' : '📚 Semak Kursus'}
                </button>
                <button className="w-full p-3 text-left rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200">
                  {language === 'en' ? '🎯 Practice Challenges' : '🎯 Cabaran Latihan'}
                </button>
                <button className="w-full p-3 text-left rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200">
                  {language === 'en' ? '👥 Join Community' : '👥 Sertai Komuniti'}
                </button>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {language === 'en' ? 'Recent Achievements' : 'Pencapaian Terkini'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <TrophyIcon className="h-6 w-6 text-yellow-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {language === 'en' ? 'First Course Completed!' : 'Kursus Pertama Selesai!'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {language === 'en' ? '2 days ago' : '2 hari lalu'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <FireIcon className="h-6 w-6 text-blue-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {language === 'en' ? '7-Day Streak!' : 'Rentetan 7 Hari!'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {language === 'en' ? '1 week ago' : '1 minggu lalu'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}