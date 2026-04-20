import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(currentDir, '..');
const schemaPath = resolve(rootDir, 'supabase', 'schema.sql');
const seedPath = resolve(rootDir, 'supabase', 'seed.sql');

console.log('Supabase uses SQL schema and RLS policies instead of Firebase rules.');
console.log(`Schema file: ${existsSync(schemaPath) ? schemaPath : 'missing'}`);
console.log(`Seed file: ${existsSync(seedPath) ? seedPath : 'missing'}`);
console.log('Deploy by running the SQL in supabase/schema.sql and supabase/seed.sql inside the Supabase SQL editor.');
