'use client';

import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
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
  Bars3Icon,
  UsersIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ChartPieIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartSolid,
  BookOpenIcon as BookSolid,
  TrophyIcon as TrophySolid
} from '@heroicons/react/24/solid';

type Language = 'en' | 'id';

interface AdminDashboardProps {}

interface AdminStats {
  totalUsers: number;
  activeCourses: number;
  totalRevenue: number;
  completionRate: number;
  newSignups: number;
  supportTickets: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  coursesCompleted: number;
  lastActive: string;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  students: number;
  completion: number;
  revenue: number;
  status: 'active' | 'draft' | 'archived';
  category: string;
}

interface SystemAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  resolved: boolean;
}

const mockAdminStats: AdminStats = {
  totalUsers: 12847,
  activeCourses: 0,
  totalRevenue: 89420,
  completionRate: 78.5,
  newSignups: 234,
  supportTickets: 12
};

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '👨', status: 'active', joinDate: '2024-01-15', coursesCompleted: 5, lastActive: '2 hours ago' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: '👩', status: 'active', joinDate: '2024-02-20', coursesCompleted: 3, lastActive: '1 day ago' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: '👨', status: 'inactive', joinDate: '2024-01-10', coursesCompleted: 8, lastActive: '1 week ago' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', avatar: '👩', status: 'suspended', joinDate: '2024-03-01', coursesCompleted: 1, lastActive: '2 weeks ago' }
];

const mockCourses: Course[] = [];

const mockAlerts: SystemAlert[] = [
  { id: '1', type: 'warning', message: 'Server load is above 80%', timestamp: '10 minutes ago', resolved: false },
  { id: '2', type: 'info', message: 'Scheduled maintenance in 2 hours', timestamp: '1 hour ago', resolved: false },
  { id: '3', type: 'error', message: 'Payment gateway timeout', timestamp: '2 hours ago', resolved: true }
];

