create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text unique,
  photo_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  last_login_at timestamptz not null default timezone('utc', now())
);

create table if not exists roadmaps (
  id text primary key,
  skill_id text not null unique,
  category text not null,
  name text not null,
  version integer not null default 1,
  tracks jsonb not null default '[]'::jsonb,
  created_by_user_id uuid references auth.users(id) on delete cascade,
  is_user_generated boolean not null default false,
  source_goal_text text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists user_skills (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  skill_id text not null references roadmaps(skill_id) on delete cascade,
  category text not null,
  goal_type text not null default 'study',
  goal_mode text not null default 'hybrid',
  goal_config jsonb not null default '{}'::jsonb,
  adaptation_state jsonb not null default '{"adjustment":1.0,"lastEvaluation":null}'::jsonb,
  daily_minutes integer not null default 30,
  current_topic_ids text[] not null default '{}'::text[],
  completed_topic_ids text[] not null default '{}'::text[],
  xp integer not null default 0,
  level integer not null default 1,
  streak_count integer not null default 0,
  last_active_date date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, skill_id)
);

create table if not exists missions (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  skill_id text not null references roadmaps(skill_id) on delete cascade,
  date_key date not null,
  roadmap_version integer not null default 1,
  generated_at timestamptz not null default timezone('utc', now()),
  items jsonb not null default '[]'::jsonb,
  status_summary jsonb not null default '{"total":0,"completed":0}'::jsonb,
  unique (user_id, skill_id, date_key)
);

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  skill_id text not null,
  mission_id text,
  topic_id text,
  action text not null,
  xp_awarded integer not null default 0,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

alter table roadmaps add column if not exists created_by_user_id uuid references auth.users(id) on delete cascade;
alter table roadmaps add column if not exists is_user_generated boolean not null default false;
alter table roadmaps add column if not exists source_goal_text text;

alter table user_skills add column if not exists goal_type text not null default 'study';
alter table user_skills add column if not exists goal_mode text not null default 'hybrid';
alter table user_skills add column if not exists goal_config jsonb not null default '{}'::jsonb;
alter table user_skills add column if not exists adaptation_state jsonb not null default '{"adjustment":1.0,"lastEvaluation":null}'::jsonb;

alter table profiles enable row level security;
alter table roadmaps enable row level security;
alter table user_skills enable row level security;
alter table missions enable row level security;
alter table activities enable row level security;

create policy "profiles_select_own"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "roadmaps_select_authenticated"
  on roadmaps for select
  to authenticated
  using (true);

create policy "user_skills_select_own"
  on user_skills for select
  using (auth.uid() = user_id);

create policy "user_skills_insert_own"
  on user_skills for insert
  with check (auth.uid() = user_id);

create policy "user_skills_update_own"
  on user_skills for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "missions_select_own"
  on missions for select
  using (auth.uid() = user_id);

create policy "missions_insert_own"
  on missions for insert
  with check (auth.uid() = user_id);

create policy "missions_update_own"
  on missions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "activities_select_own"
  on activities for select
  using (auth.uid() = user_id);

create policy "activities_insert_own"
  on activities for insert
  with check (auth.uid() = user_id);
