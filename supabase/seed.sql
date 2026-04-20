insert into roadmaps (id, skill_id, category, name, version, tracks)
values
(
  'python',
  'python',
  'Study',
  'Python Programming',
  2,
  (
    select jsonb_agg(
      jsonb_build_object(
        'trackId', format('python-track-%s', track_no),
        'title', format('Python Levels %s-%s', ((track_no - 1) * 10) + 1, track_no * 10),
        'topics', (
          select jsonb_agg(
            jsonb_build_object(
              'topicId', format('python-l%03s', level_no),
              'title', format(
                'Python Level %s: %s',
                level_no,
                (array[
                  'Syntax and Variables',
                  'Conditionals and Logic',
                  'Loops and Iteration',
                  'Functions and Scope',
                  'Data Structures',
                  'File Handling',
                  'Error Handling',
                  'Object-Oriented Design',
                  'Testing and Debugging',
                  'Applied Mini Project'
                ])[1 + ((level_no - 1) % 10)]
              ),
              'difficulty',
              case
                when level_no <= 30 then 'easy'
                when level_no <= 70 then 'medium'
                else 'hard'
              end,
              'estimatedMinutes',
              case
                when level_no <= 30 then 20 + ((level_no - 1) % 3) * 5
                when level_no <= 70 then 30 + ((level_no - 1) % 4) * 5
                else 45 + ((level_no - 1) % 4) * 5
              end
            )
            order by level_no
          )
          from generate_series(((track_no - 1) * 10) + 1, track_no * 10) as level_no
        )
      )
      order by track_no
    )
    from generate_series(1, 10) as track_no
  )
),
(
  'dsa',
  'dsa',
  'Study',
  'Data Structures & Algorithms',
  2,
  (
    select jsonb_agg(
      jsonb_build_object(
        'trackId', format('dsa-track-%s', track_no),
        'title', format('DSA Levels %s-%s', ((track_no - 1) * 10) + 1, track_no * 10),
        'topics', (
          select jsonb_agg(
            jsonb_build_object(
              'topicId', format('dsa-l%03s', level_no),
              'title', format(
                'DSA Level %s: %s',
                level_no,
                (array[
                  'Arrays and Strings',
                  'Two Pointers and Sliding Window',
                  'Stacks and Queues',
                  'Linked Lists',
                  'Hashing Patterns',
                  'Trees and Traversals',
                  'Graph Fundamentals',
                  'Recursion and Backtracking',
                  'Dynamic Programming',
                  'Greedy and Advanced Challenges'
                ])[1 + ((level_no - 1) % 10)]
              ),
              'difficulty',
              case
                when level_no <= 30 then 'easy'
                when level_no <= 70 then 'medium'
                else 'hard'
              end,
              'estimatedMinutes',
              case
                when level_no <= 30 then 25 + ((level_no - 1) % 3) * 5
                when level_no <= 70 then 35 + ((level_no - 1) % 4) * 5
                else 50 + ((level_no - 1) % 4) * 5
              end
            )
            order by level_no
          )
          from generate_series(((track_no - 1) * 10) + 1, track_no * 10) as level_no
        )
      )
      order by track_no
    )
    from generate_series(1, 10) as track_no
  )
),
(
  'gym',
  'gym',
  'Health',
  'Gym Fitness',
  1,
  '[{"trackId":"basics","title":"Fitness Basics","topics":[{"topicId":"gym-warmup","title":"Warm-up Routines","difficulty":"easy","estimatedMinutes":10},{"topicId":"gym-cardio","title":"Cardio Training","difficulty":"medium","estimatedMinutes":30},{"topicId":"gym-strength","title":"Strength Training","difficulty":"hard","estimatedMinutes":45}]}]'::jsonb
)
on conflict (id) do update
set
  category = excluded.category,
  name = excluded.name,
  version = excluded.version,
  tracks = excluded.tracks,
  updated_at = timezone('utc', now());
