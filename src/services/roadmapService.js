import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

/**
 * Fetch all roadmaps or filter by skill IDs
 */
export const fetchRoadmaps = async (skillIds = null) => {
  try {
    const roadmapsRef = collection(db, 'roadmaps');
    let q = roadmapsRef;

    if (skillIds && skillIds.length > 0) {
      q = query(roadmapsRef, where('skillId', 'in', skillIds));
    }

    const snapshot = await getDocs(q);
    const roadmaps = {};
    snapshot.forEach((doc) => {
      roadmaps[doc.id] = doc.data();
    });
    return roadmaps;
  } catch (error) {
    console.error('Error fetching roadmaps:', error);
    throw error;
  }
};

/**
 * Fetch a single roadmap by skill ID
 */
export const fetchRoadmapBySkill = async (skillId) => {
  try {
    const q = query(collection(db, 'roadmaps'), where('skillId', '==', skillId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      console.warn(`No roadmap found for skill: ${skillId}`);
      return null;
    }
    return snapshot.docs[0].data();
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    throw error;
  }
};