export default function AdminDashboard({}: AdminDashboardProps) {
  const { user } = useUser();
  const [stats, setStats] = useState<AdminStats>(mockAdminStats);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [courses, setCourses] = useState<Course[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>(mockAlerts);
  const [language, setLanguage] = useState<Language>('en');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Admin Sidebar Navigation Component
  const AdminSidebar = () => (
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
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl lg:text-2xl font-bold">A</span>
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">Admin Panel</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">EvaLearn Control</p>
          </div>
        </div>
        
        <nav className="space-y-3">
          <div className={`flex items-center space-x-4 p-4 rounded-2xl border shadow-sm cursor-pointer transition-all duration-200 ${
            activeTab === 'overview' 
              ? 'bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 border-red-200/50 dark:border-red-700/50' 
              : 'hover:bg-slate-100/80 dark:hover:bg-slate-700/50 border-transparent'
          }`} onClick={() => setActiveTab('overview')}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
              activeTab === 'overview' 
                ? 'bg-gradient-to-br from-red-500 to-orange-500' 
                : 'bg-slate-200 dark:bg-slate-600 group-hover:bg-gradient-to-br group-hover:from-red-500 group-hover:to-orange-500'
            }`}>
              <HomeIcon className={`h-4 w-4 ${activeTab === 'overview' ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
            </div>
            <span className={`font-medium ${activeTab === 'overview' ? 'text-slate-800 dark:text-white font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>Overview</span>
          </div>
          
          <div className={`flex items-center space-x-4 p-4 rounded-2xl border shadow-sm cursor-pointer transition-all duration-200 ${
            activeTab === 'users' 
              ? 'bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-teal-900/20 border-blue-200/50 dark:border-blue-700/50' 
              : 'hover:bg-slate-100/80 dark:hover:bg-slate-700/50 border-transparent'
          }`} onClick={() => setActiveTab('users')}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
              activeTab === 'users' 
                ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                : 'bg-slate-200 dark:bg-slate-600'
            }`}>
              <UsersIcon className={`h-4 w-4 ${activeTab === 'users' ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
            </div>
            <span className={`font-medium ${activeTab === 'users' ? 'text-slate-800 dark:text-white font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>User Management</span>
          </div>
          
          <div className={`flex items-center space-x-4 p-4 rounded-2xl border shadow-sm cursor-pointer transition-all duration-200 ${
            activeTab === 'courses' 
              ? 'bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-rose-900/20 border-purple-200/50 dark:border-purple-700/50' 
              : 'hover:bg-slate-100/80 dark:hover:bg-slate-700/50 border-transparent'
          }`} onClick={() => setActiveTab('courses')}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
              activeTab === 'courses' 
                ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                : 'bg-slate-200 dark:bg-slate-600'
            }`}>
              <BookOpenIcon className={`h-4 w-4 ${activeTab === 'courses' ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
            </div>
            <span className={`font-medium ${activeTab === 'courses' ? 'text-slate-800 dark:text-white font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>Course Management</span>
          </div>
          
          <div className="flex items-center space-x-4 p-4 rounded-2xl border shadow-sm cursor-pointer transition-all duration-200 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 border-transparent group" onClick={() => window.open('/admineva/course-builder', '_blank')}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 bg-slate-200 dark:bg-slate-600 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-500">
              <PlusIcon className="h-4 w-4 text-slate-600 dark:text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-white transition-colors">Course Builder</span>
          </div>
          
          <div className={`flex items-center space-x-4 p-4 rounded-2xl border shadow-sm cursor-pointer transition-all duration-200 ${
            activeTab === 'analytics' 
              ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 border-emerald-200/50 dark:border-emerald-700/50' 
              : 'hover:bg-slate-100/80 dark:hover:bg-slate-700/50 border-transparent'
          }`} onClick={() => setActiveTab('analytics')}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
              activeTab === 'analytics' 
                ? 'bg-gradient-to-br from-emerald-500 to-teal-500' 
                : 'bg-slate-200 dark:bg-slate-600'
            }`}>
              <ChartPieIcon className={`h-4 w-4 ${activeTab === 'analytics' ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
            </div>
            <span className={`font-medium ${activeTab === 'analytics' ? 'text-slate-800 dark:text-white font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>Analytics</span>
          </div>
          
          <div className={`flex items-center space-x-4 p-4 rounded-2xl border shadow-sm cursor-pointer transition-all duration-200 ${
            activeTab === 'settings' 
              ? 'bg-gradient-to-r from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900/20 dark:via-gray-900/20 dark:to-zinc-900/20 border-slate-200/50 dark:border-slate-700/50' 
              : 'hover:bg-slate-100/80 dark:hover:bg-slate-700/50 border-transparent'
          }`} onClick={() => setActiveTab('settings')}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
              activeTab === 'settings' 
                ? 'bg-gradient-to-br from-slate-500 to-gray-500' 
                : 'bg-slate-200 dark:bg-slate-600'
            }`}>
              <Cog6ToothIcon className={`h-4 w-4 ${activeTab === 'settings' ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
            </div>
            <span className={`font-medium ${activeTab === 'settings' ? 'text-slate-800 dark:text-white font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>System Settings</span>
          </div>
        </nav>
      </div>
      </div>
    </>
  );

  // Header Component
  const Header = () => (
    <div className="flex items-center justify-between mb-6 lg:mb-8">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Bars3Icon className="h-6 w-6 text-slate-600 dark:text-slate-400" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
            Welcome back, {user?.firstName || 'Admin'}!
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">Here's what's happening with your platform today.</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="relative">
          <button className="p-2 sm:p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-200 group">
            <BellIcon className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600 dark:text-slate-400 group-hover:text-orange-500 transition-colors" />
          </button>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">{alerts.filter(a => !a.resolved).length}</span>
          </div>
        </div>
        
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-10 h-10 sm:w-12 sm:h-12 rounded-2xl shadow-lg border-2 border-white/50 dark:border-slate-700/50",
              popoverCard: "bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl rounded-3xl",
              popoverActionButton: "hover:bg-slate-100/80 dark:hover:bg-slate-700/50 rounded-2xl transition-all duration-200"
            }
          }}
        />
      </div>
    </div>
  );

  // Admin Stats Cards
  const AdminStatsCards = () => (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 mb-6 lg:mb-8">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <UsersIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white">{stats.totalUsers.toLocaleString()}</div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Total Users</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <BookOpenIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white">{stats.activeCourses}</div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Active Courses</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <CurrencyDollarIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white">${stats.totalRevenue.toLocaleString()}</div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Total Revenue</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <TrophyIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white">{stats.completionRate}%</div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Completion Rate</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <PlusIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white">{stats.newSignups}</div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">New Signups</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <ExclamationTriangleIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white">{stats.supportTickets}</div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Support Tickets</div>
          </div>
        </div>
      </div>
    </div>
  );

  // System Alerts Component
  const SystemAlerts = () => (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 lg:p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg mb-6 lg:mb-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">System Alerts</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">Monitor system status</p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold shadow-lg">
          {alerts.filter(a => !a.resolved).length} active
        </div>
      </div>
      
      <div className="space-y-3">
        {alerts.slice(0, 3).map((alert) => (
          <div key={alert.id} className={`p-3 sm:p-4 rounded-xl border transition-all duration-200 ${
            alert.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/50' :
            alert.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700/50' :
            'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  alert.resolved ? 'bg-green-500' :
                  alert.type === 'error' ? 'bg-red-500' :
                  alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div>
                  <div className="text-sm font-medium text-slate-800 dark:text-white">{alert.message}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{alert.timestamp}</div>
                </div>
              </div>
              {alert.resolved && (
                <div className="text-green-600 dark:text-green-400 text-xs font-medium">Resolved</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // User Management Component
  const UserManagement = () => (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 lg:p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg mb-6 lg:mb-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Recent Users</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">Manage user accounts</p>
        </div>
        <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
          View All Users
        </button>
      </div>
      
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-white to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-600/50 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg sm:text-xl">{user.avatar}</span>
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold text-slate-800 dark:text-white">{user.name}</div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{user.email}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Joined {user.joinDate} • {user.coursesCompleted} courses</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                user.status === 'inactive' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              }`}>
                {user.status}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{user.lastActive}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Course Management Component
  const CourseManagement = () => (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 lg:p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg mb-6 lg:mb-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Course Performance</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">Monitor course metrics</p>
        </div>
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
          Add New Course
        </button>
      </div>
      
      <div className="space-y-3">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course.id} className="p-3 sm:p-4 bg-gradient-to-r from-white to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-600/50 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm sm:text-base font-bold text-slate-800 dark:text-white">{course.title}</div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">by {course.instructor} • {course.category}</div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  course.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                  course.status === 'draft' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                  'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
                }`}>
                  {course.status}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">{course.students}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Students</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">{course.completion}%</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Completion</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400">${course.revenue.toLocaleString()}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Revenue</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center">
              <BookOpenIcon className="h-8 w-8 sm:h-10 sm:w-10 text-purple-500 dark:text-purple-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white mb-2">No Courses Available</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Start building your learning platform by adding your first course.</p>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
              Create First Course
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="xl:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
              <SystemAlerts />
              <UserManagement />
            </div>
            <div className="xl:col-span-1 space-y-4 sm:space-y-6 lg:space-y-8">
              <CourseManagement />
            </div>
          </div>
        );
      case 'users':
        return <UserManagement />;
      case 'courses':
        return <CourseManagement />;
      case 'analytics':
        return (
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">Analytics Dashboard</h2>
            <p className="text-slate-600 dark:text-slate-400">Detailed analytics and reporting features coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent mb-6">System Settings</h2>
            <p className="text-slate-600 dark:text-slate-400">System configuration and settings panel coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex">
      {/* Admin Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1 pt-4 sm:pt-6 lg:pt-8 px-3 pb-3 sm:px-4 sm:pb-4 lg:px-8 lg:pb-8 lg:ml-0 overflow-x-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <Header />
          <AdminStatsCards />
          <div className="mt-6 lg:mt-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}