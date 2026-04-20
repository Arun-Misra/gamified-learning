import { auth, db } from './firebase';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const googleProvider = new GoogleAuthProvider();

/**
 * Initialize or fetch user profile from Firestore
 */
export const initializeUserProfile = async (user) => {
  if (!user) return null;

  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create new user profile
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName || 'User',
        email: user.email,
        photoURL: user.photoURL || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      });
    } else {
      // Update last login
      await setDoc(
        userRef,
        { lastLoginAt: new Date(), updatedAt: new Date() },
        { merge: true }
      );
    }

    return user;
  } catch (error) {
    console.error('Error initializing user profile:', error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    await initializeUserProfile(user);
    return user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-out error:', error);
    throw error;
  }
};

export const onAuthChange = (callback) => {
  const unsubscribe = onAuthStateChanged(auth, callback);
  return unsubscribe;
};
