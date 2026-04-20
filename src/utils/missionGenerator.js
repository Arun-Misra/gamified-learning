/**
 * Mission generator based on roadmap progress and planner mode.
 */
export const generateDailyMissions = (roadmap, userProgress, dailyMinutes) => {
  if (!roadmap || !userProgress) {
    return [];
  }

  const completedTopicIds = new Set(userProgress.completedTopicIds || []);
  const goalMode = (userProgress.goalMode || 'hybrid').toLowerCase();
  const resolvedSkillId = (userProgress.skillId || roadmap.skillId || '').toLowerCase();

  const allTopics = [];
  if (Array.isArray(roadmap.tracks)) {
    roadmap.tracks.forEach((track) => {
      if (Array.isArray(track.topics)) {
        allTopics.push(...track.topics);
      }
    });
  }

  const incompleteTopics = allTopics.filter((topic) => !completedTopicIds.has(topic.topicId));

  if (resolvedSkillId === 'gym') {
    const gymTopics = incompleteTopics.length ? incompleteTopics : buildGymMaintenanceTopics();
    return buildGymDailyMissions(gymTopics, dailyMinutes);
  }

  if (!incompleteTopics.length) {
    return [];
  }

  if (goalMode === 'daily') {
    return buildDailyModeMissions(incompleteTopics, dailyMinutes, userProgress, roadmap);
  }

  if (goalMode === 'level') {
    return buildLevelModeMissions(incompleteTopics, dailyMinutes, userProgress, roadmap);
  }

  return buildHybridModeMissions(incompleteTopics, dailyMinutes, userProgress, roadmap);
};

const buildLevelModeMissions = (incompleteTopics, dailyMinutes, userProgress, roadmap) => {
  const skillName = userProgress.skillId || roadmap.skillId || 'your skill';
  const primaryTopic = incompleteTopics[0];
  const secondaryTopic = incompleteTopics[1] || primaryTopic;
  const challengeTopic = incompleteTopics[2] || incompleteTopics.find((topic) => topic.difficulty === 'hard') || secondaryTopic;

  let remainingTime = Math.max(20, dailyMinutes || 30);
  const levelPlan = [
    {
      missionType: 'milestone-push',
      topic: primaryTopic,
      minMinutes: 20,
      fraction: 0.45,
      details: (topic) => ({
        title: `Milestone Push: ${topic.title}`,
        description: `Advance the next milestone for ${topic.title} with one clear, testable artifact.`,
        successCriteria: [
          'Complete one milestone deliverable',
          'Document one blocker and how you resolved it',
        ],
      }),
    },
    {
      missionType: 'precision-drill',
      topic: secondaryTopic,
      minMinutes: 12,
      fraction: 0.25,
      details: (topic) => ({
        title: `Precision Drill: ${topic.title}`,
        description: 'Run focused reps and tighten error rate or execution quality.',
        successCriteria: [
          'Complete at least 3 focused reps',
          'Track one measurable metric per rep',
        ],
      }),
    },
    {
      missionType: 'level-checkpoint',
      topic: challengeTopic,
      minMinutes: 12,
      fraction: 0.2,
      details: (topic) => ({
        title: `Checkpoint Challenge: ${topic.title}`,
        description: 'Do one realistic challenge attempt to validate this level.',
        successCriteria: [
          'Attempt one end-to-end challenge',
          'Capture pass/fail notes with next improvement',
        ],
      }),
    },
    {
      missionType: 'review-log',
      topic: primaryTopic,
      minMinutes: 8,
      fraction: 0.1,
      details: () => ({
        title: `Level Review: ${skillName}`,
        description: 'Close out the day by recording insights and tomorrow\'s first move.',
        successCriteria: ['Write 3 takeaways', 'Define tomorrow\'s first 10-minute action'],
      }),
    },
  ];

  return levelPlan.reduce((result, plan, index) => {
    if (remainingTime < 8) {
      return result;
    }

    const baseEstimate = plan.topic?.estimatedMinutes || 20;
    const computedMinutes = Math.floor(Math.min(baseEstimate, (dailyMinutes || 30) * plan.fraction));
    const estimatedMinutes = Math.max(plan.minMinutes, Math.min(remainingTime, computedMinutes || plan.minMinutes));
    const detail = plan.details(plan.topic || primaryTopic);
    const difficulty = plan.topic?.difficulty || 'medium';

    result.push({
      missionId: `mission-${plan.topic?.topicId || 'general'}-${Date.now()}-level-${index}`,
      topicId: plan.topic?.topicId || null,
      title: detail.title,
      description: detail.description,
      successCriteria: detail.successCriteria,
      missionType: plan.missionType,
      difficulty,
      estimatedMinutes,
      xpReward: computeXpReward(difficulty, estimatedMinutes, plan.missionType),
      status: 'pending',
      completedAt: null,
    });

    remainingTime -= estimatedMinutes;
    return result;
  }, []);
};

