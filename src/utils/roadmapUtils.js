export const flattenRoadmapTopics = (roadmap) =>
  (roadmap?.tracks || []).flatMap((track) => track?.topics || []);

export const getLevelXpBonus = (levelNumber) => Math.max(4, Math.floor(levelNumber / 10));
