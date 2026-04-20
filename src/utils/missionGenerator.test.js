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
  test('creates richer mission types with success criteria in hybrid mode', () => {
    const roadmap = buildRoadmap();
    const userProgress = {
      skillId: 'python',
      goalMode: 'hybrid',
      completedTopicIds: ['python-l001', 'python-l002', 'python-l003'],
      dailyMinutes: 90,
    };

    const missions = generateDailyMissions(roadmap, userProgress, 90);

    expect(missions.length).toBeGreaterThan(0);
    expect(missions[0]).toMatchObject({ status: 'pending' });
    expect(Array.isArray(missions[0].successCriteria)).toBe(true);
    expect(missions.some((mission) => mission.missionType === 'daily-loop-anchor')).toBe(true);
  });

  test('creates level-focused mission mix in level mode', () => {
    const roadmap = buildRoadmap();
    const userProgress = {
      skillId: 'python',
      goalMode: 'level',
      completedTopicIds: ['python-l001'],
      dailyMinutes: 75,
    };

    const missions = generateDailyMissions(roadmap, userProgress, 75);
    const missionTypes = missions.map((mission) => mission.missionType);

    expect(missionTypes).toContain('milestone-push');
    expect(missionTypes).toContain('level-checkpoint');
    expect(missionTypes).not.toContain('daily-loop-anchor');
  });

  test('creates repeatable daily loop mission mix in daily mode', () => {
    const roadmap = buildRoadmap();
    const userProgress = {
      skillId: 'python',
      goalMode: 'daily',
      completedTopicIds: ['python-l001'],
      dailyMinutes: 60,
    };

    const missions = generateDailyMissions(roadmap, userProgress, 60);
    const missionTypes = missions.map((mission) => mission.missionType);

    expect(missionTypes).toContain('daily-foundation');
    expect(missionTypes).toContain('daily-practice');
    expect(missionTypes).toContain('daily-review');
  });

  test('does not output generic mission titles', () => {
    const roadmap = buildRoadmap();
    const userProgress = {
      skillId: 'python',
      goalMode: 'hybrid',
      completedTopicIds: [],
      dailyMinutes: 80,
    };

    const missions = generateDailyMissions(roadmap, userProgress, 80);
    const genericPattern = /^level\s+\d+$/i;

    expect(missions.every((mission) => !genericPattern.test((mission.title || '').trim()))).toBe(true);
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

  test('still creates daily gym missions even when all gym levels are completed', () => {
    const gymRoadmap = {
      skillId: 'gym',
      tracks: [
        {
          topics: Array.from({ length: 5 }, (_, index) => ({
            topicId: `gym-l${String(index + 1).padStart(3, '0')}`,
            title: `Gym Level ${index + 1}`,
            difficulty: 'medium',
            estimatedMinutes: 25,
          })),
        },
      ],
    };

    const progress = {
      skillId: 'gym',
      goalMode: 'daily',
      completedTopicIds: ['gym-l001', 'gym-l002', 'gym-l003', 'gym-l004', 'gym-l005'],
      dailyMinutes: 45,
    };

    const missions = generateDailyMissions(gymRoadmap, progress, 45);

    expect(missions.length).toBeGreaterThan(0);
    expect(missions.some((mission) => mission.missionType === 'strength-block')).toBe(true);
  });

  test.todo('Coming soon: generate skill-specific challenge templates per roadmap category');
});
