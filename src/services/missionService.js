import { db } from './firebase';
import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';

/**
 * Generate or fetch today's missions for a user and skill
 */
export const getMissionsForToday = async (uid, skillId) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const missionId = `${uid}_${today}_${skillId}`;
    const missionRef = doc(db, 'missions', missionId);
    const snapshot = await getDoc(missionRef);

    if (snapshot.exists()) {
      return snapshot.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching missions:', error);
    throw error;
  }
};

/**
 * Create or update a mission document
 */
export const saveMission = async (uid, skillId, missionData) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const missionId = `${uid}_${today}_${skillId}`;
    const missionRef = doc(db, 'missions', missionId);

    await setDoc(missionRef, {
      ...missionData,
      uid,
      skillId,
      dateKey: today,
      generatedAt: new Date(),
    });

    return missionId;
  } catch (error) {
    console.error('Error saving mission:', error);
    throw error;
  }
};

/**
 * Update mission status for a specific item
 */
export const completeMissionItem = async (uid, skillId, missionId) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const docId = `${uid}_${today}_${skillId}`;
    const missionRef = doc(db, 'missions', docId);

    const snapshot = await getDoc(missionRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      const updatedItems = data.items.map((item) =>
        item.missionId === missionId
          ? { ...item, status: 'completed', completedAt: new Date() }
          : item
      );
      await updateDoc(missionRef, { items: updatedItems });
    }
  } catch (error) {
    console.error('Error completing mission:', error);
    throw error;
  }
};
