import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'example-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const mapSupabaseUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    ...user,
    uid: user.id,
    displayName:
      user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'User',
    photoURL: user.user_metadata?.avatar_url || '',
  };
};