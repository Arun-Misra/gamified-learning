import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { seedRoadmaps } from './seed-roadmaps.js';

const currentDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(currentDir, '..');

const schemaPath = resolve(rootDir, 'supabase', 'schema.sql');
const seedPath = resolve(rootDir, 'supabase', 'seed.sql');

const run = async () => {
  console.log('Checking Supabase setup files...');
  console.log(`Schema file: ${existsSync(schemaPath) ? 'found' : 'missing'}`);
  console.log(`Seed file: ${existsSync(seedPath) ? 'found' : 'missing'}`);

  if (existsSync(schemaPath)) {
    console.log('Apply supabase/schema.sql in the Supabase SQL editor first.');
  }

  await seedRoadmaps();
};

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
