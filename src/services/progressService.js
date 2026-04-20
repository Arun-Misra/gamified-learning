import { db } from './firebase';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';

const XP_PER_LEVEL = 100;

/**
 * Initialize user skill progress document
 */
export const initializeUserSkill = async (uid, skillId, category, dailyMinutes) => {
  try {
    const skillKey = `${uid}_${skillId}`;
    const skillRef = doc(db, 'userSkills', skillKey);

    await setDoc(skillRef, {
      uid,
      skillId,
      category,
      dailyMinutes,
      currentTopicIds: [],
      completedTopicIds: [],
      xp: 0,
      level: 1,
      streakCount: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error initializing user skill:', error);
    throw error;
  }
};

/**
 * Get user skill progress
 */
export const getUserSkillProgress = async (uid, skillId) => {
  try {
    const skillKey = `${uid}_${skillId}`;
    const skillRef = doc(db, 'userSkills', skillKey);
    const snapshot = await getDoc(skillRef);

    if (snapshot.exists()) {
      return snapshot.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user skill:', error);
    throw error;
  }
};

/**
 * Update XP and recalculate level
 */
export const awardXP = async (uid, skillId, xpAmount) => {
  try {
    const skillKey = `${uid}_${skillId}`;
    const skillRef = doc(db, 'userSkills', skillKey);
    const snapshot = await getDoc(skillRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      const newXp = data.xp + xpAmount;
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;

      await updateDoc(skillRef, {
        xp: newXp,
        level: newLevel,
        updatedAt: new Date(),
      });

      return { xp: newXp, level: newLevel };
    }
  } catch (error) {
    console.error('Error awarding XP:', error);
    throw error;
  }
};

/**
 * Update streak count
 */
export const updateStreak = async (uid, skillId) => {
  try {
    const skillKey = `${uid}_${skillId}`;
    const skillRef = doc(db, 'userSkills', skillKey);
    const snapshot = await getDoc(skillRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      const today = new Date().toISOString().split('T')[0];
      const lastActive = data.lastActiveDate;

      let newStreak = data.streakCount;
      if (lastActive !== today) {
        // Check if streak continues (was active yesterday)
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (lastActive === yesterday) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      }

      await updateDoc(skillRef, {
        streakCount: newStreak,
        lastActiveDate: today,
        updatedAt: new Date(),
      });

      return newStreak;
    }
  } catch (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
};
