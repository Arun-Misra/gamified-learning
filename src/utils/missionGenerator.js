/**
 * Mission generator based on roadmap progress
 */
export const generateDailyMissions = (roadmap, userProgress, dailyMinutes) => {
  if (!roadmap || !userProgress) {
    return [];
  }

  const missions = [];
  let remainingTime = Math.max(20, dailyMinutes || 30);
  const completedTopicIds = new Set(userProgress.completedTopicIds || []);

  // Flatten all topics from tracks
  const allTopics = [];
  if (roadmap.tracks && Array.isArray(roadmap.tracks)) {
    roadmap.tracks.forEach((track) => {
      if (track.topics && Array.isArray(track.topics)) {
        allTopics.push(...track.topics);
      }
    });
  }

  const incompleteTopics = allTopics.filter((topic) => !completedTopicIds.has(topic.topicId));

  const resolvedSkillId = (userProgress.skillId || roadmap.skillId || '').toLowerCase();

  if (resolvedSkillId === 'gym') {
    const gymTopics = incompleteTopics.length ? incompleteTopics : buildGymMaintenanceTopics();
    return buildGymDailyMissions(gymTopics, dailyMinutes);
  }

  if (!incompleteTopics.length) {
    return [];
  }

  const skillName = userProgress.skillId || roadmap.skillId || 'your skill';
  const primaryTopic = incompleteTopics[0];
  const secondaryTopic = incompleteTopics[1] || primaryTopic;
  const challengeTopic = incompleteTopics.find((topic) => topic.difficulty === 'hard') || secondaryTopic;

  const missionBlueprints = [
    {
      missionType: 'deep-work',
      topic: primaryTopic,
      timeFraction: 0.45,
      minMinutes: 20,
      build: (topic) => ({
        title: `Deep Work Sprint: ${topic.title}`,
        description:
          `Work in one focused block on ${topic.title}. Produce a concrete output (notes, code, reps, or drill log).`,
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
      timeFraction: 0.25,
      minMinutes: 12,
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
      missionType: 'applied-challenge',
      topic: challengeTopic,
      timeFraction: 0.2,
      minMinutes: 10,
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
      timeFraction: 0.1,
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

  missionBlueprints.forEach((blueprint, index) => {
    if (remainingTime < 8) {
      return;
    }

    const baseEstimate = blueprint.topic?.estimatedMinutes || 20;
    const computedMinutes = Math.floor(Math.min(baseEstimate, dailyMinutes * blueprint.timeFraction));
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

  // If user still has time budget, add one optional stretch mission from the next incomplete topic.
  if (remainingTime >= 10 && incompleteTopics[2]) {
    const stretchTopic = incompleteTopics[2];
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
 * Calculate XP reward based on difficulty and time spent
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
