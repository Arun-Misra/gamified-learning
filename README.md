# Skill Quest

Skill Quest is a gamified learning app that turns structured skill roadmaps into daily missions with XP, levels, and streak tracking.

## Problem

Learners often start strong and fade out because progress feels invisible. This app turns learning into a daily quest loop so the user sees clear progress and gets rewarded for consistency.

## Stack

- React 19 + Vite
- Tailwind CSS
- React Router
- Supabase Auth, Postgres, and Row Level Security
- Vercel for deployment

## Features

- Email/password authentication
- Category, skill, and daily time onboarding
- Roadmap-driven mission generation
- XP, level, and streak tracking
- Activity logging and progress persistence
- Protected routes and dashboard view

## Local Setup

1. Install dependencies.

```bash
npm install
```

2. Create a Supabase project.

- Go to https://supabase.com
- Create a new project
- Save the project URL and anon key
- Add `http://localhost:5173` to the redirect URLs

3. Create the database schema.

- Open `supabase/schema.sql`
- Paste it into the Supabase SQL editor and run it
- This creates `profiles`, `roadmaps`, `user_skills`, `missions`, and `activities`
- RLS is enabled for all user-owned tables

4. Seed the roadmap data.

```bash
npm run seed:roadmaps
```

If you prefer manual setup, run `supabase/seed.sql` in the SQL editor instead.

5. Configure environment variables.

Copy `.env.example` to `.env` and fill in your values.

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

If you deploy on Vercel, add the browser-safe variables there too:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

6. Start the app.

```bash
npm run dev
```

## Deployment to Vercel

1. Push the repo to GitHub.
2. Import the repo into Vercel.
3. Set build command to `npm run build`.
4. Set output directory to `dist`.
5. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel environment variables.
6. Keep `vercel.json` in the repo so React Router paths keep working on refresh.
7. Deploy.

## Database Model

- `profiles` stores the auth profile mirror.
- `roadmaps` stores the global skill roadmaps and tracks.
- `user_skills` stores per-user XP, level, and streak progress.
- `missions` stores cached daily missions.
- `activities` stores completion history.

## Repo Scripts

- `npm run dev` - start the app
- `npm run build` - production build
- `npm run lint` - lint the codebase
- `npm run seed:roadmaps` - seed roadmap rows into Supabase
- `npm run setup-all` - check setup files and seed roadmaps
- `npm run deploy:rules` - print Supabase schema deployment guidance

## Notes

- Use stable topic IDs in roadmap data.
- Keep the service role key out of browser-facing env vars.
- Supabase RLS replaces Firestore security rules.
