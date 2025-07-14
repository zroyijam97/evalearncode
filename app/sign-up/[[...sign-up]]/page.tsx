import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Join EvaLearnCode
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create your account and start your coding journey
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 
                  'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200',
                card: 'shadow-none border-0',
                headerTitle: 'text-gray-900 dark:text-white',
                headerSubtitle: 'text-gray-600 dark:text-gray-400',
                socialButtonsBlockButton: 
                  'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
                formFieldInput: 
                  'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                formFieldLabel: 'text-gray-700 dark:text-gray-300',
                dividerLine: 'bg-gray-300 dark:bg-gray-600',
                dividerText: 'text-gray-500 dark:text-gray-400',
                footerActionLink: 'text-purple-600 hover:text-purple-700 dark:text-purple-400',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}