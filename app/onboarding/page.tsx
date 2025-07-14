'use client';

import { useState, useEffect } from 'react';
import OnboardingFlow from '@/components/OnboardingFlow';

type Language = 'en' | 'id';

export default function OnboardingPage() {
  const [language, setLanguage] = useState<Language>('en');

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

  return <OnboardingFlow language={language} />;
}