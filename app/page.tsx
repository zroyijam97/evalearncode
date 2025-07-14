'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/nextjs';
import CourseList from '@/components/CourseList';

type Language = 'en' | 'id';

interface Translations {
  en: {
    title: string;
    subtitle: string;
    startLearning: string;
    courses: string;
    nav: {
      home: string;
      courses: string;
      features: string;
      about: string;
    };
    features: {
      gamified: {
        title: string;
        description: string;
      };
      projects: {
        title: string;
        description: string;
      };
      certificates: {
        title: string;
        description: string;
      };
      community: {
        title: string;
        description: string;
      };
    };
    courseList: {
      python: {
        title: string;
        description: string;
      };
      javascript: {
        title: string;
        description: string;
      };
      html: {
        title: string;
        description: string;
      };
      css: {
        title: string;
        description: string;
      };
      react: {
        title: string;
        description: string;
      };
      typescript: {
        title: string;
        description: string;
      };
    };
    footer: string;
  };
  id: {
    title: string;
    subtitle: string;
    startLearning: string;
    courses: string;
    nav: {
      home: string;
      courses: string;
      features: string;
      about: string;
    };
    features: {
      gamified: {
        title: string;
        description: string;
      };
      projects: {
        title: string;
        description: string;
      };
      certificates: {
        title: string;
        description: string;
      };
      community: {
        title: string;
        description: string;
      };
    };
    courseList: {
      python: {
        title: string;
        description: string;
      };
      javascript: {
        title: string;
        description: string;
      };
      html: {
        title: string;
        description: string;
      };
      css: {
        title: string;
        description: string;
      };
      react: {
        title: string;
        description: string;
      };
      typescript: {
        title: string;
        description: string;
      };
    };
    footer: string;
  };
}

