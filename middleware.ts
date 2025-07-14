import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/onboarding(.*)',
]);

// Define routes that require onboarding completion
const requiresOnboarding = createRouteMatcher([
  '/dashboard(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // For dashboard routes, check if onboarding is completed
  if (requiresOnboarding(req)) {
    const { userId } = await auth();
    
    if (userId) {
      try {
        // Check onboarding status
        const response = await fetch(`${req.nextUrl.origin}/api/onboarding?clerkId=${userId}`);
        const data = await response.json();
        
        // If onboarding is not completed, redirect to onboarding
        if (!data.onboardingCompleted && !req.nextUrl.pathname.startsWith('/onboarding')) {
          return NextResponse.redirect(new URL('/onboarding', req.url));
        }
        
        // If onboarding is completed and user is on onboarding page, redirect to dashboard
        if (data.onboardingCompleted && req.nextUrl.pathname.startsWith('/onboarding')) {
          return NextResponse.redirect(new URL('/dashboard', req.url));
        }
      } catch (error) {
        console.error('Error checking onboarding status in middleware:', error);
        // On error, allow the request to proceed to avoid blocking the user
      }
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};