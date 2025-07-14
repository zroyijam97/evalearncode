'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

type Language = 'en' | 'id';

interface OnboardingQuestion {
  id: number;
  question: {
    en: string;
    id: string;
  };
  options: {
    en: string[];
    id: string[];
  };
  type: 'multiple-choice' | 'text';
}

const onboardingQuestions: OnboardingQuestion[] = [
  {
    id: 1,
    question: {
      en: "What's your current programming experience level?",
      id: "Apakah tahap pengalaman pengaturcaraan anda sekarang?"
    },
    options: {
      en: ["Complete beginner", "Some experience", "Intermediate", "Advanced"],
      id: ["Pemula sepenuhnya", "Ada sedikit pengalaman", "Pertengahan", "Mahir"]
    },
    type: 'multiple-choice'
  },
  {
    id: 2,
    question: {
      en: "Which programming languages are you most interested in learning?",
      id: "Bahasa pengaturcaraan manakah yang paling anda berminat untuk dipelajari?"
    },
    options: {
      en: ["JavaScript", "Python", "Java", "C++", "React", "TypeScript"],
      id: ["JavaScript", "Python", "Java", "C++", "React", "TypeScript"]
    },
    type: 'multiple-choice'
  },
  {
    id: 3,
    question: {
      en: "What's your primary goal for learning to code?",
      id: "Apakah matlamat utama anda untuk belajar mengkod?"
    },
    options: {
      en: ["Career change", "Build personal projects", "Improve current job skills", "Academic purposes", "Just for fun"],
      id: ["Tukar kerjaya", "Bina projek peribadi", "Tingkatkan kemahiran kerja semasa", "Tujuan akademik", "Sekadar untuk keseronokan"]
    },
    type: 'multiple-choice'
  },
  {
    id: 4,
    question: {
      en: "How much time can you dedicate to learning per week?",
      id: "Berapa banyak masa yang boleh anda dedikasikan untuk belajar setiap minggu?"
    },
    options: {
      en: ["1-3 hours", "4-7 hours", "8-15 hours", "16+ hours"],
      id: ["1-3 jam", "4-7 jam", "8-15 jam", "16+ jam"]
    },
    type: 'multiple-choice'
  },
  {
    id: 5,
    question: {
      en: "What type of projects would you like to build?",
      id: "Jenis projek apakah yang anda ingin bina?"
    },
    options: {
      en: ["Web applications", "Mobile apps", "Games", "Data analysis", "AI/Machine Learning", "Desktop applications"],
      id: ["Aplikasi web", "Aplikasi mudah alih", "Permainan", "Analisis data", "AI/Pembelajaran Mesin", "Aplikasi desktop"]
    },
    type: 'multiple-choice'
  }
];

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const { user } = useUser();
  const router = useRouter();

  const currentQuestion = onboardingQuestions[currentStep];
  const isLastStep = currentStep === onboardingQuestions.length - 1;

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const handleNext = async () => {
    if (isLastStep) {
      await submitOnboarding();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const submitOnboarding = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Submit onboarding responses
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkId: user.id,
          answers,
        }),
      });

      if (response.ok) {
        onComplete();
      } else {
        console.error('Failed to submit onboarding');
      }
    } catch (error) {
      console.error('Error submitting onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / onboardingQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
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
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {language === 'en' ? 'Progress' : 'Kemajuan'}
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {currentStep + 1} / {onboardingQuestions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {language === 'en' ? 'Welcome to EvaLearnCode!' : 'Selamat datang ke EvaLearnCode!'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'en' 
                ? 'Let\'s personalize your learning experience' 
                : 'Mari kita peribadikan pengalaman pembelajaran anda'
              }
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {currentQuestion.question[language]}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options[language].map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                    answers[currentQuestion.id] === option
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      answers[currentQuestion.id] === option
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300 dark:border-gray-500'
                    }`}>
                      {answers[currentQuestion.id] === option && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {language === 'en' ? 'Previous' : 'Sebelumnya'}
            </button>

            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id] || isSubmitting}
              className="px-8 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transform hover:scale-105 shadow-lg"
            >
              {isSubmitting 
                ? (language === 'en' ? 'Submitting...' : 'Menghantar...')
                : isLastStep 
                  ? (language === 'en' ? 'Complete' : 'Selesai')
                  : (language === 'en' ? 'Next' : 'Seterusnya')
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}