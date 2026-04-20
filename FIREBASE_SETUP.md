# Firebase Setup - Complete Step-by-Step Guide

Follow these steps to set up Firebase for Skill Quest MVP.

---

## Part 1: Create Firebase Project

### Step 1.1 - Go to Firebase Console
1. Open https://console.firebase.google.com
2. Sign in with your Google account (or create one)

### Step 1.2 - Create a New Project
1. Click **"Add project"** button
2. Enter Project Name: `skill-quest` (or your preferred name)
3. Click **Continue**
4. Toggle **"Enable Google Analytics for this project"** → OFF (not needed for MVP)
5. Click **Create project** and wait for setup (1-2 minutes)

### Step 1.3 - You're in Firebase Console
After creation, you'll see the project overview page with a big blue area showing project settings.

---

## Part 2: Set Up Firebase Web App

### Step 2.1 - Create Web App
1. In the Firebase console, click the **`< >`** (web) icon to add an app
2. App nickname: `skill-quest-web`
3. Check ☑️ **"Also set up Firebase Hosting"** → UNCHECK (not needed now)
4. Click **Register app**
5. You'll see a code block with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 2.2 - Copy Your Credentials
**Copy all 6 values** from the config block:
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

Keep this page open or save the values somewhere safe.

---

## Part 3: Set Up Google Authentication

### Step 3.1 - Enable Google Sign-In
1. In left sidebar, click **Build** → **Authentication**
2. Click **Get started**
3. In the **Sign-in method** tab, click **Google**
4. Toggle **Enable** to ON
5. Public-facing name: `Skill Quest` (or your app name)
6. Support email: Choose your email from dropdown
7. Click **Save**

✅ Google authentication is now enabled!

---

## Part 4: Create Firestore Database