const buildDailyModeMissions = (incompleteTopics, dailyMinutes, userProgress, roadmap) => {
  const skillName = roadmap.name || userProgress.skillId || roadmap.skillId || 'your goal';
  const seedTopic = incompleteTopics[0];

  const dailyTopics = [
    {
      topicId: seedTopic?.topicId || 'daily-anchor',
      title: `Daily Foundation: ${skillName}`,
      difficulty: 'easy',
      estimatedMinutes: 20,
    },
    {
      topicId: incompleteTopics[1]?.topicId || 'daily-practice',
      title: `Daily Practice: ${skillName}`,
      difficulty: 'medium',
      estimatedMinutes: 25,
    },
    {
      topicId: incompleteTopics[2]?.topicId || 'daily-application',
      title: `Daily Application: ${skillName}`,
      difficulty: 'medium',
      estimatedMinutes: 25,
    },
    {
      topicId: 'daily-review',
      title: `Daily Review: ${skillName}`,
      difficulty: 'easy',
      estimatedMinutes: 12,
    },
  ];

  return buildDailyLoopMissions(dailyTopics, dailyMinutes, skillName);
};

const buildHybridModeMissions = (incompleteTopics, dailyMinutes, userProgress, roadmap) => {
  const skillName = userProgress.skillId || roadmap.skillId || 'your skill';
  const primaryTopic = incompleteTopics[0];
  const secondaryTopic = incompleteTopics[1] || primaryTopic;
  const challengeTopic = incompleteTopics.find((topic) => topic.difficulty === 'hard') || incompleteTopics[2] || secondaryTopic;

  let remainingTime = Math.max(20, dailyMinutes || 30);
  const missionBlueprints = [
    {
      missionType: 'deep-work',
      topic: primaryTopic,
      timeFraction: 0.35,
      minMinutes: 18,
      build: (topic) => ({
        title: `Deep Work Sprint: ${topic.title}`,
        description: `Work in one focused block on ${topic.title}. Produce a concrete output (notes, code, reps, or drill log).`,
        successCriteria: [
          'Complete one uninterrupted focus block',
          'Ship one tangible output',
          'Record one insight and one mistake to avoid',
        ],
      }),
    },
    {
      missionType: 'skill-drill',
      topic: secondaryTopic,
      timeFraction: 0.2,
      minMinutes: 10,
      build: (topic) => ({
        title: `Skill Drill: ${topic.title}`,
        description: `Run 3 fast repetitions for ${topic.title} with immediate corrections after each rep.`,
        successCriteria: [
          'Finish at least 3 reps',
          'Capture one metric per rep (speed, accuracy, load, or clarity)',
        ],
      }),
    },
    {
      missionType: 'daily-loop-anchor',
      topic: primaryTopic,
      timeFraction: 0.25,
      minMinutes: 12,
      build: (topic) => ({
        title: `Daily Loop Anchor: ${topic.title}`,
        description: `Run a repeatable daily practice block for ${topic.title} and log consistency quality.`,
        successCriteria: [
          'Complete one repeatable practice cycle',
          'Track quality score out of 10',
        ],
      }),
    },
    {
      missionType: 'applied-challenge',
      topic: challengeTopic,
      timeFraction: 0.12,
      minMinutes: 8,
      build: (topic) => ({
        title: `Applied Challenge: ${topic.title}`,
        description: `Use ${topic.title} in a mini real-world challenge. Keep it small but complete.`,
        successCriteria: [
          'Complete one end-to-end challenge attempt',
          'Write what worked and what failed',
        ],
      }),
    },
    {
      missionType: 'review-log',
      topic: primaryTopic,
      timeFraction: 0.08,
      minMinutes: 8,
      build: () => ({
        title: `Review Log: ${skillName}`,
        description: 'Close the loop: summarize what you learned and set a sharper target for tomorrow.',
        successCriteria: [
          'Write 3 takeaways',
          'Define tomorrow\'s first 10-minute action',
        ],
      }),
    },
  ];

  const missions = [];

  missionBlueprints.forEach((blueprint, index) => {
    if (remainingTime < 8) {
      return;
    }

    const baseEstimate = blueprint.topic?.estimatedMinutes || 20;
    const computedMinutes = Math.floor(Math.min(baseEstimate, (dailyMinutes || 30) * blueprint.timeFraction));
    const estimatedMinutes = Math.max(blueprint.minMinutes, Math.min(remainingTime, computedMinutes || blueprint.minMinutes));
    const difficulty = blueprint.topic?.difficulty || (blueprint.missionType === 'review-log' ? 'easy' : 'medium');
    const detail = blueprint.build(blueprint.topic || primaryTopic);

    missions.push({
      missionId: `mission-${blueprint.topic?.topicId || 'general'}-${Date.now()}-${index}`,
      topicId: blueprint.topic?.topicId || null,
      title: detail.title,
      description: detail.description,
      successCriteria: detail.successCriteria,
      missionType: blueprint.missionType,
      difficulty,
      estimatedMinutes,
      xpReward: computeXpReward(difficulty, estimatedMinutes, blueprint.missionType),
      status: 'pending',
      completedAt: null,
    });

    remainingTime -= estimatedMinutes;
  });

  if (remainingTime >= 10 && incompleteTopics[3]) {
    const stretchTopic = incompleteTopics[3];
    const stretchMinutes = Math.min(remainingTime, Math.max(10, Math.floor((stretchTopic.estimatedMinutes || 20) * 0.4)));

    missions.push({
      missionId: `mission-${stretchTopic.topicId}-${Date.now()}-stretch`,
      topicId: stretchTopic.topicId,
      title: `Stretch Goal: ${stretchTopic.title}`,
      description: 'Optional bonus mission for extra XP. Attempt only after core quests are complete.',
      successCriteria: ['Attempt one advanced variation', 'Log final score/quality in one line'],
      missionType: 'stretch-goal',
      difficulty: stretchTopic.difficulty || 'hard',
      estimatedMinutes: stretchMinutes,
      xpReward: computeXpReward(stretchTopic.difficulty || 'hard', stretchMinutes, 'stretch-goal'),
      status: 'pending',
      completedAt: null,
    });
  }

  return missions;
};

