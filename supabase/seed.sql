insert into roadmaps (id, skill_id, category, name, version, tracks)
values
(
  'python',
  'python',
  'Study',
  'Python Programming',
  3,
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
                  'Setup, Interpreter, and Tooling',
                  'Variables, Types, and Casting',
                  'Strings and String Methods',
                  'Lists, Tuples, Sets, Dictionaries',
                  'if/elif/else and boolean logic',
                  'for/while loops and control flow',
                  'Functions and parameters',
                  'Scope, closures, lambda',
                  'File I/O and pathlib',
                  'Exception handling patterns',
                  'Logging and debugging',
                  'Regex and text parsing',
                  'JSON and CSV processing',
                  'Classes and object modeling',
                  'Inheritance and polymorphism',
                  'Decorators and context managers',
                  'Type hints and dataclasses',
                  'Iterators and generators',
                  'unittest and pytest',
                  'CLI apps with argparse/click',
                  'HTTP APIs with requests',
                  'Async/await with aiohttp',
                  'NumPy and vectorization',
                  'Pandas data wrangling',
                  'Matplotlib and Seaborn',
                  'Sorting: Bubble/Selection/Insertion',
                  'Merge Sort implementation',
                  'Quick Sort implementation',
                  'Heap Sort with heapq',
                  'Binary Search patterns',
                  'BFS and DFS in Python',
                  'Dynamic Programming memoization',
                  'Backtracking templates',
                  'Bit manipulation essentials',
                  'Flask API fundamentals',
                  'FastAPI with validation',
                  'SQLAlchemy ORM basics',
                  'Redis caching integration',
                  'Dockerizing Python services',
                  'Capstone implementation and review'
                ])[1 + ((level_no - 1) % 40)]
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
  3,
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
                  'Array traversal and updates',
                  'Prefix sums and range queries',
                  'Two pointers patterns',
                  'Sliding window patterns',
                  'Hash map frequency counting',
                  'Stack-based expression handling',
                  'Monotonic stack patterns',
                  'Queue and deque problems',
                  'Linked list reversal and cycles',
                  'Binary search templates',
                  'Bubble sort implementation',
                  'Selection sort implementation',
                  'Insertion sort implementation',
                  'Merge sort divide-and-conquer',
                  'Quick sort partition strategies',
                  'Heap sort and priority queues',
                  'Counting and radix sort',
                  'Recursion and backtracking basics',
                  'Subsets and permutations',
                  'N-Queens backtracking',
                  'Greedy interval scheduling',
                  'Disjoint interval merge',
                  'Tree DFS traversals',
                  'Tree BFS level order',
                  'BST insert/search/delete',
                  'Trie and prefix matching',
                  'Fenwick tree operations',
                  'Segment tree range queries',
                  'Graph adjacency structures',
                  'BFS shortest path',
                  'DFS connected components',
                  'Topological sorting',
                  'Dijkstra shortest path',
                  'Bellman-Ford shortest path',
                  'Union-Find / DSU',
                  'Kruskal MST',
                  'Prim MST',
                  'Dynamic programming 1D/2D',
                  'Knapsack and LIS',
                  'Capstone mixed interview set'
                ])[1 + ((level_no - 1) % 40)]
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
  'java',
  'java',
  'Study',
  'Java Programming',
  1,
  (
    with java_levels as (
      select array[
        'Install Java & IDE Setup',
        'Hello World',
        'Variables',
        'Data Types',
        'Type Casting',
        'Operators',
        'If-Else',
        'Switch',
        'While Loop',
        'For Loop',
        'Break/Continue',
        'Arrays',
        'Multidimensional Arrays',
        'Strings',
        'String Methods',
        'Methods',
        'Method Parameters',
        'Method Overloading',
        'Recursion',
        'Basic Input (Scanner)',
        'Math Class',
        'Random Numbers',
        'Wrapper Classes',
        'Basic Debugging',
        'Mini Project (Calculator)',
        'Classes & Objects',
        'Constructors',
        'this keyword',
        'Static keyword',
        'Access Modifiers',
        'Encapsulation',
        'Inheritance',
        'Method Overriding',
        'Polymorphism',
        'Abstraction',
        'Interfaces',
        'Multiple Inheritance',
        'Object Class',
        'toString()',
        'equals()',
        'HashCode',
        'Packages',
        'Import',
        'Enums',
        'Annotations',
        'Exception Handling',
        'try-catch-finally',
        'throw/throws',
        'Custom Exceptions',
        'File Handling',
        'File Read/Write',
        'Serialization',
        'Collections Intro',
        'ArrayList',
        'LinkedList',
        'HashMap',
        'HashSet',
        'Iterator',
        'Comparable vs Comparator',
        'Mini Project (Library System)',
        'Generics',
        'Lambda Expressions',
        'Functional Interfaces',
        'Streams API',
        'Optional Class',
        'Multithreading',
        'Thread Lifecycle',
        'Synchronization',
        'Executor Framework',
        'Concurrency',
        'JDBC',
        'MySQL Connection',
        'PreparedStatement',
        'Connection Pooling',
        'Transactions',
        'Maven',
        'Gradle',
        'Logging (Log4j)',
        'Testing (JUnit)',
        'Debugging Advanced',
        'REST APIs',
        'JSON Handling',
        'Spring Core',
        'Spring Boot',
        'Dependency Injection',
        'Hibernate',
        'JPA',
        'Microservices Intro',
        'Docker Basics',
        'CI/CD Basics',
        'Design Patterns',
        'SOLID Principles',
        'Clean Code',
        'System Design Basics',
        'Performance Optimization',
        'Security Basics',
        'Authentication (JWT)',
        'Deployment',
        'Capstone Project (Full App)',
        'Mastery + Portfolio'
      ]::text[] as titles,
      array[
        'https://www.oracle.com/java/technologies/downloads/',
        'https://www.w3schools.com/java/java_intro.asp',
        'https://www.w3schools.com/java/java_variables.asp',
        'https://www.w3schools.com/java/java_data_types.asp',
        'https://www.w3schools.com/java/java_type_casting.asp',
        'https://www.w3schools.com/java/java_operators.asp',
        'https://www.w3schools.com/java/java_conditions.asp',
        'https://www.w3schools.com/java/java_switch.asp',
        'https://www.w3schools.com/java/java_while_loop.asp',
        'https://www.w3schools.com/java/java_for_loop.asp',
        'https://www.w3schools.com/java/java_break.asp',
        'https://www.w3schools.com/java/java_arrays.asp',
        'https://www.w3schools.com/java/java_arrays_multi.asp',
        'https://www.w3schools.com/java/java_strings.asp',
        'https://www.w3schools.com/java/java_ref_string.asp',
        'https://www.w3schools.com/java/java_methods.asp',
        'https://www.w3schools.com/java/java_methods_param.asp',
        'https://www.javatpoint.com/method-overloading-in-java',
        'https://www.javatpoint.com/recursion-in-java',
        'https://www.javatpoint.com/java-scanner',
        'https://www.w3schools.com/java/java_math.asp',
        'https://www.javatpoint.com/java-random',
        'https://www.javatpoint.com/wrapper-class-in-java',
        'https://www.geeksforgeeks.org/debugging-in-java/',
        '',
        'https://www.w3schools.com/java/java_classes.asp',
        'https://www.javatpoint.com/java-constructor',
        'https://www.javatpoint.com/this-keyword',
        'https://www.javatpoint.com/static-keyword-in-java',
        'https://www.javatpoint.com/access-modifiers',
        'https://www.javatpoint.com/encapsulation',
        'https://www.javatpoint.com/inheritance-in-java',
        'https://www.javatpoint.com/method-overriding-in-java',
        'https://www.javatpoint.com/runtime-polymorphism-in-java',
        'https://www.javatpoint.com/abstract-class-in-java',
        'https://www.javatpoint.com/interface-in-java',
        'https://www.javatpoint.com/multiple-inheritance-in-java',
        'https://www.javatpoint.com/object-class',
        'https://www.javatpoint.com/tostring-method',
        'https://www.javatpoint.com/equals-method',
        'https://www.javatpoint.com/hashcode-method',
        'https://www.javatpoint.com/package',
        'https://www.javatpoint.com/import-keyword',
        'https://www.javatpoint.com/java-enum',
        'https://www.javatpoint.com/java-annotation',
        'https://www.javatpoint.com/exception-handling-in-java',
        'https://www.javatpoint.com/try-catch-block',
        'https://www.javatpoint.com/throw-keyword',
        'https://www.javatpoint.com/custom-exception',
        'https://www.javatpoint.com/java-file',
        'https://www.javatpoint.com/java-filewriter',
        'https://www.javatpoint.com/serialization-in-java',
        'https://www.javatpoint.com/collections-in-java',
        'https://www.javatpoint.com/arraylist',
        'https://www.javatpoint.com/java-linkedlist',
        'https://www.javatpoint.com/java-hashmap',
        'https://www.javatpoint.com/java-hashset',
        'https://www.javatpoint.com/java-iterator',
        'https://www.javatpoint.com/difference-between-comparable-and-comparator',
        '',
        'https://www.javatpoint.com/generics-in-java',
        'https://www.javatpoint.com/java-lambda-expressions',
        'https://www.javatpoint.com/java-functional-interface',
        'https://www.javatpoint.com/java-8-stream',
        'https://www.javatpoint.com/java-optional',
        'https://www.javatpoint.com/multithreading-in-java',
        'https://www.javatpoint.com/life-cycle-of-a-thread',
        'https://www.javatpoint.com/synchronization-in-java',
        'https://www.javatpoint.com/java-executor-framework',
        'https://www.javatpoint.com/java-concurrency',
        'https://www.javatpoint.com/java-jdbc',
        'https://www.javatpoint.com/example-to-connect-to-mysql',
        'https://www.javatpoint.com/preparedstatement-interface',
        'https://www.javatpoint.com/connection-pooling',
        'https://www.javatpoint.com/transaction-management',
        'https://www.javatpoint.com/maven-tutorial',
        'https://www.javatpoint.com/gradle-tutorial',
        'https://www.javatpoint.com/log4j',
        'https://www.javatpoint.com/junit-tutorial',
        '',
        'https://www.javatpoint.com/restful-web-services-tutorial',
        'https://www.javatpoint.com/json-in-java',
        'https://www.javatpoint.com/spring-tutorial',
        'https://www.javatpoint.com/spring-boot-tutorial',
        '',
        'https://www.javatpoint.com/hibernate-tutorial',
        'https://www.javatpoint.com/jpa-tutorial',
        '',
        'https://www.javatpoint.com/docker-tutorial',
        '',
        'https://www.javatpoint.com/design-patterns-in-java',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      ]::text[] as urls
    )
    select jsonb_agg(
      jsonb_build_object(
        'trackId', format('java-track-%s', track_no),
        'title', format('JAVA Levels %s-%s', ((track_no - 1) * 10) + 1, track_no * 10),
        'topics', (
          select jsonb_agg(
            jsonb_build_object(
              'topicId', format('java-l%03s', level_no),
              'title', format(
                'JAVA Level %s: %s',
                level_no,
                (select titles[level_no] from java_levels)
              ),
              'difficulty',
              case
                when level_no <= 25 then 'easy'
                when level_no <= 60 then 'medium'
                else 'hard'
              end,
              'estimatedMinutes',
              case
                when level_no <= 25 then 25
                when level_no <= 60 then 35
                else 50
              end,
              'resourceUrl',
              nullif((select urls[level_no] from java_levels), '')
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
  3,
  (
    select jsonb_agg(
      jsonb_build_object(
        'trackId', format('gym-track-%s', track_no),
        'title', format('Gym Levels %s-%s', ((track_no - 1) * 10) + 1, track_no * 10),
        'topics', (
          select jsonb_agg(
            jsonb_build_object(
              'topicId', format('gym-l%03s', level_no),
              'title', format(
                'Gym Level %s: %s',
                level_no,
                (array[
                  'Dynamic warm-up and activation',
                  'Push-day strength fundamentals',
                  'Pull-day strength fundamentals',
                  'Leg-day strength fundamentals',
                  'Core and stability circuit',
                  'Cardio interval conditioning',
                  'Mobility and recovery flow',
                  'Progressive overload tracking',
                  'Technique and tempo control',
                  'Conditioning challenge set'
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
                else 40 + ((level_no - 1) % 4) * 5
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
)
on conflict (id) do update
set
  category = excluded.category,
  name = excluded.name,
  version = excluded.version,
  tracks = excluded.tracks,
  updated_at = timezone('utc', now());
