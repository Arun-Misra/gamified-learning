# Skill Quest - Gamified Learning App

A React web application that transforms skill learning into an exciting daily quest system with XP, levels, and streak tracking.

## 🎯 Problem Statement

Learning new skills is rewarding but requires consistency. Many learners struggle with motivation over time, especially when progress feels intangible. **Skill Quest** turns structured learning into game-like daily missions with visible progression, streaks, and level-ups to maintain motivation and consistency.

## 🚀 Features (MVP)

- **Google OAuth Authentication** - Secure sign-in with Google accounts
- **Category & Skill Selection** - Choose from Study (Python, DSA) or Health (Gym) tracks
- **Daily Missions** - Auto-generated missions based on roadmap progress and daily time commitment
- **Gamification System** - XP rewards, level progression, and daily streaks
- **Dashboard** - Visual overview of all skills with level, XP, and streak tracking
- **Mission Completion** - Log daily progress with automatic XP and streak updates

## 🛠 Tech Stack

- **Frontend**: React 19.2 with Vite
- **Styling**: Tailwind CSS 3.4
- **Routing**: React Router 6
- **Backend**: Firebase (Authentication + Firestore)
- **State Management**: React Context API

## 📋 Prerequisites

- Node.js 18+ and npm 9+
- Firebase project with:
  - Google OAuth enabled
  - Firestore database enabled
  - Web SDK initialized

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd npeojwctt
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Google Authentication in Firebase Console
3. Create a Firestore database
4. Copy your Firebase config values

### 3. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your Firebase credentials:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Initialize Firestore Collections

Run the following setup in Firebase Console (Firestore > Data) or use the provided seedRoadmaps script:

**Create `roadmaps` collection with documents:**

```
Collection: roadmaps

Document ID: python
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
        { topicId: "python-intro", title: "Introduction to Python", difficulty: "easy", estimatedMinutes: 30 },
        { topicId: "python-variables", title: "Variables and Data Types", difficulty: "easy", estimatedMinutes: 45 },
        { topicId: "python-functions", title: "Functions and Modules", difficulty: "medium", estimatedMinutes: 60 }
      ]
    }
  ]
}

Document ID: dsa
{
  skillId: "dsa",
  category: "Study",
  name: "Data Structures & Algorithms",
  version: 1,
  tracks: [
    {
      trackId: "fundamentals",
      title: "DSA Fundamentals",
      topics: [
        { topicId: "dsa-arrays", title: "Arrays and Lists", difficulty: "easy", estimatedMinutes: 45 },
        { topicId: "dsa-sorting", title: "Sorting Algorithms", difficulty: "medium", estimatedMinutes: 90 },
        { topicId: "dsa-trees", title: "Trees and Graphs", difficulty: "hard", estimatedMinutes: 120 }
      ]
    }
  ]
}

Document ID: gym
{
  skillId: "gym",
  category: "Health",
  name: "Gym Fitness",
  version: 1,
  tracks: [
    {
      trackId: "basics",
      title: "Fitness Basics",
      topics: [
        { topicId: "gym-warmup", title: "Warm-up Routines", difficulty: "easy", estimatedMinutes: 10 },
        { topicId: "gym-cardio", title: "Cardio Training", difficulty: "medium", estimatedMinutes: 30 },
        { topicId: "gym-strength", title: "Strength Training", difficulty: "hard", estimatedMinutes: 45 }
      ]
    }
  ]
}
```

### 5. Start Development Server

```bash
npm run dev
```

Navigate to `http://localhost:5173` and start learning!

## 🎮 How to Use

1. **Sign In** - Click "Sign in with Google"
2. **Onboard** - Select a category, skill, and daily time commitment
3. **View Dashboard** - See your skills, levels, and streaks
4. **Complete Missions** - Click on a skill to see today's missions
5. **Earn Rewards** - Mark missions complete to earn XP and maintain streak

## 📊 Firestore Schema

### Collections

- **users/** - User profiles with auth metadata
- **roadmaps/** - Skill roadmaps with tracks and topics
- **userSkills/** - Per-user skill progress (XP, level, streak)
- **missions/** - Daily mission sets with completion status
- **activities/** - Activity logs with XP rewards

## 🎓 React Concepts Used

- ✅ Functional Components & Props
- ✅ Hooks (useState, useEffect, useContext, useCallback)
- ✅ Context API for global auth state
- ✅ React Router for navigation & protected routes
- ✅ Conditional Rendering & Lists with Keys
- ✅ Controlled Components (forms)
- ✅ Side Effects & Data Fetching

## 📈 Project Rubric Alignment

| Criteria | Coverage |
|----------|----------|
| Problem Statement | ✅ Real-world learning motivation problem |
| React Fundamentals | ✅ Full coverage with hooks and Context |
| Backend Integration | ✅ Firebase Auth + Firestore CRUD |
| UI/UX Design | ✅ Responsive Tailwind design |
| Code Quality | ✅ Modular structure, proper separation |
| Functionality | ✅ Core features implemented |
| Demo & Explanation | 📹 See DEMO.md |

## 🔄 Git Commit History

View atomic commits for each feature:

```bash
git log --oneline
```

All commits authored by: Arun-Misra (kanhaam2006@gmail.com)

## 🚀 Future Enhancements

- AI-powered mission refinement using Google Gemini
- Multiplayer challenges and leaderboards
- Advanced analytics and weak area detection
- Mobile app with React Native
- Export progress reports

## 📄 License

MIT
