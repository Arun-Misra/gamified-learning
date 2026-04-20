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
    verbs: ['Decode', 'Practice', 'Apply', 'Explain', 'Refine'],
    artifacts: ['study notes', 'practice drills', 'mini challenge', 'summary map', 'error log'],
    outcomes: ['retain core concepts', 'improve speed and accuracy', 'build confidence under pressure'],
  },
  career: {
    focus: 'professional growth',
    verbs: ['Map', 'Draft', 'Build', 'Present', 'Improve'],
    artifacts: ['career plan', 'portfolio piece', 'interview story bank', 'case-study summary', 'iteration notes'],
    outcomes: ['stronger role readiness', 'better communication', 'clear evidence of impact'],
  },
  health: {
    focus: 'physical progress',
    verbs: ['Activate', 'Train', 'Track', 'Recover', 'Progress'],
    artifacts: ['workout log', 'nutrition checkpoint', 'mobility routine', 'recovery scorecard', 'progress snapshot'],
    outcomes: ['consistent training quality', 'better movement patterns', 'measurable energy improvements'],
  },
  creative: {
    focus: 'creative output',
    verbs: ['Explore', 'Sketch', 'Compose', 'Ship', 'Critique'],
    artifacts: ['idea list', 'draft set', 'finished piece', 'feedback notes', 'revision pass'],
    outcomes: ['more original output', 'faster iteration loops', 'stronger creative voice'],
  },
  custom: {
    focus: 'goal completion',
    verbs: ['Research', 'Plan', 'Execute', 'Validate', 'Evolve'],
    artifacts: ['checkpoint notes', 'execution log', 'mini deliverable', 'validation summary', 'next-step brief'],
    outcomes: ['steady progress cadence', 'clear milestones', 'repeatable execution habits'],
  },
};

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
  level,
  totalLevels,
  knowledgeLevel,
}) => {
  const stageRatio = level / Math.max(1, totalLevels);
  const difficulty = getDifficultyByStage(knowledgeLevel, stageRatio);
  const verb = playbook.verbs[level % playbook.verbs.length];
  const artifact = playbook.artifacts[level % playbook.artifacts.length];
  const outcome = playbook.outcomes[level % playbook.outcomes.length];

  const estimatedMinutes = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 30 : 40;

  return {
    topicId: `goal-l${String(level).padStart(3, '0')}`,
    title: `${phase.label}: ${verb} ${goalName}`,
    difficulty,
    estimatedMinutes,
    task: `${verb} ${goalName} and produce a ${artifact}. Success outcome: ${outcome}.`,
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

const createGoalTracks = (goalName, goalMode, goalType = 'custom', knowledgeLevel = 'beginner') => {
  const baseTitle = goalName || 'Custom Goal';
  const playbook = getPlaybook(goalType, baseTitle);

  if (goalMode === 'daily') {
    return [
      {
        trackId: 'daily-loop',
        title: `${baseTitle}: Daily Execution Loop`,
        topics: [
          {
            topicId: 'daily-foundation',
            title: `Daily Foundation: ${playbook.verbs[0]} ${baseTitle}`,
            difficulty: 'easy',
            estimatedMinutes: 20,
            task: `${playbook.verbs[0]} ${baseTitle} using yesterday's notes and produce one ${playbook.artifacts[0]}.`,
          },
          {
            topicId: 'daily-practice',
            title: `Daily Practice: ${playbook.verbs[1]} ${baseTitle}`,
            difficulty: 'medium',
            estimatedMinutes: 25,
            task: `Run focused repetitions for ${baseTitle}. Track one measurable metric in your ${playbook.artifacts[1]}.`,
          },
          {
            topicId: 'daily-application',
            title: `Daily Application: ${playbook.verbs[2]} ${baseTitle}`,
            difficulty: 'medium',
            estimatedMinutes: 25,
            task: `Apply ${baseTitle} in a small real-world scenario and produce one ${playbook.artifacts[2]}.`,
          },
          {
            topicId: 'daily-review',
            title: `Daily Review: ${playbook.verbs[3]} progress`,
            difficulty: 'easy',
            estimatedMinutes: 15,
            task: `Write 3 takeaways, capture one blocker, and define tomorrow's first action for ${baseTitle}.`,
          },
        ],
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
      const topic = buildDynamicTopic({
        goalName: baseTitle,
        playbook,
        phase,
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

export const createUserGeneratedRoadmap = async ({
  uid,
  skillId,
  goalName,
  goalType = 'custom',
  goalMode = 'hybrid',
  knowledgeLevel = 'beginner',
  sourceGoalText = '',
}) => {
  const tracks = createGoalTracks(goalName, goalMode, goalType, knowledgeLevel);

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
