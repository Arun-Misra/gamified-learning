# Skill Quest - Demo & Architecture Guide

## 🎬 Demo Script (3-5 minutes)

### 1. Introduction (30 seconds)
"Skill Quest is a gamified learning application designed to help users maintain consistency in learning new skills. The problem it solves is that many learners lose motivation over time because progress feels invisible. By turning structured learning into daily quests with XP, levels, and streaks, we maintain engagement and momentum."

### 2. Authentication Flow (1 minute)
- Show the login page with Google OAuth button
- Click "Sign in with Google" and complete sign-in
- Demonstrate session persistence (refresh page, still logged in)
- Show user profile data in Firestore

### 3. Onboarding (1 minute)
- Walk through the three-step onboarding:
  - Category selection (Study, Health)
  - Skill selection (Python, DSA, Gym)
  - Daily time commitment (30 mins)
- Explain how this data is persisted to Firestore's `userSkills` collection

### 4. Dashboard (1 minute)
- Show the dashboard with user skills displayed as cards
- Point out the level, XP progress bar, and streak tracker
- Click on a skill card to navigate to missions
- Show that dashboard data is loaded from Firestore in real-time

### 5. Missions & Completion (1 minute)
- Show today's generated missions based on the roadmap and daily time budget
- Explain the mission generation algorithm:
  - Fetches user progress (completed topics)
  - Loads roadmap structure from Firestore
  - Generates 3-5 missions that fit the daily time budget
  - Caches the mission set for the day
- Click "Mark Done" on a mission to complete it
- Show XP reward, level recalculation, and streak increment

### 6. React Architecture (1 minute)
- Explain the component structure
- Show Context API usage for global auth state
- Point out custom hooks (useAuth)
- Demonstrate React Router for protected routes
- Show conditional rendering and form handling

---

## 🏗 Architecture Overview

### Component Hierarchy

```
App (with Router)
├── AuthProvider (Context)
│   ├── LoginPage
│   ├── ProtectedRoute (guards /onboarding, /dashboard, /missions)
│   │   ├── OnboardingPage
│   │   ├── DashboardPage
│   │   │   └── SkillCard (maps userSkills array)
│   │   └── MissionsPage
│   │       └── MissionCard (maps daily missions array)
```

### Service Layer

```
services/
├── firebase.js           - Firebase init & exports
├── authService.js        - Google OAuth & user profile creation
├── roadmapService.js     - Fetch roadmaps from Firestore
├── missionService.js     - Mission CRUD and daily caching
└── progressService.js    - XP, level, streak management
```

### Context & Hooks

```
context/
└── AuthContext.jsx       - Global auth state (user, loading, error)
                           - Provides useAuth() hook

hooks/
└── (Future: useProgress, useMissions hooks)
```

### Utilities

```
utils/
├── missionGenerator.js   - Algorithm for daily mission generation
└── leveling.js           - XP calculations and level progression
```

---

## 🔄 Key Data Flows

### Authentication Flow
1. User clicks "Sign in with Google"
2. `authService.signInWithGoogle()` opens Google OAuth popup
3. After sign-in, `initializeUserProfile()` creates/updates user document in `users/{uid}`
4. `AuthContext` listens to auth state changes via `onAuthStateChanged()`
5. Components access auth via `useAuth()` hook
6. Protected routes check `user` and redirect to login if needed

### Skill Onboarding Flow
1. User selects category, skill, and daily minutes
2. `OnboardingPage` calls `initializeUserSkill(uid, skillId, category, dailyMinutes)`
3. Creates document in `userSkills/{uid}_{skillId}` with initial progress
4. Navigates to dashboard
5. Dashboard fetches all `userSkills` for the user and displays them

### Mission Generation Flow
1. User clicks "View Missions" on a skill
2. `MissionsPage` fetches:
   - User skill progress from `userSkills/{uid}_{skillId}`
   - Roadmap from `roadmaps/{skillId}`
3. Checks `missions/{uid}_{yyyy-mm-dd}_{skillId}` for existing cached missions
4. If none exist, runs `generateDailyMissions()` algorithm
5. Algorithm:
   - Gets all topics from roadmap tracks
   - Filters out completed topics
   - Picks next incomplete topic as primary mission
   - Fills remaining daily minutes with supplementary missions
   - Assigns XP based on difficulty + time
6. Saves mission set to Firestore with `saveMission()`
7. Displays missions in UI

### Mission Completion Flow
1. User clicks "Mark Done" on a mission
2. `handleCompleteMission()` calls:
   - `completeMissionItem()` - updates mission document status
   - `awardXP(uid, skillId, xpAmount)` - adds XP, recalculates level
   - `updateStreak(uid, skillId)` - increments streak if active today
3. UI updates locally to show completed state
4. User can return to dashboard to see updated level/XP/streak

---

## 📊 Firestore Collections

