# 🚀 Project Brief: Gamified Skill Learning System

## 🎯 Goal

Build a web app that helps users stay consistent in learning or improving skills by turning structured roadmaps into **daily game-like missions** with XP, levels, and streaks.

---

## 🧠 Core Idea

Users choose a **category → skill → time commitment**.
The system uses a **predefined roadmap** to generate **daily missions**, track progress, and adapt over time.

---

## 📂 Structure

### Categories

* Study
* Health

### Skills

* Study → Python, DSA
* Health → Gym

Each skill has its own:

* roadmap (topics or activities)
* XP + level
* progress tracking

---

## 🔁 Core User Flow

1. User signs up / logs in
2. Selects:

   * Category (Study / Health)
   * Skill (Python / DSA / Gym)
   * Time per day
3. System:

   * loads roadmap from database
   * generates daily missions
4. User:

   * completes missions
   * logs activity
5. System:

   * awards XP
   * updates level + streak
   * shows progress dashboard

---

## 🧩 Roadmap System

* Roadmaps are **predefined structured data**
* Stored in database (NOT hardcoded)
* Organized as:

Skill → Tracks → Topics/Activities

Each topic has:

* id (IMPORTANT)
* title
* difficulty
* estimated time

---

## ⚙️ Mission Generation Logic

Input:

* user skill
* current progress
* time available

Process:

* pick next topics from roadmap
* split into time-based tasks
* optionally enhance using AI

Output:

* 3–5 daily missions
* mix of easy / medium tasks

---

## 🤖 AI Role (Optional Enhancement)

Use AI (e.g., Google Gemini) to:

* refine missions
* add variety
* adjust difficulty

AI is NOT responsible for:

* roadmap structure
* core logic

---

## 🎮 Gamification System

* XP based on difficulty + completion
* Level per skill
* Daily streak tracking
* Challenges (daily / weekly)

---

## 📊 Dashboard

Show:

* skill progress
* XP + level
* streak calendar
* weak areas
* category comparison (Study vs Health)

---

## 🗄️ Backend (Supabase)

Tables:

* profiles
* user_skills (user-specific progress)
* roadmaps (global structured data)
* missions (daily generated)
* activities (user logs)
* stats (derived insights)

---

## 🔐 Important Design Rules

1. ❌ Do NOT hardcode lessons
2. ✅ Store roadmaps in DB
3. ✅ Use unique topic IDs (not indexes)
4. ✅ Separate user progress from roadmap
5. ✅ Cache missions daily (avoid repeated AI calls)

---

## 🔄 Update Strategy

* Roadmaps can be updated anytime via DB
* Use stable topic IDs to avoid breaking progress
* Optional: versioning for future changes

---

## 🚀 MVP Scope

Build first:

* Auth
* Skill selection
* Roadmap loading
* Mission generation (basic)
* Activity logging
* XP + level system
* Dashboard

Add later:

* AI mission refinement
* advanced analytics
* multiplayer / challenges

---

## 🏁 One-Line Pitch

"An AI-assisted system that converts structured skill roadmaps into personalized daily missions with gamified progression to improve consistency."

---
