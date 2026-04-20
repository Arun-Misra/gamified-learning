# Skill Quest Demo Guide

## 3 to 5 Minute Flow

1. Open the login page and explain the problem: consistency is hard because progress feels invisible.
2. Sign in with Google and point out that auth is handled by Supabase.
3. Walk through onboarding: category, skill, and daily time selection.
4. Show the dashboard with XP, level, and streak cards.
5. Open a mission page, explain roadmap-driven generation, and complete a mission.
6. Return to the dashboard and show the updated progress state.

## Architecture

### Frontend

- React functional components
- Context API for auth state
- React Router for protected routes
- Tailwind for the UI

### Backend

- Supabase Auth for Google login
- Postgres tables for profiles, roadmaps, user_skills, missions, and activities
- RLS policies for user-owned data

### Services

- `src/services/supabase.js` initializes the client
- `src/services/authService.js` handles sign-in, sign-out, and profile sync
- `src/services/roadmapService.js` loads roadmaps
- `src/services/progressService.js` manages XP, streaks, and skill rows
- `src/services/missionService.js` caches and updates daily missions
- `src/services/activityService.js` logs completed actions

## Data Flow

### Auth

1. User clicks Google sign-in.
2. Supabase redirects through OAuth.
3. Auth context receives the session and syncs the profile row.

### Onboarding

1. User selects a category, skill, and daily minutes.
2. A row is created in `user_skills`.
3. The dashboard loads all user skills for the current user.

### Missions

1. The app loads the roadmap for the chosen skill.
2. It checks for a cached `missions` row for today.
3. If missing, it generates missions from the roadmap and the user’s progress.
4. Completion updates `missions`, `user_skills`, and `activities`.

## Setup For Viva

1. Create the Supabase project.
2. Run `supabase/schema.sql`.
3. Seed `roadmaps` with `npm run seed:roadmaps` or `supabase/seed.sql`.
4. Set the Vercel environment variables.
5. Test Google sign-in, onboarding, mission completion, and refresh persistence.
