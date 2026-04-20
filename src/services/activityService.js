import { supabase } from './supabase';

/**
 * Log a completed activity for audit/history.
 */
export const logActivity = async ({
  uid,
  skillId,
  missionId,
  topicId,
  action = 'completed',
  xpAwarded = 0,
  meta = {},
}) => {
  try {
    const payload = {
      user_id: uid,
      skill_id: skillId,
      mission_id: missionId || null,
      topic_id: topicId || null,
      action,
      xp_awarded: xpAwarded,
      meta,
    };

    const { data, error } = await supabase.from('activities').insert(payload).select('*').single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
};