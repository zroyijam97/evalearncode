'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckIcon } from '@heroicons/react/24/outline';

type Language = 'en' | 'id';

interface SubscriptionPlan {
  id: string;
  name: {
    en: string;
    id: string;
  };
  price: {
    monthly: number;
    yearly: number;
  };
  description: {
    en: string;
    id: string;
  };
  features: {
    en: string[];
    id: string[];
  };
  popular?: boolean;
  color: string;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: {
      en: 'Free',
      id: 'Percuma'
    },
    price: {
      monthly: 0,
      yearly: 0
    },
    description: {
      en: 'Perfect for getting started',
      id: 'Sempurna untuk bermula'
    },
    features: {
      en: [
        'Access to basic courses',
        'Community support',
        'Basic progress tracking',
        'Mobile app access'
      ],
      id: [
        'Akses kepada kursus asas',
        'Sokongan komuniti',
        'Penjejakan kemajuan asas',
        'Akses aplikasi mudah alih'
      ]
    },
    color: 'from-gray-400 to-gray-600'
  },
  {
    id: 'pro',
    name: {
      en: 'Pro',
      id: 'Pro'
    },
    price: {
      monthly: 19,
      yearly: 190
    },
    description: {
      en: 'Most popular choice',
      id: 'Pilihan paling popular'
    },
    features: {
      en: [
        'All Free features',
        'Premium courses & projects',
        'AI-powered code review',
        'Priority support',
        'Certificates of completion',
        'Advanced analytics'
      ],
      id: [
        'Semua ciri Percuma',
        'Kursus & projek premium',
        'Ulasan kod berkuasa AI',
        'Sokongan keutamaan',
        'Sijil penyiapan',
        'Analitik lanjutan'
      ]
    },
    popular: true,
    color: 'from-purple-500 to-blue-600'
  },
  {
    id: 'enterprise',
    name: {
      en: 'Enterprise',
      id: 'Perusahaan'
    },
    price: {
      monthly: 49,
      yearly: 490
    },
    description: {
      en: 'For teams and organizations',
      id: 'Untuk pasukan dan organisasi'
    },
    features: {
      en: [
        'All Pro features',
        'Team management',
        'Custom learning paths',
        'Advanced reporting',
        'SSO integration',
        'Dedicated account manager'
      ],
      id: [
        'Semua ciri Pro',
        'Pengurusan pasukan',
        'Laluan pembelajaran tersuai',
        'Pelaporan lanjutan',
        'Integrasi SSO',
        'Pengurus akaun khusus'
      ]
    },
    color: 'from-emerald-500 to-teal-600'
  }
];

interface SubscriptionPackagesProps {
  onGoToDashboard: () => void;
}

export default function SubscriptionPackages({ onGoToDashboard }: SubscriptionPackagesProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('free');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const router = useRouter();

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    setIsProcessing(true);
    
    // Simulate subscription processing
    setTimeout(() => {
      setIsProcessing(false);
      // In a real app, you would handle payment processing here
    }, 1000);
  };

  const handleGoToDashboard = () => {
    onGoToDashboard();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'en' ? 'Choose Your Learning Plan' : 'Pilih Pelan Pembelajaran Anda'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            {language === 'en' 
              ? 'Start your coding journey with the perfect plan for you'
              : 'Mulakan perjalanan pengaturcaraan anda dengan pelan yang sempurna untuk anda'
            }
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500'}`}>
              {language === 'en' ? 'Monthly' : 'Bulanan'}
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${billingCycle === 'yearly' ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500'}`}>
              {language === 'en' ? 'Yearly' : 'Tahunan'}
              <span className="ml-1 text-sm text-green-600 font-medium">
                {language === 'en' ? '(Save 17%)' : '(Jimat 17%)'}
              </span>
            </span>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                plan.popular 
                  ? 'border-purple-500 ring-4 ring-purple-100 dark:ring-purple-900/20' 
                  : selectedPlan === plan.id
                    ? 'border-purple-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    {language === 'en' ? 'Most Popular' : 'Paling Popular'}
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name[language]}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {plan.description[language]}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${plan.price[billingCycle]}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-1">
                      /{billingCycle === 'monthly' 
                        ? (language === 'en' ? 'month' : 'bulan')
                        : (language === 'en' ? 'year' : 'tahun')
                      }
                    </span>
                  </div>
                  {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      ${(plan.price.yearly / 12).toFixed(2)} {language === 'en' ? 'per month' : 'sebulan'}
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features[language].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Select Button */}
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isProcessing}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    selectedPlan === plan.id
                      ? `bg-gradient-to-r ${plan.color} text-white transform scale-105 shadow-lg`
                      : plan.popular
                        ? `bg-gradient-to-r ${plan.color} text-white hover:shadow-lg hover:scale-105`
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isProcessing && selectedPlan === plan.id
                    ? (language === 'en' ? 'Processing...' : 'Memproses...')
                    : selectedPlan === plan.id
                      ? (language === 'en' ? 'Selected' : 'Dipilih')
                      : (language === 'en' ? 'Select Plan' : 'Pilih Pelan')
                  }
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Go to Dashboard Button */}
        <div className="text-center">
          <button
            onClick={handleGoToDashboard}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {language === 'en' ? '🚀 Go to Dashboard' : '🚀 Pergi ke Papan Pemuka'}
          </button>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            {language === 'en' 
              ? 'You can always change your plan later in your account settings'
              : 'Anda boleh menukar pelan anda kemudian dalam tetapan akaun'
            }
          </p>
        </div>
      </div>
    </div>
  );
}