const translations: Translations = {
  en: {
    title: "Learn to Code in Python, JavaScript, HTML, CSS, & more",
    subtitle: "Choose between a range of beginner-friendly learning paths, hand-crafted by learning experts and backed by research",
    startLearning: "Start Learning",
    courses: "Courses",
    nav: {
      home: "Home",
      courses: "Courses",
      features: "Features",
      about: "About"
    },
    features: {
      gamified: {
        title: "Gamified lessons",
        description: "Learn with interactive exercises, challenges, and projects, crafted by learning experts and backed by research"
      },
      projects: {
        title: "Real-world projects",
        description: "Build projects that apply your coding skills in real-life scenarios"
      },
      certificates: {
        title: "Certificates",
        description: "Celebrate your accomplishments with shareable certificates as you reach milestones on your journey"
      },
      community: {
        title: "Community",
        description: "Connect with the community to get guidance, share insights, and collaborate with your fellow learners"
      }
    },
    courseList: {
      python: {
        title: "Python",
        description: "Explore a beginner-friendly, popular programming language that's renowned for its readability and extensive range of applications"
      },
      javascript: {
        title: "JavaScript",
        description: "Dive into the world of JavaScript, the programming language to manipulate web page elements, build web applications, and more"
      },
      html: {
        title: "HTML",
        description: "Get familiar with the foundational building blocks of web development, understand the structure of web pages, and start building real websites"
      },
      css: {
        title: "CSS",
        description: "CSS styles the appearance and layout of web pages, making them visually appealing and responsive"
      },
      react: {
        title: "React",
        description: "Learn to build interactive web applications using React, the most popular JavaScript library for building single-page applications"
      },
      typescript: {
        title: "TypeScript",
        description: "Enhance your coding skills with TypeScript, a powerful language that adds static types to JavaScript for better code quality and scalability"
      }
    },
    footer: "You can code, too."
  },
  id: {
    title: "Belajar Kod Python, JavaScript, HTML, CSS, & lain-lain",
    subtitle: "Pilih daripada pelbagai laluan pembelajaran mesra pemula, direka oleh pakar pembelajaran dan disokong oleh penyelidikan",
    startLearning: "Mula Belajar",
    courses: "Kursus",
    nav: {
      home: "Utama",
      courses: "Kursus",
      features: "Ciri-ciri",
      about: "Tentang"
    },
    features: {
      gamified: {
        title: "Pelajaran bergamifikasi",
        description: "Belajar dengan latihan interaktif, cabaran, dan projek, direka oleh pakar pembelajaran dan disokong oleh penyelidikan"
      },
      projects: {
        title: "Projek dunia sebenar",
        description: "Bina projek yang mengaplikasikan kemahiran pengkodan anda dalam senario kehidupan sebenar"
      },
      certificates: {
        title: "Sijil",
        description: "Raikan pencapaian anda dengan sijil yang boleh dikongsi apabila anda mencapai pencapaian dalam perjalanan anda"
      },
      community: {
        title: "Komuniti",
        description: "Berhubung dengan komuniti untuk mendapatkan bimbingan, berkongsi pandangan, dan bekerjasama dengan rakan pelajar"
      }
    },
    courseList: {
      python: {
        title: "Python",
        description: "Terokai bahasa pengaturcaraan popular yang mesra pemula, terkenal dengan kebolehbacaan dan pelbagai aplikasinya"
      },
      javascript: {
        title: "JavaScript",
        description: "Menyelami dunia JavaScript, bahasa pengaturcaraan untuk memanipulasi elemen halaman web, membina aplikasi web, dan lain-lain"
      },
      html: {
        title: "HTML",
        description: "Kenali blok binaan asas pembangunan web, fahami struktur halaman web, dan mula membina laman web sebenar"
      },
      css: {
        title: "CSS",
        description: "CSS mengatur rupa dan susun atur halaman web, menjadikannya menarik secara visual dan responsif"
      },
      react: {
        title: "React",
        description: "Belajar membina aplikasi web interaktif menggunakan React, perpustakaan JavaScript paling popular untuk membina aplikasi satu halaman"
      },
      typescript: {
        title: "TypeScript",
        description: "Tingkatkan kemahiran pengkodan anda dengan TypeScript, bahasa yang berkuasa yang menambah jenis statik kepada JavaScript untuk kualiti dan skalabiliti kod yang lebih baik"
      }
    },
    footer: "Anda juga boleh mengkod."
  }
};

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (isLoaded && user) {
      router.push('/dashboard');
    }
  }, [user, isLoaded, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation Menu */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/20 dark:border-gray-700/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Image
                src="/robot-logo.svg"
                alt="EvaLearnCode Robot Logo"
                width={32}
                height={32}
                className="animate-float"
              />
              <span className="font-[family-name:var(--font-inter)] text-lg font-bold gradient-text">
                EvaLearnCode
              </span>
            </div>
            
            {/* Center Menu Items */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="#home" className="font-[family-name:var(--font-inter)] text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium text-sm">
                {t.nav.home}
              </Link>
              <Link href="#courses" className="font-[family-name:var(--font-inter)] text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium text-sm">
                {t.nav.courses}
              </Link>
              <Link href="#features" className="font-[family-name:var(--font-inter)] text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium text-sm">
                {t.nav.features}
              </Link>
              <Link href="#about" className="font-[family-name:var(--font-inter)] text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium text-sm">
                {t.nav.about}
              </Link>
            </div>
            
            {/* Right Side - Auth & Language */}
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="font-[family-name:var(--font-inter)] px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs font-medium"
              >
                {language === 'en' ? '🇲🇾 MY' : '🇺🇸 EN'}
              </button>
              
              {/* Authentication Buttons */}
              <div className="hidden md:flex items-center space-x-3">
                <SignedOut>
                  <SignInButton>
                    <button className="font-[family-name:var(--font-inter)] text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium text-sm">
                      {language === 'en' ? 'Log in' : 'Log masuk'}
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="font-[family-name:var(--font-inter)] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-full text-sm transition-all duration-300 transform hover:scale-105 shadow-lg">
                      {language === 'en' ? 'Sign up' : 'Daftar'}
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8",
                        userButtonPopoverCard: "shadow-lg border border-gray-200 dark:border-gray-700",
                        userButtonPopoverActionButton: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                    }}
                  >
                    <UserButton.MenuItems>
                      <UserButton.Link
                        label={language === 'en' ? 'Dashboard' : 'Papan Pemuka'}
                        labelIcon={<span>📊</span>}
                        href="/dashboard"
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                </SignedIn>
              </div>
              
              {/* Mobile Menu */}
              <div className="md:hidden flex items-center space-x-2">
                <SignedOut>
                  <SignInButton>
                    <button className="font-[family-name:var(--font-inter)] text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium text-xs px-2 py-1">
                      {language === 'en' ? 'Log in' : 'Log masuk'}
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="font-[family-name:var(--font-inter)] bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-1.5 px-3 rounded-full text-xs transition-all duration-300 transform hover:scale-105 shadow-lg">
                      {language === 'en' ? 'Sign up' : 'Daftar'}
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-7 h-7",
                        userButtonPopoverCard: "shadow-lg border border-gray-200 dark:border-gray-700",
                        userButtonPopoverActionButton: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                    }}
                  >
                    <UserButton.MenuItems>
                      <UserButton.Link
                        label={language === 'en' ? 'Dashboard' : 'Papan Pemuka'}
                        labelIcon={<span>📊</span>}
                        href="/dashboard"
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200 dark:bg-purple-800/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-blue-200 dark:bg-blue-800/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-indigo-200 dark:bg-indigo-800/30 rounded-full blur-xl animate-pulse delay-2000"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            {/* Logo with Animation */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className="relative bg-white dark:bg-gray-800 p-6 rounded-full shadow-2xl transform transition-all duration-300 group-hover:scale-110">
                  <Image
                    src="/robot-logo.svg"
                    alt="EvaLearnCode Robot Logo"
                    width={120}
                    height={120}
                    className="animate-bounce"
                    priority
                  />
                </div>
              </div>
            </div>
            
            {/* Main Title */}
            <h1 className="font-[family-name:var(--font-inter)] text-5xl sm:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 mb-6 leading-tight animate-fade-in">
              {t.title}
            </h1>
            
            {/* Subtitle */}
            <p className="font-[family-name:var(--font-inter)] text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed font-light">
              {t.subtitle}
            </p>
            
            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <SignedOut>
                <SignUpButton>
                  <button className="group relative font-[family-name:var(--font-inter)] bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25">
                    <span className="relative z-10">{t.startLearning}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="group relative font-[family-name:var(--font-inter)] bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
                >
                  <span className="relative z-10">{language === 'en' ? 'Go to Dashboard' : 'Ke Papan Pemuka'}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </button>
              </SignedIn>
              
              <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping delay-100"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping delay-200"></div>
                </div>
                <span className="font-[family-name:var(--font-inter)] text-sm font-medium">
                  {language === 'en' ? 'Join 10,000+ learners' : 'Sertai 10,000+ pelajar'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center group">
              <div className="font-[family-name:var(--font-inter)] text-3xl font-bold text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">50+</div>
              <div className="font-[family-name:var(--font-inter)] text-sm text-gray-600 dark:text-gray-400 mt-1">
                {language === 'en' ? 'Courses' : 'Kursus'}
              </div>
            </div>
            <div className="text-center group">
              <div className="font-[family-name:var(--font-inter)] text-3xl font-bold text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">10k+</div>
              <div className="font-[family-name:var(--font-inter)] text-sm text-gray-600 dark:text-gray-400 mt-1">
                {language === 'en' ? 'Students' : 'Pelajar'}
              </div>
            </div>
            <div className="text-center group">
              <div className="font-[family-name:var(--font-inter)] text-3xl font-bold text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">95%</div>
              <div className="font-[family-name:var(--font-inter)] text-sm text-gray-600 dark:text-gray-400 mt-1">
                {language === 'en' ? 'Success Rate' : 'Kadar Kejayaan'}
              </div>
            </div>
            <div className="text-center group">
              <div className="font-[family-name:var(--font-inter)] text-3xl font-bold text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300">24/7</div>
              <div className="font-[family-name:var(--font-inter)] text-sm text-gray-600 dark:text-gray-400 mt-1">
                {language === 'en' ? 'Support' : 'Sokongan'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-[family-name:var(--font-inter)] text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t.courses}
          </h2>
          <CourseList language={language} />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(t.features).map(([key, feature]) => (
              <div key={key} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl">
                    {key === 'gamified' && '🎮'}
                    {key === 'projects' && '🚀'}
                    {key === 'certificates' && '🏆'}
                    {key === 'community' && '👥'}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-inter)] text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="font-[family-name:var(--font-inter)] text-gray-600 dark:text-gray-300 text-sm leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 dark:bg-black">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-inter)] text-2xl font-bold text-white mb-4">
            {t.footer}
          </h2>
          <p className="font-[family-name:var(--font-inter)] text-gray-400 text-sm font-light">
            © 2025 EvaLearnCode. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
