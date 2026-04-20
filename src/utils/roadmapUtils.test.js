import { describe, expect, test } from 'vitest';
import { flattenRoadmapTopics, getLevelXpBonus } from './roadmapUtils';

describe('roadmapUtils', () => {
  test('flattens every topic so all levels remain visible', () => {
    const roadmap = {
      tracks: [
        {
          topics: Array.from({ length: 50 }, (_, index) => ({ topicId: `python-${index + 1}` })),
        },
        {
          topics: Array.from({ length: 50 }, (_, index) => ({ topicId: `python-${index + 51}` })),
        },
      ],
    };

    const topics = flattenRoadmapTopics(roadmap);

    expect(topics).toHaveLength(100);
    expect(topics[0].topicId).toBe('python-1');
    expect(topics[99].topicId).toBe('python-100');
  });

  test('returns a larger XP bonus for higher levels', () => {
    expect(getLevelXpBonus(1)).toBe(4);
    expect(getLevelXpBonus(25)).toBeGreaterThanOrEqual(4);
    expect(getLevelXpBonus(100)).toBeGreaterThan(getLevelXpBonus(1));
  });

  test.todo('Coming soon: add per-skill level badge styling tests');
});
