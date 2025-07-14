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
  StarIcon,
  BellIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  HomeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartSolid,
  BookOpenIcon as BookSolid,
  TrophyIcon as TrophySolid
} from '@heroicons/react/24/solid';

type Language = 'en' | 'id';

interface DashboardProps {}

interface UserStats {
  completed: number;
  lessons: number;
  hours: number;
  todayRevenue: number;
  studySuccess: number;
}

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  score: number;
  rank: number;
  trend: 'up' | 'down' | 'same';
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  earned: boolean;
}

interface Challenge {
  id: string;
  name: string;
  type: string;
  progress: number;
  total: number;
  icon: string;
  color: string;
}

interface Course {
  id: string;
  title: string;
  subtitle: string;
  progress: number;
  likes: number;
  dislikes: number;
  avatar: string;
  color: string;
}

const mockStats: UserStats = {
  completed: 56,
  lessons: 21,
  hours: 120,
  todayRevenue: 78,
  studySuccess: 2.3
};

const mockLeaderboard: LeaderboardUser[] = [
  { id: '1', name: 'Jack Nicklaus', avatar: '🤖', score: 48105, rank: 1, trend: 'up' },
  { id: '2', name: 'Brody Bellson', avatar: '🤖', score: 46182, rank: 2, trend: 'up' },
  { id: '3', name: 'Timothy Bell', avatar: '🤖', score: 31786, rank: 3, trend: 'down' },
  { id: '4', name: 'Brody Bennet', avatar: '🤖', score: 19251, rank: 4, trend: 'up' },
  { id: '5', name: 'Brody Bennet', avatar: '🤖', score: 16322, rank: 5, trend: 'down' },
  { id: '6', name: 'Brody Bennet', avatar: '🤖', score: 16101, rank: 6, trend: 'up' },
  { id: '7', name: 'Brody Bennet', avatar: '🤖', score: 15464, rank: 7, trend: 'down' }
];

const mockBadges: Badge[] = [
  { id: '1', name: 'Book Explorer', icon: '📚', color: 'bg-pink-100', earned: true },
  { id: '2', name: 'Heart of a Reader', icon: '❤️', color: 'bg-red-100', earned: true },
  { id: '3', name: 'Rainbow Reader', icon: '🌈', color: 'bg-blue-100', earned: true },
  { id: '4', name: 'Reading Passion', icon: '📖', color: 'bg-purple-100', earned: true }
];

const mockChallenges: Challenge[] = [
  { id: '1', name: 'Deep Focus', type: 'Extra challenge', progress: 250, total: 250, icon: '🎯', color: 'bg-blue-100' },
  { id: '2', name: 'Day 10/32', type: 'Daily challenge', progress: 16, total: 200, icon: '📅', color: 'bg-yellow-100' }
];

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Mind Unlocked',
    subtitle: 'The Human Mind',
    progress: 45,
    likes: 145,
    dislikes: 0,
    avatar: '🤖',
    color: 'bg-blue-100'
  },
  {
    id: '2',
    title: 'Mind Unlocked',
    subtitle: 'The Human Mind',
    progress: 45,
    likes: 145,
    dislikes: 0,
    avatar: '🤖',
    color: 'bg-blue-100'
  }
];