const buildDailyLoopMissions = (topics, dailyMinutes, skillName = 'your goal') => {
  const missionPlan = [
    {
      missionType: 'daily-foundation',
      titlePrefix: 'Foundation Block',
      minMinutes: 8,
      fraction: 0.25,
      difficultyFallback: 'easy',
      criteria: ['Review previous notes and context', 'Define one sharp outcome for this block'],
    },
    {
      missionType: 'daily-practice',
      titlePrefix: 'Practice Block',
      minMinutes: 12,
      fraction: 0.35,
      difficultyFallback: 'medium',
      criteria: ['Complete at least 3 quality reps', 'Track one metric per rep'],
    },
    {
      missionType: 'daily-application',
      titlePrefix: 'Application Block',
      minMinutes: 10,
      fraction: 0.25,
      difficultyFallback: 'medium',
      criteria: ['Finish one mini real-world task', 'Capture one lesson learned'],
    },
    {
      missionType: 'daily-review',
      titlePrefix: 'Review Block',
      minMinutes: 8,
      fraction: 0.15,
      difficultyFallback: 'easy',
      criteria: ['Write 3 takeaways', 'Set tomorrow\'s first 10-minute action'],
    },
  ];

  let remainingTime = Math.max(20, dailyMinutes || 30);
  const pool = topics.length
    ? topics
    : [{ topicId: 'daily-default', title: `Daily Loop: ${skillName}`, difficulty: 'medium', estimatedMinutes: 20 }];
  const missions = [];

  missionPlan.forEach((plan, index) => {
    if (remainingTime < 8) {
      return;
    }

    const topic = pool[index % pool.length];
    const estimatedByFraction = Math.floor((dailyMinutes || 30) * plan.fraction);
    const estimatedMinutes = Math.max(plan.minMinutes, Math.min(remainingTime, estimatedByFraction || plan.minMinutes));
    const difficulty = topic?.difficulty || plan.difficultyFallback;

    missions.push({
      missionId: `mission-${topic?.topicId || 'daily'}-${Date.now()}-daily-${index}`,
      topicId: topic?.topicId || null,
      title: `${plan.titlePrefix}: ${topic?.title || skillName}`,
      description: `Run this ${plan.titlePrefix.toLowerCase()} for ${skillName} and log one measurable result.`,
      successCriteria: plan.criteria,
      missionType: plan.missionType,
      difficulty,
      estimatedMinutes,
      xpReward: computeXpReward(difficulty, estimatedMinutes, plan.missionType),
      status: 'pending',
      completedAt: null,
    });

    remainingTime -= estimatedMinutes;
  });

  return missions;
};

