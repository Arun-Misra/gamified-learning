import { supabase } from './supabase';

const XP_PER_LEVEL = 100;

const toDateKey = (value = new Date()) => value.toISOString().split('T')[0];

const mapSkillRow = (row) => {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    uid: row.user_id,
    skillId: row.skill_id,
    category: row.category,
    goalType: row.goal_type || 'study',
    goalMode: row.goal_mode || 'hybrid',
    goalConfig: row.goal_config || {},
    adaptationState: row.adaptation_state || { adjustment: 1.0, lastEvaluation: null },
    dailyMinutes: row.daily_minutes,
    currentTopicIds: row.current_topic_ids || [],
    completedTopicIds: row.completed_topic_ids || [],
    xp: row.xp || 0,
    level: row.level || 1,
    streakCount: row.streak_count || 0,
    lastActiveDate: row.last_active_date || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

/**
 * Initialize user skill progress document
 */
export const initializeUserSkill = async (uid, skillId, category, dailyMinutes, options = {}) => {
  try {
    const now = new Date().toISOString();
    const skillKey = `${uid}_${skillId}`;
    const goalMode = options.goalMode || 'hybrid';
    const goalType = options.goalType || category?.toLowerCase() || 'custom';
    const goalConfig = options.goalConfig || {};
    const adaptationState = options.adaptationState || {
      adjustment: 1.0,
      lastEvaluation: null,
    };

    const payload = {
      id: skillKey,
      user_id: uid,
      skill_id: skillId,
      category,
      goal_type: goalType,
      goal_mode: goalMode,
      goal_config: goalConfig,
      adaptation_state: adaptationState,
      daily_minutes: dailyMinutes,
      current_topic_ids: [],
      completed_topic_ids: [],
      xp: 0,
      level: 1,
      streak_count: 0,
      last_active_date: toDateKey(),
      updated_at: now,
    };

    const { error } = await supabase.from('user_skills').upsert(payload, {
      onConflict: 'user_id,skill_id',
    });

    if (error) {
      // Backward-compatible fallback for environments not yet migrated.
      const fallbackPayload = {
        id: payload.id,
        user_id: payload.user_id,
        skill_id: payload.skill_id,
        category: payload.category,
        daily_minutes: payload.daily_minutes,
        current_topic_ids: payload.current_topic_ids,
        completed_topic_ids: payload.completed_topic_ids,
        xp: payload.xp,
        level: payload.level,
        streak_count: payload.streak_count,
        last_active_date: payload.last_active_date,
        updated_at: payload.updated_at,
      };

      const { error: fallbackError } = await supabase.from('user_skills').upsert(fallbackPayload, {
        onConflict: 'user_id,skill_id',
      });

      if (fallbackError) {
        throw fallbackError;
      }
    }
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
    const { data, error } = await supabase
      .from('user_skills')
      .select('*')
      .eq('user_id', uid)
      .eq('skill_id', skillId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return mapSkillRow(data);
  } catch (error) {
    console.error('Error fetching user skill:', error);
    throw error;
  }
};

/**
 * List all user skills
 */
export const listUserSkills = async (uid) => {
  try {
    const { data, error } = await supabase
      .from('user_skills')
      .select('*')
      .eq('user_id', uid)
      .order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map(mapSkillRow);
  } catch (error) {
    console.error('Error listing user skills:', error);
    throw error;
  }
};

/**
 * Mark a topic as completed for a skill
 */
export const markTopicCompleted = async (uid, skillId, topicId) => {
  try {
    const progress = await getUserSkillProgress(uid, skillId);

    if (!progress) {
      return null;
    }

    const completedTopicIds = new Set(progress.completedTopicIds || []);
    const currentTopicIds = new Set(progress.currentTopicIds || []);

    if (topicId) {
      completedTopicIds.add(topicId);
      currentTopicIds.delete(topicId);
    }

    const payload = {
      completed_topic_ids: Array.from(completedTopicIds),
      current_topic_ids: Array.from(currentTopicIds),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('user_skills')
      .update(payload)
      .eq('user_id', uid)
      .eq('skill_id', skillId);

    if (error) {
      throw error;
    }

    return { ...progress, ...payload };
  } catch (error) {
    console.error('Error marking topic completed:', error);
    throw error;
  }
};

/**
 * Update XP and recalculate level
 */
export const awardXP = async (uid, skillId, xpAmount) => {
  try {
    const progress = await getUserSkillProgress(uid, skillId);

    if (progress) {
      const newXp = (progress.xp || 0) + xpAmount;
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;

      const { error } = await supabase
        .from('user_skills')
        .update({
          xp: newXp,
          level: newLevel,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', uid)
        .eq('skill_id', skillId);

      if (error) {
        throw error;
      }

      return { xp: newXp, level: newLevel };
    }

    return null;
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
    const progress = await getUserSkillProgress(uid, skillId);

    if (progress) {
      const today = toDateKey();
      const lastActive = progress.lastActiveDate;

      let newStreak = progress.streakCount || 0;
      if (lastActive !== today) {
        const yesterday = toDateKey(new Date(Date.now() - 86400000));
        if (lastActive === yesterday) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      }

      const { error } = await supabase
        .from('user_skills')
        .update({
          streak_count: newStreak,
          last_active_date: today,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', uid)
        .eq('skill_id', skillId);

      if (error) {
        throw error;
      }

      return newStreak;
    }

    return null;
  } catch (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
};
