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

const DOMAIN_PLAYBOOKS = {
  study: {
    focus: 'knowledge mastery',
    defaultPillars: ['Core Concepts', 'Deliberate Practice', 'Applied Problem Solving'],
    actions: ['Decode', 'Practice', 'Apply', 'Explain', 'Refine', 'Benchmark'],
    artifacts: ['study map', 'exercise set', 'mini project', 'review notes', 'error log'],
    metrics: ['accuracy', 'speed', 'retention score'],
  },
  career: {
    focus: 'professional growth',
    defaultPillars: ['Role Fundamentals', 'Portfolio Evidence', 'Communication Skills'],
    actions: ['Map', 'Draft', 'Build', 'Present', 'Improve', 'Validate'],
    artifacts: ['career plan', 'portfolio item', 'interview story', 'feedback summary', 'iteration notes'],
    metrics: ['clarity score', 'delivery confidence', 'impact evidence'],
  },
  health: {
    focus: 'physical progress',
    defaultPillars: ['Movement Quality', 'Training Capacity', 'Recovery Discipline'],
    actions: ['Activate', 'Train', 'Track', 'Recover', 'Progress', 'Stabilize'],
    artifacts: ['workout log', 'mobility checklist', 'sleep summary', 'progress snapshot', 'meal log'],
    metrics: ['consistency', 'form quality', 'recovery score'],
  },
  creative: {
    focus: 'creative output',
    defaultPillars: ['Idea Generation', 'Craft Skills', 'Publishing Rhythm'],
    actions: ['Explore', 'Sketch', 'Compose', 'Ship', 'Critique', 'Remix'],
    artifacts: ['idea list', 'draft set', 'finished piece', 'feedback notes', 'revision log'],
    metrics: ['output volume', 'quality rating', 'iteration speed'],
  },
  custom: {
    focus: 'goal completion',
    defaultPillars: ['Foundation', 'Execution', 'Iteration'],
    actions: ['Research', 'Plan', 'Execute', 'Validate', 'Evolve', 'Systemize'],
    artifacts: ['checkpoint notes', 'execution log', 'mini deliverable', 'validation summary', 'next-step brief'],
    metrics: ['completion rate', 'quality score', 'consistency'],
  },
};

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'into', 'your', 'that', 'this', 'those', 'these',
  'learn', 'learning', 'become', 'be', 'get', 'improve', 'build', 'create', 'a', 'an', 'to',
  'of', 'in', 'on', 'at', 'by', 'is', 'it', 'as', 'my', 'me', 'i', 'want', 'need', 'better',
]);

const PHASE_LIBRARY = [
  {
    key: 'foundation',
    label: 'Foundation',
    objective: 'build the baseline and remove early friction',
  },
  {
    key: 'core-practice',
    label: 'Core Practice',
    objective: 'run deliberate repetitions with measurable quality',
  },
  {
    key: 'applied-output',
    label: 'Applied Output',
    objective: 'ship real outputs in realistic conditions',
  },
  {
    key: 'optimization',
    label: 'Optimization',
    objective: 'tighten weak spots and improve consistency',
  },
  {
    key: 'mastery-loop',
    label: 'Mastery Loop',
    objective: 'sustain progress through reflection and upgrades',
  },
];

const titleCase = (value = '') =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const getTokens = (text = '') =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length >= 4 && !STOP_WORDS.has(word));

const getPlaybook = (goalType, goalName) => {
  const normalizedType = (goalType || '').toLowerCase();
  if (DOMAIN_PLAYBOOKS[normalizedType]) {
    return DOMAIN_PLAYBOOKS[normalizedType];
  }

  const text = (goalName || '').toLowerCase();
  if (/(fitness|gym|run|strength|health|weight)/.test(text)) return DOMAIN_PLAYBOOKS.health;
  if (/(job|career|interview|resume|promotion|leadership)/.test(text)) return DOMAIN_PLAYBOOKS.career;
  if (/(design|music|write|art|creative|content)/.test(text)) return DOMAIN_PLAYBOOKS.creative;
  if (/(learn|study|exam|course|code|programming|math)/.test(text)) return DOMAIN_PLAYBOOKS.study;
  return DOMAIN_PLAYBOOKS.custom;
};

const inferPillars = (goalName, sourceGoalText, goalType) => {
  const combinedText = `${goalName || ''} ${sourceGoalText || ''}`.trim();
  const playbook = getPlaybook(goalType, combinedText || goalName);
  const tokenCounts = getTokens(combinedText).reduce((accumulator, token) => {
    accumulator[token] = (accumulator[token] || 0) + 1;
    return accumulator;
  }, {});

  const topTokens = Object.entries(tokenCounts)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3)
    .map(([token]) => titleCase(token));

  const inferred = topTokens.length ? topTokens : [];
  const defaults = playbook.defaultPillars || [];

  const pillars = [...inferred, ...defaults]
    .filter((value, index, source) => value && source.indexOf(value) === index)
    .slice(0, 4);

  return {
    playbook,
    pillars: pillars.length ? pillars : defaults.slice(0, 3),
  };
};