### Step 4.1 - Create Firestore
1. In left sidebar, click **Build** → **Firestore Database**
2. Click **Create database**
3. Location: Choose closest region to you (e.g., `us-central1`)
4. Security rules: Start with **Production mode** (we'll fix permissions later)
5. Click **Create**
6. Wait 1-2 minutes for database to be ready

### Step 4.2 - Update Security Rules
1. In Firestore, click **Rules** tab
2. Replace all content with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    match /userSkills/{skillKey} {
      allow read, write: if request.auth.uid == skillKey.split('_')[0];
    }
    
    match /missions/{missionKey} {
      allow read, write: if request.auth.uid == missionKey.split('_')[0];
    }
    
    match /activities/{activityKey} {
      allow read, write: if request.auth.uid == resource.data.uid;
    }
    
    // Allow all authenticated users to read roadmaps (shared data)
    match /roadmaps/{skillId} {
      allow read: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

✅ Firestore database is ready!

---

## Part 5: Add Firebase Credentials to Your App

### Step 5.1 - Update .env File
1. Open `c:\Users\kanha\Downloads\npeojwctt\.env`
2. Replace with your actual Firebase credentials:

```
VITE_FIREBASE_API_KEY=YOUR_API_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID_HERE
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID_HERE
VITE_FIREBASE_APP_ID=YOUR_APP_ID_HERE
```

3. Save the file
4. **Important**: Never commit `.env` to git (it's in .gitignore)

### Step 5.2 - Verify .gitignore
Make sure `.env` is in your `.gitignore`:

```
# In .gitignore file
.env
.env.local
.env.*.local
```

---

## Part 6: Seed Initial Roadmap Data

### Step 6.1 - Add Roadmaps to Firestore (Via Console)

1. Open Firebase console → Firestore Database
2. Click **Start collection**
3. Collection ID: `roadmaps`
4. Click **Next**

### Step 6.2 - Add Python Roadmap

1. Auto-generated Document ID → Click **Save** (auto-generates)
2. Click the document to edit it
3. Click **Edit** and paste this JSON structure:

```json
{
  "skillId": "python",
  "category": "Study",
  "name": "Python Programming",
  "version": 1,
  "tracks": [
    {
      "trackId": "basics",
      "title": "Python Basics",
      "topics": [
        {
          "topicId": "python-intro",
          "title": "Introduction to Python",
          "difficulty": "easy",
          "estimatedMinutes": 30,
          "tags": ["beginner"]
        },
        {
          "topicId": "python-variables",
          "title": "Variables and Data Types",
          "difficulty": "easy",
          "estimatedMinutes": 45,
          "tags": ["beginner"]
        },
        {
          "topicId": "python-functions",
          "title": "Functions and Modules",
          "difficulty": "medium",
          "estimatedMinutes": 60,
          "tags": ["functions"]
        },
        {
          "topicId": "python-oop",
          "title": "Object-Oriented Programming",
          "difficulty": "hard",
          "estimatedMinutes": 90,
          "tags": ["advanced"]
        }
      ]
    }
  ]
}
```

**Actually, easier way - use Firestore UI:**

1. Click **roadmaps** collection
2. Click **Add document**
3. Document ID: `python`
4. Add fields one by one:
   - `skillId` (string): `python`
   - `category` (string): `Study`
   - `name` (string): `Python Programming`
   - `version` (number): `1`
   - `tracks` (array): See format below

**For the `tracks` field, enter as array of maps:**
```
[
  {
    trackId: "basics",
    title: "Python Basics",
    topics: [
      {
        topicId: "python-intro",
        title: "Introduction to Python",
        difficulty: "easy",
        estimatedMinutes: 30
      },
      {
        topicId: "python-variables",
        title: "Variables and Data Types",
        difficulty: "easy",
        estimatedMinutes: 45
      },
      {
        topicId: "python-functions",
        title: "Functions and Modules",
        difficulty: "medium",
        estimatedMinutes: 60
      },
      {
        topicId: "python-oop",
        title: "Object-Oriented Programming",
        difficulty: "hard",
        estimatedMinutes: 90
      }
    ]
  }
]
```

5. Click **Save**

### Step 6.3 - Add DSA Roadmap

1. Click **Add document** again
2. Document ID: `dsa`
3. Add fields:

```
skillId: "dsa"
category: "Study"
name: "Data Structures & Algorithms"
version: 1
tracks: [
  {
    trackId: "fundamentals",
    title: "DSA Fundamentals",
    topics: [
      {
        topicId: "dsa-arrays",
        title: "Arrays and Lists",
        difficulty: "easy",
        estimatedMinutes: 45
      },
      {
        topicId: "dsa-sorting",
        title: "Sorting Algorithms",
        difficulty: "medium",
        estimatedMinutes: 90
      },
      {
        topicId: "dsa-trees",
        title: "Trees and Graphs",
        difficulty: "hard",
        estimatedMinutes: 120
      }
    ]
  }
]
```

4. Click **Save**

### Step 6.4 - Add Gym Roadmap

1. Click **Add document** again
2. Document ID: `gym`
3. Add fields:

```
skillId: "gym"
category: "Health"
name: "Gym Fitness"
version: 1
tracks: [
  {
    trackId: "basics",
    title: "Fitness Basics",
    topics: [
      {
        topicId: "gym-warmup",
        title: "Warm-up Routines",
        difficulty: "easy",
        estimatedMinutes: 10
      },
      {
        topicId: "gym-cardio",
        title: "Cardio Training",
        difficulty: "medium",
        estimatedMinutes: 30
      },
      {
        topicId: "gym-strength",
        title: "Strength Training",
        difficulty: "hard",
        estimatedMinutes": 45
      }
    ]
  }
]
```

4. Click **Save**

✅ All 3 roadmaps are now in Firestore!

---

## Part 7: Test the App

### Step 7.1 - Start Development Server
```bash
cd c:\Users\kanha\Downloads\npeojwctt
npm run dev
```

You should see:
```
  VITE v8.0.9  ready in 123 ms

  ➜  Local:   http://localhost:5173/
```

### Step 7.2 - Open App in Browser
1. Go to `http://localhost:5173`
2. Click **"Sign in with Google"**
3. Complete Google sign-in
4. You should be redirected to onboarding

### Step 7.3 - Test Onboarding
1. Select Category: **Study**
2. Select Skill: **Python**
3. Set Daily Minutes: **30**
4. Click **Start**

### Step 7.4 - Verify Data in Firestore
1. Open Firebase console → Firestore Database
2. Check **users** collection → you should see a document with your user UID
3. Check **userSkills** collection → you should see `{uid}_python`
4. If visible, Firebase integration is working! ✅

### Step 7.5 - Test Missions
1. Click on the Python skill card on dashboard
2. You should see 3-5 missions generated
3. Click **Mark Done** on a mission
4. Check Firestore → **missions** collection to see the completed mission

---

## Part 8: Troubleshooting

### Error: "apiKey is not defined" or Firebase SDK not loading

**Solution:**
1. Check `.env` file exists in project root
2. All VITE_FIREBASE_* variables are filled
3. Restart dev server: `npm run dev`

### Error: "User is not authorized to perform this operation"

**Solution:**
1. Go to Firebase → Firestore → Rules tab
2. Make sure rules are published correctly (green checkmark)
3. User must be signed in via Google OAuth first

### Error: "Collection not found"

**Solution:**
1. Make sure you created the `roadmaps` collection in Firestore
2. Verify document IDs match: `python`, `dsa`, `gym` (lowercase)
3. Check skillId field matches the document ID

### Missions not generating

**Solution:**
1. Verify roadmap document structure matches the schema
2. Check userSkills document was created after onboarding
3. Check browser console for errors (F12)

---

## Summary Checklist

- [ ] Firebase project created
- [ ] Web app registered with credentials copied
- [ ] Google Authentication enabled
- [ ] Firestore database created
- [ ] Firestore security rules published
- [ ] .env file filled with Firebase credentials
- [ ] `roadmaps/python` document created
- [ ] `roadmaps/dsa` document created
- [ ] `roadmaps/gym` document created
- [ ] `npm run dev` starts without errors
- [ ] Google sign-in works
- [ ] Onboarding saves to Firestore
- [ ] Missions generate on dashboard

---

## You're All Set! 🎉

Your Skill Quest app is now connected to Firebase and ready to use!

**Next Steps:**
1. Test the complete flow (sign-in → onboarding → missions → completion)
2. Try adding more topics to roadmaps
3. Build the app: `npm run build`
4. Deploy to Vercel (optional)

Questions? Check the README.md or DEMO.md for more details.