export default function Dashboard({}: DashboardProps) {
  const { user } = useUser();
  const [stats, setStats] = useState<UserStats>(mockStats);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(mockLeaderboard);
  const [badges, setBadges] = useState<Badge[]>(mockBadges);
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [language, setLanguage] = useState<Language>('en');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sidebar Navigation Component
  const Sidebar = () => (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-700/60 h-screen shadow-xl transform transition-transform duration-300 ease-in-out lg:transform-none ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
      <div className="pt-8 sm:pt-12 lg:pt-6 px-4 pb-4 lg:p-6">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl lg:text-2xl font-bold">E</span>
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">EvaLearn</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Learning Platform</p>
          </div>
        </div>
        
        <nav className="space-y-3">
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-teal-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50 shadow-sm">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <HomeIcon className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-slate-800 dark:text-white">Dashboard</span>
          </div>
          <div className="flex items-center space-x-4 p-4 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 rounded-2xl transition-all duration-200 cursor-pointer group">
            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-200">
              <BookOpenIcon className="h-4 w-4 text-slate-600 dark:text-slate-400 group-hover:text-white" />
            </div>
            <span className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white font-medium">Courses</span>
          </div>
          <div className="flex items-center space-x-4 p-4 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 rounded-2xl transition-all duration-200 cursor-pointer group">
            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-yellow-500 group-hover:to-orange-500 transition-all duration-200">
              <TrophyIcon className="h-4 w-4 text-slate-600 dark:text-slate-400 group-hover:text-white" />
            </div>
            <span className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white font-medium">Achievements</span>
          </div>
          <div className="flex items-center space-x-4 p-4 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 rounded-2xl transition-all duration-200 cursor-pointer group">
            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-green-500 group-hover:to-emerald-500 transition-all duration-200">
              <UserGroupIcon className="h-4 w-4 text-slate-600 dark:text-slate-400 group-hover:text-white" />
            </div>
            <span className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white font-medium">Community</span>
          </div>
          <div className="flex items-center space-x-4 p-4 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 rounded-2xl transition-all duration-200 cursor-pointer group">
            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-200">
              <ChatBubbleLeftRightIcon className="h-4 w-4 text-slate-600 dark:text-slate-400 group-hover:text-white" />
            </div>
            <span className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white font-medium">Messages</span>
          </div>
          <div className="flex items-center space-x-4 p-4 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 rounded-2xl transition-all duration-200 cursor-pointer group">
            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-gray-500 group-hover:to-slate-500 transition-all duration-200">
              <Cog6ToothIcon className="h-4 w-4 text-slate-600 dark:text-slate-400 group-hover:text-white" />
            </div>
            <span className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white font-medium">Settings</span>
          </div>
        </nav>
        
        <div className="mt-10 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-200/50 dark:border-indigo-700/50">
          <div className="text-sm font-semibold text-slate-800 dark:text-white mb-2">Study Streak</div>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">7</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">days</div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-3">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" style={{width: '70%'}}></div>
          </div>
        </div>
      </div>
    </div>
    </>
  );

  // Top Header Component
  const Header = () => (
    <div className="flex items-center justify-between mb-6 lg:mb-10">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <Bars3Icon className="h-6 w-6 text-slate-600 dark:text-slate-400" />
        </button>
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-2">Welcome back!</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base">Ready to continue your learning journey?</p>
        </div>
      </div>
      <div className="flex items-center space-x-3 lg:space-x-4">
        <div className="hidden sm:flex items-center space-x-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-3 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <TrophyIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 dark:text-white">144</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Points</div>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <StarIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 dark:text-white">2,321</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Stars</div>
            </div>
          </div>
        </div>
        <div className="relative">
          <BellIcon className="h-6 w-6 lg:h-7 lg:w-7 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white dark:border-slate-900"></div>
        </div>
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform">
          <span className="text-white text-sm lg:text-base font-bold">JS</span>
        </div>
      </div>
    </div>
  );

  // Stats Cards Component
  const StatsCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12">
      <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Course Progress</span>
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mt-1">{stats.completed}%</div>
          </div>
          <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <div className="text-white text-xl">📊</div>
          </div>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500" style={{width: stats.completed + '%'}}></div>
        </div>
      </div>
      
      <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Lessons Completed</span>
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-1">{stats.lessons}<span className="text-lg text-slate-500">/23</span></div>
          </div>
          <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <BookOpenIcon className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
          </div>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500" style={{width: (stats.lessons/23)*100 + '%'}}></div>
        </div>
      </div>
      
      <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Study Hours</span>
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-1">{stats.hours}<span className="text-lg text-slate-500">/111</span></div>
          </div>
          <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <ClockIcon className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
          </div>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500" style={{width: (stats.hours/111)*100 + '%'}}></div>
        </div>
      </div>
    </div>
  );

  // Course Selection Component
  const CourseSelection = () => (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
      <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">Continue Learning</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">Pick up where you left off</p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors">
            <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 dark:text-slate-400 hover:text-blue-600" />
          </button>
          <button className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors">
            <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 dark:text-slate-400 hover:text-blue-600" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3 sm:space-y-4 lg:space-y-6">
        {courses.map((course, index) => (
          <div key={course.id} className="group bg-gradient-to-r from-white to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-slate-200/50 dark:border-slate-600/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${
                index === 0 ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                index === 1 ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                'bg-gradient-to-br from-emerald-500 to-teal-500'
              }`}>
                <span className="text-white text-lg sm:text-xl lg:text-2xl">{course.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start sm:items-center justify-between mb-2 flex-col sm:flex-row gap-1 sm:gap-0">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 dark:text-white truncate">{course.title}</h3>
                  <div className="flex items-center space-x-1 sm:space-x-2 text-slate-500 dark:text-slate-400 flex-shrink-0">
                    <ClockIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">2h 30m</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2 sm:mb-3 line-clamp-2">Master the fundamentals and advanced concepts</p>
                <div className="flex items-center justify-between flex-col sm:flex-row gap-2 sm:gap-0">
                  <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">AI</span>
                      </div>
                      <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">AI Instructor</span>
                    </div>
                    <div className="w-px h-3 sm:h-4 bg-slate-300 dark:bg-slate-600"></div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-white">{course.progress}% complete</span>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:shadow-lg transition-all duration-200 group-hover:scale-105 w-full sm:w-auto">
                    Continue
                  </button>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 sm:h-2 mt-2 sm:mt-3">
                  <div className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
                    index === 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                    index === 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                    'bg-gradient-to-r from-emerald-500 to-teal-500'
                  }`} style={{width: course.progress + '%'}}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Today's Revenue Component
  const TodaysRevenue = () => (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Learning Analytics</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Your progress this week</p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-2xl">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">+12.5% this week</span>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-4">
            <div className="text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400">47</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Lessons completed</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4">
            <div className="text-2xl lg:text-3xl font-bold text-purple-600 dark:text-purple-400">8.5h</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Study time</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50 rounded-2xl p-4">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Weekly Progress</div>
          
          {/* Chart representation */}
          <div className="flex items-end justify-between h-20 mb-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} className="flex flex-col items-center space-y-2">
                <div
                  className="bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t-lg w-6"
                  style={{
                    height: [60, 80, 45, 90, 70, 35, 55][i] + '%'
                  }}
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{day}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>This week: 8.5 hours</span>
            <span>Goal: 10 hours</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Badges Component
  const BadgesSection = () => (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg mb-6 lg:mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Achievements</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Your earned badges</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-lg">
            8 earned
          </div>
          <span className="text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors cursor-pointer">View all</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((badge, index) => (
          <div key={badge.id} className="group bg-gradient-to-br from-white to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-slate-200/50 dark:border-slate-600/50">
            <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ${
              index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
              index === 1 ? 'bg-gradient-to-br from-red-400 to-pink-500' :
              index === 2 ? 'bg-gradient-to-br from-blue-400 to-cyan-500' :
              'bg-gradient-to-br from-purple-400 to-indigo-500'
            }`}>
              <span className="text-white text-xl">{badge.icon}</span>
            </div>
            <div className="text-sm font-bold text-slate-800 dark:text-white">{badge.name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Earned 2 days ago</div>
          </div>
        ))}
      </div>
    </div>
  );

  // Challenges Component
  const ChallengesSection = () => (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg mb-6 lg:mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Daily Challenges</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Complete to earn rewards</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-lg">
            2/3 done
          </div>
          <span className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors cursor-pointer">View all</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {challenges.map((challenge, index) => (
          <div key={challenge.id} className="group bg-gradient-to-r from-white to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-600/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 min-w-0 flex-1">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                  index === 0 ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                  index === 1 ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                  'bg-gradient-to-br from-purple-500 to-pink-500'
                }`}>
                  <span className="text-white text-xl">{challenge.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-800 dark:text-white text-base truncate">{challenge.name}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{challenge.type}</div>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-20 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full transition-all duration-500 ${
                        index === 0 ? 'bg-gradient-to-r from-green-500 to-emerald-500 w-full' :
                        index === 1 ? 'bg-gradient-to-r from-blue-500 to-cyan-500 w-3/4' :
                        'bg-gradient-to-r from-purple-500 to-pink-500 w-1/2'
                      }`}></div>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {index === 0 ? 'Complete' : index === 1 ? '3/4' : '1/2'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 flex-shrink-0">
                <div className="text-right">
                  <div className="text-green-600 dark:text-green-400 font-semibold text-sm">+{challenge.progress}</div>
                  <div className="text-yellow-600 dark:text-yellow-400 font-semibold text-sm">⭐ +{challenge.total}</div>
                </div>
                {index === 0 && (
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Leaderboard Component
  const Leaderboard = () => (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">Leaderboard</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Top learners this week</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-lg">
          #4 You
        </div>
      </div>
      
      <div className="space-y-4">
        {leaderboard.map((user, index) => (
          <div key={user.id} className="group bg-gradient-to-r from-white to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-600/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 min-w-0 flex-1">
                <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                  index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 
                  index === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-500' : 
                  index === 2 ? 'bg-gradient-to-br from-orange-400 to-red-500' : 'bg-gradient-to-br from-blue-400 to-indigo-500'
                }`}>
                  <span className="text-white text-lg font-bold">{user.avatar}</span>
                  {index < 3 && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-xs">{index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}</span>
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-800 dark:text-white text-base truncate">{user.name}</div>
                  <div className="flex items-center space-x-3 mt-1">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500 text-sm">🏆</span>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{user.score.toLocaleString()}</span>
                    </div>
                    <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
                    <div className="flex items-center space-x-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.trend === 'up' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                        'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}>
                        {user.trend === 'up' ? '↗ +12' : '↘ -3'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3 flex-shrink-0">
                <div className={`text-2xl font-bold ${
                  index === 0 ? 'text-yellow-500' : 
                  index === 1 ? 'text-slate-500' : 
                  index === 2 ? 'text-orange-500' : 'text-blue-500'
                }`}>#{index + 1}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 pt-8 sm:pt-12 lg:pt-8 px-3 pb-3 sm:px-4 sm:pb-4 lg:p-8 lg:ml-0">
        <div className="max-w-7xl mx-auto">
          <Header />
          <StatsCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="lg:col-span-1 xl:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
              <CourseSelection />
              <TodaysRevenue />
            </div>
            
            {/* Right Column */}
            <div className="lg:col-span-1 xl:col-span-1 space-y-4 sm:space-y-6 lg:space-y-8">
              <BadgesSection />
              <ChallengesSection />
              <Leaderboard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}