const getDifficultyByStage = (knowledgeLevel, stageRatio) => {
  if (knowledgeLevel === 'advanced') {
    return stageRatio < 0.25 ? 'medium' : 'hard';
  }
  if (knowledgeLevel === 'intermediate') {
    if (stageRatio < 0.2) return 'easy';
    if (stageRatio < 0.7) return 'medium';
    return 'hard';
  }
  if (stageRatio < 0.4) return 'easy';
  if (stageRatio < 0.85) return 'medium';
  return 'hard';
};

const buildDynamicTopic = ({
  goalName,
  playbook,
  phase,
  pillar,
  level,
  totalLevels,
  knowledgeLevel,
}) => {
  const stageRatio = level / Math.max(1, totalLevels);
  const difficulty = getDifficultyByStage(knowledgeLevel, stageRatio);
  const action = playbook.actions[level % playbook.actions.length];
  const artifact = playbook.artifacts[level % playbook.artifacts.length];
  const metric = playbook.metrics[level % playbook.metrics.length];

  const estimatedMinutes = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 30 : 40;

  return {
    topicId: `goal-l${String(level).padStart(3, '0')}`,
    title: `${phase.label}: ${action} ${pillar}`,
    difficulty,
    estimatedMinutes,
    task: `${action} ${pillar} for ${goalName}. Deliverable: ${artifact}. Measure success by ${metric}.`,
  };
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

export const buildPlannedTracks = ({
  goalName,
  goalMode,
  goalType = 'custom',
  knowledgeLevel = 'beginner',
  sourceGoalText = '',
}) => {
  const baseTitle = goalName || 'Custom Goal';
  const { playbook, pillars } = inferPillars(baseTitle, sourceGoalText, goalType);

  if (goalMode === 'daily') {
    const loopTopics = [
      {
        phase: 'Foundation',
        action: playbook.actions[0],
        pillar: pillars[0] || playbook.defaultPillars[0],
        difficulty: 'easy',
        minutes: 20,
      },
      {
        phase: 'Practice',
        action: playbook.actions[1],
        pillar: pillars[1] || pillars[0] || playbook.defaultPillars[1],
        difficulty: 'medium',
        minutes: 25,
      },
      {
        phase: 'Application',
        action: playbook.actions[2],
        pillar: pillars[2] || pillars[0] || playbook.defaultPillars[2],
        difficulty: 'medium',
        minutes: 25,
      },
      {
        phase: 'Review',
        action: playbook.actions[3],
        pillar: pillars[0] || playbook.defaultPillars[0],
        difficulty: 'easy',
        minutes: 15,
      },
    ];

    return [
      {
        trackId: 'daily-loop',
        title: `${baseTitle}: Daily Execution Loop`,
        topics: loopTopics.map((loop, index) => ({
          topicId: `daily-${loop.phase.toLowerCase()}`,
          title: `Daily ${loop.phase}: ${loop.action} ${loop.pillar}`,
          difficulty: loop.difficulty,
          estimatedMinutes: loop.minutes,
          task: `${loop.action} ${loop.pillar} for ${baseTitle}. Deliverable: ${playbook.artifacts[index % playbook.artifacts.length]}.`,
        })),
      },
    ];
  }

  const levelCount = goalMode === 'hybrid' ? 30 : 40;
  const activePhases = PHASE_LIBRARY.slice(0, goalMode === 'hybrid' ? 4 : 5);
  const basePerPhase = Math.floor(levelCount / activePhases.length);
  let currentLevel = 1;

  return activePhases.map((phase, phaseIndex) => {
    const isLast = phaseIndex === activePhases.length - 1;
    const phaseCount = isLast ? levelCount - currentLevel + 1 : basePerPhase;
    const topics = Array.from({ length: phaseCount }, () => {
      const pillar = pillars[(currentLevel - 1) % pillars.length] || playbook.defaultPillars[0];
      const topic = buildDynamicTopic({
        goalName: baseTitle,
        playbook,
        phase,
        pillar,
        level: currentLevel,
        totalLevels: levelCount,
        knowledgeLevel,
      });
      currentLevel += 1;
      return topic;
    });

    return {
      trackId: `goal-track-${phase.key}`,
      title: `${phase.label}: ${phase.objective}`,
      topics,
    };
  });
};

const createGoalTracks = (goalName, goalMode, goalType = 'custom', knowledgeLevel = 'beginner', sourceGoalText = '') =>
  buildPlannedTracks({
    goalName,
    goalMode,
    goalType,
    knowledgeLevel,
    sourceGoalText,
  });

export const createUserGeneratedRoadmap = async ({
  uid,
  skillId,
  goalName,
  goalType = 'custom',
  goalMode = 'hybrid',
  knowledgeLevel = 'beginner',
  sourceGoalText = '',
}) => {
  const tracks = createGoalTracks(goalName, goalMode, goalType, knowledgeLevel, sourceGoalText);

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