### users/{uid}
```javascript
{
  uid: "user123",
  displayName: "John Doe",
  email: "john@example.com",
  photoURL: "...",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  lastLoginAt: Timestamp
}
```

### roadmaps/{skillId}
```javascript
{
  skillId: "python",
  category: "Study",
  name: "Python Programming",
  version: 1,
  tracks: [
    {
      trackId: "basics",
      title: "Python Basics",
      topics: [
        {
          topicId: "python-intro",
          title: "Introduction to Python",
          difficulty: "easy",
          estimatedMinutes: 30,
          tags: ["beginner"]
        }
      ]
    }
  ]
}
```

### userSkills/{uid}_{skillId}
```javascript
{
  uid: "user123",
  skillId: "python",
  category: "Study",
  dailyMinutes: 30,
  currentTopicIds: ["python-intro"],
  completedTopicIds: [],
  xp: 50,
  level: 1,
  streakCount: 3,
  lastActiveDate: "2026-04-20",
  updatedAt: Timestamp
}
```

### missions/{uid}_{yyyy-mm-dd}_{skillId}
```javascript
{
  uid: "user123",
  skillId: "python",
  dateKey: "2026-04-20",
  roadmapVersion: 1,
  generatedAt: Timestamp,
  items: [
    {
      missionId: "mission-python-intro-...",
      topicId: "python-intro",
      title: "Introduction to Python",
      difficulty: "easy",
      estimatedMinutes: 30,
      xpReward: 15,
      status: "pending",
      completedAt: null
    }
  ],
  statusSummary: {
    total: 3,
    completed: 0
  }
}
```

### activities/{activityId} (for logging)
```javascript
{
  uid: "user123",
  skillId: "python",
  missionId: "mission-...",
  topicId: "python-intro",
  action: "completed",
  xpAwarded: 15,
  createdAt: Timestamp,
  meta: { difficulty: "easy" }
}
```

---

## 🎓 React Concepts Demonstrated

### 1. **Functional Components & Props**
- `LoginPage`, `DashboardPage`, etc. are functional components
- Props passed down: `children` in `ProtectedRoute`, data in maps

### 2. **Hooks**
- `useState()` - Form state in onboarding, local mission state
- `useEffect()` - Fetch data on mount (roadmaps, skills, missions)
- `useContext()` - Access global auth state via `useAuth()`

### 3. **Context API**
- `AuthContext` stores global auth state
- `AuthProvider` wraps entire app
- `useAuth()` custom hook exposes context

### 4. **React Router**
- `BrowserRouter`, `Routes`, `Route` for navigation
- `ProtectedRoute` component wraps routes requiring auth
- `useNavigate()` and `useParams()` hooks for navigation logic

### 5. **Conditional Rendering**
- Loading states: `if (loading) return <Loading />`
- Empty states: `{skills.length === 0 ? <Empty /> : <List />}`
- Error states: `{error && <ErrorAlert />}`

### 6. **Lists & Keys**
- Mapping skill arrays: `.map((skill) => <SkillCard key={skill.id} />)`
- Mapping mission arrays with unique `missionId` keys
- Using stable IDs from Firestore, not array indices

### 7. **Controlled Components**
- Form inputs in `OnboardingPage` have `value` and `onChange`
- Form state drives validation and submission

### 8. **Lifting State Up**
- Auth state lifted to `AuthProvider` so all routes access it
- Dashboard state fetches skills and passes them down to cards

### 9. **Side Effects**
- Auth listener runs on app mount and persists session
- Mission fetch runs when `user` or `skillId` changes
- Cleanup with unsubscribe functions

### 10. **Performance (Optional)**
- Using React.lazy for code-splitting non-critical pages (future)
- Memoizing mission list to avoid re-renders (future useCallback)

---

## ✅ Rubric Coverage

| Criteria | Implementation |
|----------|-----------------|
| **Problem Statement** | Learning consistency motivation → gamified quests |
| **React Fundamentals** | ✅ All core hooks, components, props, routing |
| **Intermediate Concepts** | ✅ Context API, routing, protected routes |
| **Backend Integration** | ✅ Firebase Auth + Firestore CRUD |
| **UI/UX** | ✅ Tailwind responsive design, loading states |
| **Code Quality** | ✅ Modular services, separated concerns |
| **Functionality** | ✅ Auth, onboarding, missions, XP, streak |
| **Demo & Explanation** | ✅ This document + live walkthrough |

---

## 🔧 Setup for Viva

1. Create Firebase project and add roadmap documents
2. Set .env with Firebase credentials
3. Run `npm run dev`
4. Test sign-in flow
5. Complete onboarding to generate test data
6. Navigate missions and show XP/streak updates
7. Point out code files during explanation
8. Answer React concept questions

---

## 🚀 Future Phases

- **Phase 2**: AI mission refinement with Google Gemini
- **Phase 3**: Multiplayer challenges and leaderboards
- **Phase 4**: Export progress reports and analytics
- **Phase 5**: Mobile app with React Native
