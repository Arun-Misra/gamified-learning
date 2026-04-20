import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const currentFile = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFile);
const rootDir = resolve(currentDir, '..');

const parseEnvFile = (filePath) => {
  if (!existsSync(filePath)) {
    return {};
  }

  return readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .reduce((accumulator, line) => {
      const separatorIndex = line.indexOf('=');
      if (separatorIndex === -1) {
        return accumulator;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim().replace(/^"|"$/g, '');
      accumulator[key] = value;
      return accumulator;
    }, {});
};

const envFromFiles = {
  ...parseEnvFile(resolve(rootDir, '.env')),
  ...parseEnvFile(resolve(rootDir, '.env.local')),
};

const supabaseUrl = process.env.SUPABASE_URL || envFromFiles.SUPABASE_URL || envFromFiles.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  envFromFiles.SUPABASE_SERVICE_ROLE_KEY ||
  envFromFiles.SUPABASE_ANON_KEY;

const pythonTopicNames = [
  'Syntax and Variables',
  'Conditionals and Logic',
  'Loops and Iteration',
  'Functions and Scope',
  'Data Structures',
  'File Handling',
  'Error Handling',
  'Object-Oriented Design',
  'Testing and Debugging',
  'Applied Mini Project',
];

const dsaTopicNames = [
  'Arrays and Strings',
  'Two Pointers and Sliding Window',
  'Stacks and Queues',
  'Linked Lists',
  'Hashing Patterns',
  'Trees and Traversals',
  'Graph Fundamentals',
  'Recursion and Backtracking',
  'Dynamic Programming',
  'Greedy and Advanced Challenges',
];

const getDifficultyForLevel = (level) => {
  if (level <= 30) return 'easy';
  if (level <= 70) return 'medium';
  return 'hard';
};

const getEstimatedMinutes = (level, skill) => {
  if (skill === 'python') {
    if (level <= 30) return 20 + ((level - 1) % 3) * 5;
    if (level <= 70) return 30 + ((level - 1) % 4) * 5;
    return 45 + ((level - 1) % 4) * 5;
  }

  if (level <= 30) return 25 + ((level - 1) % 3) * 5;
  if (level <= 70) return 35 + ((level - 1) % 4) * 5;
  return 50 + ((level - 1) % 4) * 5;
};

const createTracks = (skill, names) =>
  Array.from({ length: 10 }, (_, trackIndex) => {
    const trackNo = trackIndex + 1;
    const start = trackIndex * 10 + 1;
    const end = trackNo * 10;

    return {
      trackId: `${skill}-track-${trackNo}`,
      title: `${skill.toUpperCase()} Levels ${start}-${end}`,
      topics: Array.from({ length: 10 }, (_, offset) => {
        const level = start + offset;
        return {
          topicId: `${skill}-l${String(level).padStart(3, '0')}`,
          title: `${skill.toUpperCase()} Level ${level}: ${names[(level - 1) % names.length]}`,
          difficulty: getDifficultyForLevel(level),
          estimatedMinutes: getEstimatedMinutes(level, skill),
        };
      }),
    };
  });

const roadmaps = [
  {
    id: 'python',
    skill_id: 'python',
    category: 'Study',
    name: 'Python Programming',
    version: 2,
    tracks: createTracks('python', pythonTopicNames),
  },
  {
    id: 'dsa',
    skill_id: 'dsa',
    category: 'Study',
    name: 'Data Structures & Algorithms',
    version: 2,
    tracks: createTracks('dsa', dsaTopicNames),
  },
  {
    id: 'gym',
    skill_id: 'gym',
    category: 'Health',
    name: 'Gym Fitness',
    version: 1,
    tracks: [
      {
        trackId: 'basics',
        title: 'Fitness Basics',
        topics: [
          { topicId: 'gym-warmup', title: 'Warm-up Routines', difficulty: 'easy', estimatedMinutes: 10 },
          { topicId: 'gym-cardio', title: 'Cardio Training', difficulty: 'medium', estimatedMinutes: 30 },
          { topicId: 'gym-strength', title: 'Strength Training', difficulty: 'hard', estimatedMinutes: 45 },
        ],
      },
    ],
  },
];

export const seedRoadmaps = async () => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, or VITE_SUPABASE_URL and SUPABASE_ANON_KEY for a permissive setup.'
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { error } = await supabase.from('roadmaps').upsert(roadmaps, { onConflict: 'id' });

  if (error) {
    throw error;
  }

  console.log('Seeded roadmaps for python, dsa, and gym.');
};

const isDirectExecution = process.argv[1]
  ? pathToFileURL(resolve(process.argv[1])).href === import.meta.url
  : false;

if (isDirectExecution) {
  seedRoadmaps().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
