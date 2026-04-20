import { supabase, mapSupabaseUser } from './supabase';

let lastProfileSync = { userId: null, at: 0 };
const PROFILE_SYNC_COOLDOWN_MS = 60 * 1000;

const shouldSyncProfile = (event, userId) => {
  if (!userId) return false;

  const syncableEvents = new Set(['SIGNED_IN', 'SIGNED_UP', 'USER_UPDATED']);
  if (!syncableEvents.has(event)) {
    return false;
  }

  const now = Date.now();
  if (lastProfileSync.userId === userId && now - lastProfileSync.at < PROFILE_SYNC_COOLDOWN_MS) {
    return false;
  }

  lastProfileSync = { userId, at: now };
  return true;
};

/**
 * Initialize or fetch user profile from Supabase
 */
export const initializeUserProfile = async (user) => {
  if (!user) {
    return null;
  }

  const now = new Date().toISOString();
  const profilePayload = {
    id: user.uid || user.id,
    display_name: user.displayName || 'User',
    email: user.email,
    photo_url: user.photoURL || '',
    updated_at: now,
    last_login_at: now,
  };

  try {
    const { error } = await supabase.from('profiles').upsert(profilePayload, {
      onConflict: 'id',
    });

    if (error) {
      throw error;
    }

    return user;
  } catch (error) {
    console.error('Error initializing user profile:', error);
    throw error;
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return mapSupabaseUser(data.user);
  } catch (error) {
    console.error('Email sign-in error:', error);
    throw error;
  }
};

export const signUpWithEmail = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return mapSupabaseUser(data.user);
  } catch (error) {
    console.error('Email sign-up error:', error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Sign-out error:', error);
    throw error;
  }
};

export const onAuthChange = (callback) => {
  let active = true;

  const emitUser = async (sessionUser, event = 'SESSION_CHECK') => {
    const user = mapSupabaseUser(sessionUser);

    if (!active) {
      return;
    }

    callback(user);

    if (user && shouldSyncProfile(event, user.uid || user.id)) {
      try {
        await initializeUserProfile(user);
      } catch (error) {
        console.error('Error syncing profile after auth change:', error);
      }
    }
  };

  supabase.auth
    .getSession()
    .then(({ data }) => {
      if (active) {
        void emitUser(data.session?.user ?? null, 'SESSION_CHECK');
      }
    })
    .catch((error) => {
      console.error('Error reading initial Supabase session:', error);
      if (active) {
        callback(null);
      }
    });

  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    // getSession above already handles the initial session read.
    if (event === 'INITIAL_SESSION') {
      return;
    }

    void emitUser(session?.user ?? null, event);
  });

  return () => {
    active = false;
    data.subscription.unsubscribe();
  };
};
