import { describe, expect, test } from 'vitest';
import { buildPlannedTracks } from './roadmapService';

describe('buildPlannedTracks', () => {
  test('creates non-generic level journey from goal text', () => {
    const tracks = buildPlannedTracks({
      goalName: 'Crack machine learning interviews',
      goalMode: 'level',
      goalType: 'career',
      knowledgeLevel: 'intermediate',
      sourceGoalText: 'focus on system design, ml theory, and coding rounds',
    });

    expect(tracks.length).toBeGreaterThan(0);
    const topics = tracks.flatMap((track) => track.topics || []);
    expect(topics.length).toBeGreaterThan(20);
    expect(topics.some((topic) => /level\s+\d+/i.test(topic.title))).toBe(false);
    expect(topics[0].title).toMatch(/Foundation|Core Practice|Applied Output|Optimization|Mastery Loop/);
  });

  test('creates daily loop using inferred pillars', () => {
    const tracks = buildPlannedTracks({
      goalName: 'Become better at guitar solos',
      goalMode: 'daily',
      goalType: 'creative',
      knowledgeLevel: 'beginner',
      sourceGoalText: 'phrasing vibrato speed and improvisation',
    });

    expect(tracks).toHaveLength(1);
    expect(tracks[0].topics).toHaveLength(4);
    expect(tracks[0].topics[0].title).toContain('Daily');
    expect(tracks[0].topics.every((topic) => topic.task && topic.task.length > 20)).toBe(true);
  });
});
