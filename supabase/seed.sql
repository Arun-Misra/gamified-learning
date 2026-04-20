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
        'What is Java',
        'Install Java (JDK, JVM, JRE)',
        'Hello World Program',
        'Java Syntax',
        'Variables',
        'Data Types',
        'Type Casting',
        'Operators',
        'User Input',
        'If-Else',
        'Switch',
        'Loops (for, while, do-while)',
        'Break & Continue',
        'Methods',
        'Method Parameters',
        'Return Values',
        'Method Overloading',
        'Arrays',
        'Multidimensional Arrays',
        'Basic Practice Problems',
        'Strings Basics',
        'String Methods',
        'StringBuilder',
        'StringBuffer',
        'Wrapper Classes',
        'Math Class',
        'Date & Time',
        'Classes & Objects',
        'Constructors',
        'this keyword',
        'Static keyword',
        'Access Modifiers',
        'Encapsulation',
        'Inheritance',
        'Polymorphism',
        'Abstraction',
        'Interfaces',
        'Packages',
        'Enums',
        'Practice OOP Programs',
        'ArrayList',
        'LinkedList',
        'HashMap',
        'HashSet',
        'TreeMap',
        'TreeSet',
        'Iterators',
        'Comparable vs Comparator',
        'Collections Utility',
        'Stack',
        'Queue',
        'PriorityQueue',
        'File Handling Basics',
        'Reading Files',
        'Writing Files',
        'Exception Handling',
        'Try-Catch',
        'Throw & Throws',
        'Custom Exceptions',
        'Mini Project (File-based app)',
        'Multithreading Basics',
        'Thread Lifecycle',
        'Runnable vs Thread',
        'Synchronization',
        'Deadlocks',
        'Java Streams',
        'Lambda Expressions',
        'Functional Interfaces',
        'Optional Class',
        'Java 8 Features',
        'Serialization',
        'Networking Basics',
        'Sockets',
        'JDBC Basics',
        'Connect to Database',
        'CRUD using JDBC',
        'Reflection API',
        'Annotations',
        'Logging',
        'Build CLI App',
        'Design Patterns (Singleton, Factory)',
        'MVC Architecture',
        'REST API Basics',
        'Spring Boot Intro',
        'Build REST API',
        'Dependency Injection',
        'Hibernate Basics',
        'ORM Concepts',
        'Security Basics',
        'JWT Authentication',
        'Microservices Intro',
        'Docker Basics',
        'Testing (JUnit)',
        'Mocking',
        'Performance Optimization',
        'Memory Management',
        'JVM Internals',
        'Build Full Backend Project',
        'Deploy Project',
        'System Design Basics'
      ]::text[] as titles
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
              'task',
              format('Study %s, then implement one small Java program to practice it.', (select titles[level_no] from java_levels)),
              'resourceUrl',
              case
                when level_no = 1 then 'https://www.geeksforgeeks.org/java/java-programming-language/'
                when level_no = 2 then 'https://www.geeksforgeeks.org/java/how-to-install-java-on-windows/'
                when level_no = 3 then 'https://www.w3schools.com/java/java_intro.asp'
                when level_no = 4 then 'https://www.w3schools.com/java/java_syntax.asp'
                when level_no = 5 then 'https://www.w3schools.com/java/java_variables.asp'
                when level_no = 6 then 'https://www.w3schools.com/java/java_data_types.asp'
                when level_no = 7 then 'https://www.w3schools.com/java/java_type_casting.asp'
                when level_no = 8 then 'https://www.w3schools.com/java/java_operators.asp'
                when level_no = 9 then 'https://www.w3schools.com/java/java_user_input.asp'
                when level_no = 10 then 'https://www.w3schools.com/java/java_conditions.asp'
                when level_no = 11 then 'https://www.w3schools.com/java/java_switch.asp'
                when level_no = 12 then 'https://www.w3schools.com/java/java_while_loop.asp'
                when level_no = 13 then 'https://www.w3schools.com/java/java_break.asp'
                when level_no = 14 then 'https://www.w3schools.com/java/java_methods.asp'
                when level_no = 15 then 'https://www.w3schools.com/java/java_methods_param.asp'
                when level_no = 16 then 'https://www.w3schools.com/java/java_methods_return.asp'
                when level_no = 17 then 'https://www.geeksforgeeks.org/java/method-overloading-in-java/'
                when level_no = 18 then 'https://www.w3schools.com/java/java_arrays.asp'
                when level_no = 19 then 'https://www.w3schools.com/java/java_arrays_multi.asp'
                when level_no = 20 then 'https://www.geeksforgeeks.org/java/java-programming-examples/'
                when level_no = 21 then 'https://www.w3schools.com/java/java_strings.asp'
                when level_no = 22 then 'https://www.w3schools.com/java/java_strings_methods.asp'
                when level_no = 23 then 'https://www.geeksforgeeks.org/java/stringbuilder-class-in-java-with-examples/'
                when level_no = 24 then 'https://www.geeksforgeeks.org/java/stringbuffer-class-in-java/'
                when level_no = 25 then 'https://www.geeksforgeeks.org/java/wrapper-classes-java/'
                when level_no = 26 then 'https://www.w3schools.com/java/java_math.asp'
                when level_no = 27 then 'https://www.geeksforgeeks.org/java/date-class-java-examples/'
                when level_no = 28 then 'https://www.w3schools.com/java/java_classes.asp'
                when level_no = 29 then 'https://www.w3schools.com/java/java_constructors.asp'
                when level_no = 30 then 'https://www.geeksforgeeks.org/java/this-reference-in-java/'
                when level_no = 31 then 'https://www.w3schools.com/java/java_class_attributes.asp'
                when level_no = 32 then 'https://www.w3schools.com/java/java_modifiers.asp'
                when level_no = 33 then 'https://www.geeksforgeeks.org/java/encapsulation-in-java/'
                when level_no = 34 then 'https://www.w3schools.com/java/java_inheritance.asp'
                when level_no = 35 then 'https://www.w3schools.com/java/java_polymorphism.asp'
                when level_no = 36 then 'https://www.w3schools.com/java/java_abstract.asp'
                when level_no = 37 then 'https://www.w3schools.com/java/java_interface.asp'
                when level_no = 38 then 'https://www.w3schools.com/java/java_packages.asp'
                when level_no = 39 then 'https://www.w3schools.com/java/java_enums.asp'
                when level_no = 40 then 'https://www.geeksforgeeks.org/java/object-oriented-programming-oops-concept-in-java/'
                when level_no = 41 then 'https://www.w3schools.com/java/java_arraylist.asp'
                when level_no = 42 then 'https://www.w3schools.com/java/java_linkedlist.asp'
                when level_no = 43 then 'https://www.w3schools.com/java/java_hashmap.asp'
                when level_no = 44 then 'https://www.w3schools.com/java/java_hashset.asp'
                when level_no = 45 then 'https://www.geeksforgeeks.org/java/treemap-in-java-with-examples/'
                when level_no = 46 then 'https://www.geeksforgeeks.org/java/treeset-in-java-with-examples/'
                when level_no = 47 then 'https://www.geeksforgeeks.org/java/iterators-in-java/'
                when level_no = 48 then 'https://www.geeksforgeeks.org/java/comparable-vs-comparator-in-java/'
                when level_no = 49 then 'https://www.geeksforgeeks.org/java/collections-class-in-java/'
                when level_no = 50 then 'https://www.geeksforgeeks.org/stack-class-in-java/'
                when level_no = 51 then 'https://www.geeksforgeeks.org/queue-interface-java/'
                when level_no = 52 then 'https://www.geeksforgeeks.org/priorityqueue-class-in-java-2/'
                when level_no = 53 then 'https://www.w3schools.com/java/java_files.asp'
                when level_no = 54 then 'https://www.w3schools.com/java/java_files_read.asp'
                when level_no = 55 then 'https://www.w3schools.com/java/java_files_create.asp'
                when level_no = 56 then 'https://www.w3schools.com/java/java_try_catch.asp'
                when level_no = 57 then 'https://www.w3schools.com/java/java_try_catch.asp'
                when level_no = 58 then 'https://www.geeksforgeeks.org/java/throw-throws-java/'
                when level_no = 59 then 'https://www.geeksforgeeks.org/user-defined-custom-exception-in-java/'
                when level_no = 60 then 'https://www.geeksforgeeks.org/java/file-handling-in-java/'
                when level_no = 61 then 'https://www.geeksforgeeks.org/java/multithreading-in-java/'
                when level_no = 62 then 'https://www.geeksforgeeks.org/java/lifecycle-and-states-of-a-thread-in-java/'
                when level_no = 63 then 'https://www.geeksforgeeks.org/java/difference-between-thread-and-runnable-in-java/'
                when level_no = 64 then 'https://www.geeksforgeeks.org/java/synchronization-in-java/'
                when level_no = 65 then 'https://www.geeksforgeeks.org/deadlock-in-java-multithreading/'
                when level_no = 66 then 'https://www.geeksforgeeks.org/stream-in-java/'
                when level_no = 67 then 'https://www.geeksforgeeks.org/java/lambda-expressions-java-8/'
                when level_no = 68 then 'https://www.geeksforgeeks.org/functional-interfaces-java/'
                when level_no = 69 then 'https://www.geeksforgeeks.org/java-8-optional-class/'
                when level_no = 70 then 'https://www.geeksforgeeks.org/java/java-8-features/'
                when level_no = 71 then 'https://www.geeksforgeeks.org/serialization-in-java/'
                when level_no = 72 then 'https://www.geeksforgeeks.org/computer-networks/networking-in-java/'
                when level_no = 73 then 'https://www.geeksforgeeks.org/computer-networks/socket-programming-in-java/'
                when level_no = 74 then 'https://www.geeksforgeeks.org/introduction-to-jdbc/'
                when level_no = 75 then 'https://www.geeksforgeeks.org/java/how-to-connect-java-application-with-mysql-database/'
                when level_no = 76 then 'https://www.geeksforgeeks.org/java/crud-operations-using-jdbc/'
                when level_no = 77 then 'https://www.geeksforgeeks.org/java/reflection-in-java/'
                when level_no = 78 then 'https://www.geeksforgeeks.org/java/annotations-in-java/'
                when level_no = 79 then 'https://www.geeksforgeeks.org/java/logger-in-java-logging-example/'
                when level_no = 80 then 'https://www.geeksforgeeks.org/command-line-arguments-in-java/'
                when level_no = 81 then 'https://www.geeksforgeeks.org/system-design/singleton-class-java/'
                when level_no = 82 then 'https://www.geeksforgeeks.org/software-engineering/mvc-design-pattern/'
                when level_no = 83 then 'https://www.geeksforgeeks.org/rest-api-introduction/'
                when level_no = 84 then 'https://www.geeksforgeeks.org/java/spring-boot/'
                when level_no = 85 then 'https://www.geeksforgeeks.org/java/spring-boot-rest-api/'
                when level_no = 86 then 'https://www.geeksforgeeks.org/spring-dependency-injection-with-example/'
                when level_no = 87 then 'https://www.geeksforgeeks.org/java/hibernate-tutorial/'
                when level_no = 88 then 'https://www.geeksforgeeks.org/spring-data-jpa-with-spring-boot/'
                when level_no = 89 then 'https://www.geeksforgeeks.org/security-in-java/'
                when level_no = 90 then 'https://www.geeksforgeeks.org/java/jwt-authentication-with-spring-boot/'
                when level_no = 91 then 'https://www.geeksforgeeks.org/microservices-introduction/'
                when level_no = 92 then 'https://www.geeksforgeeks.org/devops/docker-tutorial/'
                when level_no = 93 then 'https://www.geeksforgeeks.org/software-testing/junit-tutorial/'
                when level_no = 94 then 'https://www.geeksforgeeks.org/software-testing/mockito-tutorial/'
                when level_no = 95 then 'https://www.geeksforgeeks.org/java/java-performance-tuning-tips/'
                when level_no = 96 then 'https://www.geeksforgeeks.org/java/memory-management-in-java/'
                when level_no = 97 then 'https://www.geeksforgeeks.org/java/jvm-works-jvm-architecture/'
                when level_no = 98 then 'https://www.geeksforgeeks.org/full-stack-development/java-backend-roadmap/'
                when level_no = 99 then 'https://www.geeksforgeeks.org/devops/deploy-spring-boot-application/'
                when level_no = 100 then 'https://www.geeksforgeeks.org/system-design/system-design-tutorial/'
                when level_no <= 60 then 'https://www.w3schools.com/java/default.asp'
                else 'https://www.geeksforgeeks.org/java/'
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
