/**
 * Mission generator based on roadmap progress
 */
export const generateDailyMissions = (roadmap, userProgress, dailyMinutes) => {
  if (!roadmap || !userProgress) {
    return [];
  }

  const missions = [];
  let remainingTime = dailyMinutes;
  const completedTopicIds = new Set(userProgress.completedTopicIds || []);
  const currentTopicIds = userProgress.currentTopicIds || [];

  // Flatten all topics from tracks
  const allTopics = [];
  if (roadmap.tracks && Array.isArray(roadmap.tracks)) {
    roadmap.tracks.forEach((track) => {
      if (track.topics && Array.isArray(track.topics)) {
        allTopics.push(...track.topics);
      }
    });
  }

  // Get next incomplete topics
  const incompleteTopic = allTopics.find((topic) => !completedTopicIds.has(topic.topicId));

  if (incompleteTopic) {
    const estimatedMinutes = incompleteTopic.estimatedMinutes || 30;
    const xpReward = Math.max(10, Math.floor(estimatedMinutes / 3) + (incompleteTopic.difficulty === 'hard' ? 15 : 0));

    missions.push({
      missionId: `mission-${incompleteTopic.topicId}-${Date.now()}`,
      topicId: incompleteTopic.topicId,
      title: incompleteTopic.title,
      difficulty: incompleteTopic.difficulty || 'medium',
      estimatedMinutes,
      xpReward,
      status: 'pending',
      completedAt: null,
    });

    remainingTime -= estimatedMinutes;
  }

  // Add supplementary missions if time permits
  const remainingTopics = allTopics.filter(
    (topic) => !completedTopicIds.has(topic.topicId) && topic.topicId !== incompleteTopic?.topicId
  );

  for (const topic of remainingTopics) {
    if (remainingTime <= 0) break;

    const estimatedMinutes = Math.min(topic.estimatedMinutes || 20, remainingTime);
    const xpReward = Math.max(5, Math.floor(estimatedMinutes / 4) + (topic.difficulty === 'hard' ? 10 : 0));

    missions.push({
      missionId: `mission-${topic.topicId}-${Date.now()}-${Math.random()}`,
      topicId: topic.topicId,
      title: topic.title,
      difficulty: topic.difficulty || 'medium',
      estimatedMinutes,
      xpReward,
      status: 'pending',
      completedAt: null,
    });

    remainingTime -= estimatedMinutes;
  }

  return missions;
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
