# Onboarding System Documentation

## Overview

The onboarding system ensures that new users complete a personalized setup process only once. This system tracks user progress and prevents repeated onboarding flows.

## Architecture

### Database Schema

The onboarding system uses two main tables:

1. **`userProfiles`** - Stores user preferences and onboarding status
   - `hasCompletedOnboarding`: Boolean flag indicating completion
   - `experienceLevel`: User's coding experience
   - `preferredLanguages`: Programming languages of interest
   - `learningGoals`: User's learning objectives

2. **`onboardingResponses`** - Stores individual question responses
   - `userId`: Reference to the user
   - `questionId`: Question identifier
   - `answer`: User's response

### Flow Components

1. **OnboardingFlow** (`/components/OnboardingFlow.tsx`)
   - Main orchestrator component
   - Checks completion status on mount
   - Manages step progression

2. **Onboarding** (`/components/Onboarding.tsx`)
   - Question presentation component
   - Handles user responses
   - Submits data to API

3. **Dashboard** (`/app/dashboard/page.tsx`)
   - Protected route that checks onboarding status
   - Redirects to onboarding if incomplete

## API Endpoints

### GET `/api/onboarding`
- **Purpose**: Check user's onboarding status
- **Parameters**: `clerkId` (query parameter)
- **Response**: 
  ```json
  {
    "onboardingCompleted": boolean,
    "hasCompletedOnboarding": boolean,
    "profile": UserProfile | null
  }
  ```

### POST `/api/onboarding`
- **Purpose**: Submit onboarding responses
- **Body**: 
  ```json
  {
    "clerkId": string,
    "answers": { [questionId: string]: string }
  }
  ```
- **Actions**:
  - Creates user if doesn't exist
  - Saves question responses
  - Creates/updates user profile
  - Sets `hasCompletedOnboarding` to `true`

### POST `/api/onboarding/reset` (Development Only)
- **Purpose**: Reset onboarding status for testing
- **Body**: `{ "clerkId": string }`
- **Note**: Only available in development environment

## Middleware Protection

The middleware (`/middleware.ts`) provides automatic route protection:

- **Protected Routes**: `/dashboard/*`, `/onboarding/*`
- **Onboarding Check**: Redirects to `/onboarding` if incomplete
- **Completion Check**: Redirects to `/dashboard` if already completed

## Database Utilities

Utility functions in `/lib/db-utils.ts`:

- `getUserOnboardingStatus(clerkId)`: Get completion status
- `resetUserOnboarding(clerkId)`: Reset for testing

## Implementation Details

### Onboarding Questions

The system includes 5 predefined questions:
1. Experience level
2. Programming languages
3. Learning goals
4. Time commitment
5. Project interests

Questions support multiple languages (English/Bahasa Malaysia).

### State Management

- **Client-side**: React state for current step and answers
- **Server-side**: Database persistence for completion status
- **Session**: Clerk authentication for user identification

### Error Handling

- API errors are logged and handled gracefully
- Middleware errors allow request to proceed
- Client-side errors show user-friendly messages

## Testing

### Reset Onboarding (Development)

```javascript
// Reset a user's onboarding status
fetch('/api/onboarding/reset', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ clerkId: 'user_xxx' })
});
```

### Manual Testing Flow

1. Sign up as new user
2. Verify onboarding appears
3. Complete onboarding
4. Verify redirect to dashboard
5. Sign out and back in
6. Verify dashboard loads directly

## Security Considerations

- Onboarding reset only available in development
- All routes protected by Clerk authentication
- User data validated before database operations
- SQL injection prevented by Drizzle ORM

## Performance Optimizations

- Onboarding status cached in component state
- Database queries optimized with proper indexing
- Middleware checks minimized with route matchers
- API responses include both legacy and new field names

## Troubleshooting

### Common Issues

1. **Onboarding shows repeatedly**
   - Check `hasCompletedOnboarding` in database
   - Verify API response format
   - Check middleware configuration

2. **Redirect loops**
   - Verify middleware route matchers
   - Check API endpoint responses
   - Ensure proper error handling

3. **Database errors**
   - Verify schema migrations
   - Check foreign key constraints
   - Validate user creation process

### Debug Commands

```sql
-- Check user onboarding status
SELECT u.clerk_id, up.has_completed_onboarding 
FROM users u 
LEFT JOIN user_profiles up ON u.id = up.user_id 
WHERE u.clerk_id = 'user_xxx';

-- Reset onboarding for testing
UPDATE user_profiles 
SET has_completed_onboarding = false 
WHERE user_id = (SELECT id FROM users WHERE clerk_id = 'user_xxx');
```

## Future Enhancements

- [ ] Analytics tracking for onboarding completion rates
- [ ] A/B testing for different onboarding flows
- [ ] Progressive onboarding with optional steps
- [ ] Onboarding progress persistence across sessions
- [ ] Admin panel for managing onboarding questions