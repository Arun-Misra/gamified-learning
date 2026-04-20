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
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
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
