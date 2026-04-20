import { describe, expect, test } from 'vitest';
import { generateDailyMissions, calculateXpReward } from './missionGenerator';

const buildRoadmap = () => ({
  skillId: 'python',
  tracks: [
    {
      topics: Array.from({ length: 100 }, (_, index) => ({
        topicId: `python-l${String(index + 1).padStart(3, '0')}`,
        title: `Python Level ${index + 1}`,
        difficulty: index < 30 ? 'easy' : index < 70 ? 'medium' : 'hard',
        estimatedMinutes: index < 30 ? 20 : index < 70 ? 35 : 50,
      })),
    },
  ],
});

describe('generateDailyMissions', () => {
  test('creates richer mission types with success criteria', () => {
    const roadmap = buildRoadmap();
    const userProgress = {
      skillId: 'python',
      completedTopicIds: ['python-l001', 'python-l002', 'python-l003'],
      dailyMinutes: 90,
    };

    const missions = generateDailyMissions(roadmap, userProgress, 90);

    expect(missions.length).toBeGreaterThan(0);
    expect(missions[0]).toMatchObject({
      title: expect.stringContaining('Deep Work'),
      missionType: 'deep-work',
      status: 'pending',
    });
    expect(Array.isArray(missions[0].successCriteria)).toBe(true);
    expect(missions.some((mission) => mission.missionType === 'stretch-goal')).toBe(true);
  });

  test('rewards harder missions with more XP', () => {
    const easyXp = calculateXpReward('easy', 20);
    const hardXp = calculateXpReward('hard', 50);

    expect(hardXp).toBeGreaterThan(easyXp);
  });

  test('returns no missions when all topics are already completed', () => {
    const roadmap = buildRoadmap();
    const userProgress = {
      skillId: 'python',
      completedTopicIds: Array.from({ length: 100 }, (_, index) => `python-l${String(index + 1).padStart(3, '0')}`),
      dailyMinutes: 90,
    };

    expect(generateDailyMissions(roadmap, userProgress, 90)).toEqual([]);
  });

  test.todo('Coming soon: generate skill-specific challenge templates per roadmap category');
});