const buildGymMaintenanceTopics = () => [
  { topicId: 'gym-maintenance-warmup', title: 'Mobility and Warm-up Flow', difficulty: 'easy', estimatedMinutes: 12 },
  { topicId: 'gym-maintenance-strength', title: 'Strength Compound Session', difficulty: 'medium', estimatedMinutes: 30 },
  { topicId: 'gym-maintenance-cardio', title: 'Conditioning Intervals', difficulty: 'medium', estimatedMinutes: 20 },
  { topicId: 'gym-maintenance-core', title: 'Core Stability Circuit', difficulty: 'medium', estimatedMinutes: 15 },
  { topicId: 'gym-maintenance-cooldown', title: 'Cooldown and Recovery', difficulty: 'easy', estimatedMinutes: 10 },
];

const buildGymDailyMissions = (topics, dailyMinutes) => {
  const missionPlan = [
    {
      missionType: 'warmup-primer',
      titlePrefix: 'Movement Primer',
      minMinutes: 8,
      fraction: 0.2,
      difficultyFallback: 'easy',
      criteria: ['Complete full warm-up sequence', 'Log how your body feels before and after'],
    },
    {
      missionType: 'strength-block',
      titlePrefix: 'Strength Block',
      minMinutes: 16,
      fraction: 0.4,
      difficultyFallback: 'medium',
      criteria: ['Finish main working sets', 'Track load, reps, and RPE for each set'],
    },
    {
      missionType: 'conditioning-finisher',
      titlePrefix: 'Conditioning Finisher',
      minMinutes: 10,
      fraction: 0.25,
      difficultyFallback: 'medium',
      criteria: ['Complete all rounds without skipping', 'Record total time or distance'],
    },
    {
      missionType: 'recovery-review',
      titlePrefix: 'Recovery Review',
      minMinutes: 8,
      fraction: 0.15,
      difficultyFallback: 'easy',
      criteria: ['Cool down with mobility work', 'Write one improvement for tomorrow'],
    },
  ];

  let remainingTime = Math.max(20, dailyMinutes || 30);
  const pool = topics.length ? topics : buildGymMaintenanceTopics();
  const missions = [];

  missionPlan.forEach((plan, index) => {
    if (remainingTime < 8) {
      return;
    }

    const topic = pool[index % pool.length];
    const estimatedByFraction = Math.floor((dailyMinutes || 30) * plan.fraction);
    const estimatedMinutes = Math.max(plan.minMinutes, Math.min(remainingTime, estimatedByFraction || plan.minMinutes));
    const difficulty = topic?.difficulty || plan.difficultyFallback;

    missions.push({
      missionId: `mission-${topic?.topicId || 'gym'}-${Date.now()}-gym-${index}`,
      topicId: topic?.topicId || null,
      title: `${plan.titlePrefix}: ${topic?.title || 'Gym Session'}`,
      description: `Execute ${topic?.title || 'today\'s gym mission'} with clean form and measurable effort.`,
      successCriteria: plan.criteria,
      missionType: plan.missionType,
      difficulty,
      estimatedMinutes,
      xpReward: computeXpReward(difficulty, estimatedMinutes, plan.missionType),
      status: 'pending',
      completedAt: null,
    });

    remainingTime -= estimatedMinutes;
  });

  return missions;
};

const computeXpReward = (difficulty, estimatedMinutes, missionType) => {
  const difficultyMultiplier = {
    easy: 1,
    medium: 1.35,
    hard: 1.8,
  };

  const missionTypeBonus = {
    'deep-work': 8,
    'skill-drill': 5,
    'applied-challenge': 9,
    'milestone-push': 10,
    'precision-drill': 6,
    'level-checkpoint': 8,
    'daily-loop-anchor': 7,
    'daily-foundation': 5,
    'daily-practice': 7,
    'daily-application': 8,
    'daily-review': 4,
    'review-log': 4,
    'stretch-goal': 12,
    'warmup-primer': 4,
    'strength-block': 10,
    'conditioning-finisher': 8,
    'recovery-review': 4,
  };

  const base = Math.max(6, Math.floor(estimatedMinutes / 3));
  return Math.floor(base * (difficultyMultiplier[difficulty] || 1.1) + (missionTypeBonus[missionType] || 0));
};

/**
 * Calculate XP reward based on difficulty and time spent.
 */
export const calculateXpReward = (difficulty, estimatedMinutes) => {
  const baseXp = Math.floor(estimatedMinutes / 5);
  const difficultyMultiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2,
  };
  return Math.floor(baseXp * (difficultyMultiplier[difficulty] || 1));
};
