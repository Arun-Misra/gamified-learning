import { supabase } from './supabase';

const ROADMAP_CACHE_TTL_MS = 5 * 60 * 1000;
const roadmapCache = new Map();

const cacheKeyForSkill = (skillId) => `skill:${skillId}`;

const getCachedRoadmap = (key) => {
  const entry = roadmapCache.get(key);
  if (!entry) {
    return null;
  }

  if (Date.now() - entry.cachedAt > ROADMAP_CACHE_TTL_MS) {
    roadmapCache.delete(key);
    return null;
  }

  return entry.value;
};

const setCachedRoadmap = (key, value) => {
  roadmapCache.set(key, { value, cachedAt: Date.now() });
};

const mapRoadmapRow = (row) => {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    skillId: row.skill_id,
    category: row.category,
    name: row.name,
    version: row.version,
    tracks: row.tracks || [],
    createdByUserId: row.created_by_user_id || null,
    isUserGenerated: row.is_user_generated || false,
    sourceGoalText: row.source_goal_text || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const createGoalTracks = (goalName, goalMode, knowledgeLevel = 'beginner') => {
  const baseTitle = goalName || 'Custom Goal';

  if (goalMode === 'daily') {
    return [
      {
        trackId: 'daily-loop',
        title: 'Daily Loop',
        topics: [
          { topicId: 'daily-foundation', title: `${baseTitle}: Foundation session`, difficulty: 'easy', estimatedMinutes: 20, task: `Review one concept in ${baseTitle} and summarize key ideas.` },
          { topicId: 'daily-practice', title: `${baseTitle}: Practice block`, difficulty: 'medium', estimatedMinutes: 25, task: `Do one focused practice block for ${baseTitle}.` },
          { topicId: 'daily-application', title: `${baseTitle}: Applied task`, difficulty: 'medium', estimatedMinutes: 25, task: `Apply today's learning in a small practical exercise.` },
          { topicId: 'daily-review', title: `${baseTitle}: Reflection`, difficulty: 'easy', estimatedMinutes: 15, task: 'Write 3 takeaways and define tomorrow\'s first step.' },
        ],
      },
    ];
  }

  const levelCount = goalMode === 'hybrid' ? 30 : 40;
  const difficultyForLevel = (level) => {
    if (knowledgeLevel === 'advanced') {
      return level <= 10 ? 'medium' : 'hard';
    }
    if (knowledgeLevel === 'intermediate') {
      return level <= 10 ? 'easy' : level <= 25 ? 'medium' : 'hard';
    }
    return level <= 15 ? 'easy' : level <= 30 ? 'medium' : 'hard';
  };

  return Array.from({ length: Math.ceil(levelCount / 10) }, (_, trackIndex) => {
    const trackNo = trackIndex + 1;
    const start = trackIndex * 10 + 1;
    const end = Math.min(start + 9, levelCount);

    return {
      trackId: `goal-track-${trackNo}`,
      title: `${baseTitle}: Levels ${start}-${end}`,
      topics: Array.from({ length: end - start + 1 }, (_, offset) => {
        const level = start + offset;
        const difficulty = difficultyForLevel(level);
        return {
          topicId: `goal-l${String(level).padStart(3, '0')}`,
          title: `${baseTitle} Level ${level}`,
          difficulty,
          estimatedMinutes: difficulty === 'easy' ? 20 : difficulty === 'medium' ? 30 : 40,
          task: `Complete one mission that moves ${baseTitle} Level ${level} forward with measurable output.`,
        };
      }),
    };
  });
};

export const createUserGeneratedRoadmap = async ({
  uid,
  skillId,
  goalName,
  goalType = 'custom',
  goalMode = 'hybrid',
  knowledgeLevel = 'beginner',
  sourceGoalText = '',
}) => {
  const tracks = createGoalTracks(goalName, goalMode, knowledgeLevel);

  const payload = {
    id: skillId,
    skill_id: skillId,
    category: goalType,
    name: goalName,
    version: 1,
    tracks,
    created_by_user_id: uid,
    is_user_generated: true,
    source_goal_text: sourceGoalText || goalName,
  };

  const { error } = await supabase.from('roadmaps').upsert(payload, { onConflict: 'id' });
  if (error) {
    // Backward-compatible fallback for environments not yet migrated.
    const fallbackPayload = {
      id: payload.id,
      skill_id: payload.skill_id,
      category: payload.category,
      name: payload.name,
      version: payload.version,
      tracks: payload.tracks,
    };
    const { error: fallbackError } = await supabase.from('roadmaps').upsert(fallbackPayload, { onConflict: 'id' });
    if (fallbackError) {
      throw fallbackError;
    }
  }

  const roadmap = mapRoadmapRow(payload);
  if (roadmap) {
    setCachedRoadmap(cacheKeyForSkill(skillId), roadmap);
  }
  return roadmap;
};

/**
 * Fetch all roadmaps or filter by skill IDs
 */
export const fetchRoadmaps = async (skillIds = null) => {
  try {
    if (skillIds && skillIds.length === 1) {
      const cached = getCachedRoadmap(cacheKeyForSkill(skillIds[0]));
      if (cached) {
        return { [skillIds[0]]: cached };
      }
    }

    let request = supabase.from('roadmaps').select('*');

    if (skillIds && skillIds.length > 0) {
      request = request.in('skill_id', skillIds);
    }

    const { data, error } = await request;

    if (error) {
      throw error;
    }

    return (data || []).reduce((accumulator, row) => {
      const roadmap = mapRoadmapRow(row);
      if (roadmap) {
        accumulator[roadmap.skillId] = roadmap;
        setCachedRoadmap(cacheKeyForSkill(roadmap.skillId), roadmap);
      }
      return accumulator;
    }, {});
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
    const cached = getCachedRoadmap(cacheKeyForSkill(skillId));
    if (cached) {
      return cached;
    }

    const { data, error } = await supabase
      .from('roadmaps')
      .select('*')
      .eq('skill_id', skillId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      console.warn(`No roadmap found for skill: ${skillId}`);
      return null;
    }

    const roadmap = mapRoadmapRow(data);
    if (roadmap) {
      setCachedRoadmap(cacheKeyForSkill(skillId), roadmap);
    }

    return roadmap;
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    throw error;
  }
};
