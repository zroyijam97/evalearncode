'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import OnboardingFlow from '@/components/OnboardingFlow';

type Language = 'en' | 'id';

export default function DashboardPage() {
  const [language, setLanguage] = useState<Language>('en');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Get language from localStorage or browser preference
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.includes('id') || browserLang.includes('ms')) {
        setLanguage('id');
      }
    }
  }, []);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!isLoaded) return;
      
      if (!user) {
        router.push('/');
        return;
      }

      try {
        const response = await fetch(`/api/onboarding?clerkId=${user.id}`);
        const data = await response.json();
        
        if (!data.onboardingCompleted) {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // If there's an error, assume onboarding is needed
        setShowOnboarding(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user, isLoaded, router]);

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'en' ? 'Loading your dashboard...' : 'Memuatkan papan pemuka anda...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'en' ? 'Access Denied' : 'Akses Ditolak'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {language === 'en' 
              ? 'Please sign in to access your dashboard.'
              : 'Sila log masuk untuk mengakses papan pemuka anda.'
            }
          </p>
          <button 
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
          >
            {language === 'en' ? 'Go Home' : 'Ke Halaman Utama'}
          </button>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingFlow />;
  }

  return <Dashboard />;
}