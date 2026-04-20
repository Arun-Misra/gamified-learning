/**
 * Leveling constants and functions
 */
export const XP_PER_LEVEL = 100;

/**
 * Calculate level from total XP
 */
export const calculateLevel = (totalXp) => {
  return Math.floor(totalXp / XP_PER_LEVEL) + 1;
};

/**
 * Calculate XP required for next level
 */
export const xpForNextLevel = (currentLevel) => {
  return currentLevel * XP_PER_LEVEL;
};

/**
 * Calculate progress to next level (0-100%)
 */
export const progressToNextLevel = (totalXp) => {
  const currentLevel = calculateLevel(totalXp);
  const currentLevelXp = (currentLevel - 1) * XP_PER_LEVEL;
  const nextLevelXp = currentLevel * XP_PER_LEVEL;
  const progress = totalXp - currentLevelXp;
  const needed = nextLevelXp - currentLevelXp;
  return Math.floor((progress / needed) * 100);
};

/**
 * Get skill level color based on level
 */
export const getLevelColor = (level) => {
  if (level < 5) return 'text-green-500';
  if (level < 10) return 'text-blue-500';
  if (level < 20) return 'text-purple-500';
  if (level < 50) return 'text-pink-500';
  return 'text-yellow-500';
};
