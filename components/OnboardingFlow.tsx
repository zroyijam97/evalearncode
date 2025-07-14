'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Onboarding from './Onboarding';
import SubscriptionPackages from './SubscriptionPackages';
import Dashboard from './Dashboard';

type Language = 'en' | 'id';
type OnboardingStep = 'questions' | 'subscription' | 'dashboard';

interface OnboardingFlowProps {
  language: Language;
}

export default function OnboardingFlow({ language }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('questions');
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!isLoaded || !user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/onboarding?clerkId=${user.id}`);
        const data = await response.json();
        
        if (data.onboardingCompleted) {
          setCurrentStep('dashboard');
        } else {
          setCurrentStep('questions');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setCurrentStep('questions');
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user, isLoaded]);

  const handleOnboardingComplete = () => {
    setCurrentStep('subscription');
  };

  const handleGoToDashboard = () => {
    setCurrentStep('dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'en' ? 'Loading...' : 'Memuatkan...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'en' ? 'Please sign in to continue' : 'Sila log masuk untuk meneruskan'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'en' 
              ? 'You need to be signed in to access the onboarding process.'
              : 'Anda perlu log masuk untuk mengakses proses orientasi.'
            }
          </p>
        </div>
      </div>
    );
  }

  switch (currentStep) {
    case 'questions':
      return (
        <Onboarding 
          onComplete={handleOnboardingComplete} 
        />
      );
    case 'subscription':
      return (
        <SubscriptionPackages 
          onGoToDashboard={handleGoToDashboard} 
        />
      );
    case 'dashboard':
      return (
        <Dashboard />
      );
    default:
      return null;
  }
}