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

const pythonLevelTopics = [
  'Python Setup, Interpreter, and Tooling',
  'Print, Input, and Basic Program Flow',
  'Variables, Types, and Casting',
  'Numbers, Arithmetic, and Operators',
  'Strings and String Methods',
  'String Slicing and Formatting',
  'Lists: Creation and Access',
  'List Methods and Mutability',
  'Tuples, Sets, and Frozen Sets',
  'Dictionaries and Hashing Basics',
  'if/elif/else Decision Logic',
  'Boolean Algebra and Truthy Values',
  'for Loops and range',
  'while Loops and Sentinel Patterns',
  'break, continue, and loop control',
  'List/Set/Dict Comprehensions',
  'Functions: def, return, and docstrings',
  'Parameters, *args, and **kwargs',
  'Scope, LEGB rule, and closures',
  'Lambda, map, filter, and reduce',
  'Modules, imports, and package layout',
  'pip, virtualenv, and dependency hygiene',
  'File I/O with open and context managers',
  'pathlib and filesystem operations',
  'try/except/finally and exception chaining',
  'Custom exception classes',
  'Logging levels and structured logs',
  'datetime and timezone-safe operations',
  'Regex fundamentals with re',
  'JSON and CSV parsing/writing',
  'Classes, objects, and instance state',
  '__init__, classmethods, and staticmethods',
  'Inheritance and method resolution order',
  'Polymorphism and duck typing',
  'Dunder methods and operator overloading',
  'dataclasses and immutability patterns',
  'Type hints and mypy-friendly code',
  'Iterators, iterable protocol, and yield',
  'Decorators and function wrappers',
  'Context managers with __enter__/__exit__',
  'SQLite CRUD with sqlite3',
  'HTTP APIs with requests',
  'Async/await fundamentals',
  'unittest and test case structure',
  'pytest fixtures and parametrization',
  'Mocking and test doubles',
  'Packaging and pyproject basics',
  'argparse CLI tools',
  'click-based production CLIs',
  'Project architecture and folder conventions',
  'NumPy arrays and vectorized math',
  'Pandas Series and DataFrame basics',
  'Pandas filtering and column transforms',
  'Pandas groupby, joins, and pivots',
  'Data visualization with Matplotlib',
  'Seaborn statistical plots',
  'Jupyter notebooks for reproducible analysis',
  'Big-O analysis in Python',
  'Recursion templates and trace debugging',
  'Sorting in Python: Bubble/Selection/Insertion',
  'Merge Sort implementation and analysis',
  'Quick Sort partitioning strategies',
  'Heap Sort with heapq',
  'Binary Search and boundary conditions',
  'Hash maps and collision intuition',
  'Stacks, queues, and deque patterns',
  'Linked list implementation in Python',
  'Binary tree node modeling',
  'Graph representations: adjacency list/matrix',
  'BFS and DFS traversals',
  'Dynamic programming with memoization',
  'Backtracking: permutations and combinations',
  'Greedy interval scheduling',
  'Bit manipulation essentials',
  'Threading basics and GIL awareness',
  'Multiprocessing for CPU-bound workloads',
  'Async HTTP with aiohttp',
  'Caching with functools.lru_cache',
  'Profiling with cProfile and pstats',
  'Performance tuning and vectorization',
  'Web scraping with BeautifulSoup',
  'Browser automation with Selenium',
  'Flask REST API fundamentals',
  'FastAPI routes and validation',
  'JWT authentication flow',
  'SQLAlchemy ORM relationships',
  'PostgreSQL integration patterns',
  'Redis caching and TTL strategies',
  'Dockerizing Python applications',
  'CI/CD checks for Python projects',
  'Design patterns: Strategy and Factory',
  'Clean architecture in Python services',
  'Testing pyramid and coverage strategy',
  'Observability: logs, metrics, tracing',
  'Security: input validation and sanitization',
  'Retries, backoff, and resilience patterns',
  'Task queues with Celery and workers',
  'Capstone: data pipeline project',
  'Capstone: backend service project',
  'Capstone: system design and review',
];

const dsaLevelTopics = [
  'Arrays: indexing, traversal, and updates',
  'Strings: immutable operations and patterns',
  'Time/space complexity fundamentals',
  'Prefix sums and difference arrays',
  'Two pointers: opposite direction',
  'Two pointers: fast/slow runner',
  'Sliding window: fixed size',
  'Sliding window: variable size',
  'Hash map counting patterns',
  'Hash set deduplication patterns',
  'Stack basics and expression evaluation',
  'Monotonic stack: next greater element',
  'Queue basics and simulation',
  'Deque and monotonic queue',
  'Linked list fundamentals',
  'Reverse linked list variants',
  'Cycle detection (Floyd)',
  'Merge two sorted linked lists',
  'Binary search on sorted arrays',
  'Binary search on answer space',
  'Sorting overview and stability',
  'Bubble sort implementation',
  'Selection sort implementation',
  'Insertion sort implementation',
  'Merge sort divide and conquer',
  'Quick sort and partition schemes',
  'Heap sort with binary heap',
  'Counting sort and radix sort',
  'Comparator design and custom sorting',
  'Top-K via sorting and heap',
  'Recursion fundamentals and call stack',
  'Backtracking: subsets generation',
  'Backtracking: permutations generation',
  'Backtracking: N-Queens',
  'Greedy basics and proof intuition',
  'Interval scheduling greedy',
  'Activity selection and compatibility',
  'Disjoint intervals and merging',
  'Line sweep event processing',
  'Bit manipulation tricks',
  'Binary tree traversal: preorder/inorder/postorder',
  'Tree traversal: iterative with stack',
  'Level-order traversal (BFS on trees)',
  'Tree height, diameter, and balance',
  'Lowest common ancestor (LCA)',
  'Binary search tree operations',
  'Trie data structure and prefix search',
  'Segment tree range queries',
  'Fenwick tree (Binary Indexed Tree)',
  'Sparse table and RMQ',
  'Graph representation techniques',
  'BFS shortest path in unweighted graphs',
  'DFS connected components',
  'Topological sort (Kahn and DFS)',
  'Cycle detection in directed graphs',
  'Dijkstra shortest path',
  'Bellman-Ford and negative edges',
  'Floyd-Warshall all-pairs shortest path',
  'Minimum spanning tree: Kruskal',
  'Minimum spanning tree: Prim',
  'Union-Find / Disjoint Set Union',
  'Strongly connected components',
  'Bridges and articulation points',
  'Eulerian path and circuit basics',
  'Maximum flow (Edmonds-Karp intro)',
  'Bipartite graph checks and coloring',
  'Matching basics in bipartite graphs',
  'Dynamic programming: 1D state design',
  'Dynamic programming: 2D state design',
  'Knapsack 0/1 and variants',
  'Longest increasing subsequence',
  'Longest common subsequence',
  'Edit distance DP',
  'Grid DP and path counting',
  'Digit DP introduction',
  'Tree DP basics',
  'Bitmask DP for subsets',
  'Advanced binary search patterns',
  'Divide and conquer optimization idea',
  'Mo\'s algorithm basics',
  'Heavy-Light Decomposition intro',
  'Suffix array basics',
  'KMP string matching',
  'Rabin-Karp rolling hash',
  'Z-algorithm for pattern matching',
  'Manacher palindrome algorithm intro',
  'Geometry: orientation and line intersection',
  'Convex hull basics',
  'Sweep line for overlapping intervals',
  'Randomized algorithms basics',
  'Amortized analysis patterns',
  'Caching and memoization tradeoffs',
  'Concurrency-safe data structure basics',
  'Problem decomposition framework',
  'Contest-style implementation discipline',
  'Debugging WA/TLE/MLE systematically',
  'Interview pattern synthesis',
  'Capstone: mixed-topic problem set',
  'Capstone: graph + DP challenge',
  'Capstone: full mock interview',
  'Capstone: final revision roadmap',
];

const gymTopicNames = [
  'Dynamic warm-up and activation flow',
  'Push day fundamentals',
  'Pull day fundamentals',
  'Leg day fundamentals',
  'Core and stability training',
  'Cardio intervals and pacing',
  'Mobility and recovery protocol',
  'Progressive overload tracking',
  'Technique and tempo mastery',
  'Conditioning circuit challenge',
];

const javaLevelEntries = [
  { title: 'Install Java & IDE Setup', resourceUrl: 'https://www.oracle.com/java/technologies/downloads/' },
  { title: 'Hello World', resourceUrl: 'https://www.w3schools.com/java/java_intro.asp' },
  { title: 'Variables', resourceUrl: 'https://www.w3schools.com/java/java_variables.asp' },
  { title: 'Data Types', resourceUrl: 'https://www.w3schools.com/java/java_data_types.asp' },
  { title: 'Type Casting', resourceUrl: 'https://www.w3schools.com/java/java_type_casting.asp' },
  { title: 'Operators', resourceUrl: 'https://www.w3schools.com/java/java_operators.asp' },
  { title: 'If-Else', resourceUrl: 'https://www.w3schools.com/java/java_conditions.asp' },
  { title: 'Switch', resourceUrl: 'https://www.w3schools.com/java/java_switch.asp' },
  { title: 'While Loop', resourceUrl: 'https://www.w3schools.com/java/java_while_loop.asp' },
  { title: 'For Loop', resourceUrl: 'https://www.w3schools.com/java/java_for_loop.asp' },
  { title: 'Break/Continue', resourceUrl: 'https://www.w3schools.com/java/java_break.asp' },
  { title: 'Arrays', resourceUrl: 'https://www.w3schools.com/java/java_arrays.asp' },
  { title: 'Multidimensional Arrays', resourceUrl: 'https://www.w3schools.com/java/java_arrays_multi.asp' },
  { title: 'Strings', resourceUrl: 'https://www.w3schools.com/java/java_strings.asp' },
  { title: 'String Methods', resourceUrl: 'https://www.w3schools.com/java/java_ref_string.asp' },
  { title: 'Methods', resourceUrl: 'https://www.w3schools.com/java/java_methods.asp' },
  { title: 'Method Parameters', resourceUrl: 'https://www.w3schools.com/java/java_methods_param.asp' },
  { title: 'Method Overloading', resourceUrl: 'https://www.javatpoint.com/method-overloading-in-java' },
  { title: 'Recursion', resourceUrl: 'https://www.javatpoint.com/recursion-in-java' },
  { title: 'Basic Input (Scanner)', resourceUrl: 'https://www.javatpoint.com/java-scanner' },
  { title: 'Math Class', resourceUrl: 'https://www.w3schools.com/java/java_math.asp' },
  { title: 'Random Numbers', resourceUrl: 'https://www.javatpoint.com/java-random' },
  { title: 'Wrapper Classes', resourceUrl: 'https://www.javatpoint.com/wrapper-class-in-java' },
  { title: 'Basic Debugging', resourceUrl: 'https://www.geeksforgeeks.org/debugging-in-java/' },
  { title: 'Mini Project (Calculator)', resourceUrl: '' },
  { title: 'Classes & Objects', resourceUrl: 'https://www.w3schools.com/java/java_classes.asp' },
  { title: 'Constructors', resourceUrl: 'https://www.javatpoint.com/java-constructor' },
  { title: 'this keyword', resourceUrl: 'https://www.javatpoint.com/this-keyword' },
  { title: 'Static keyword', resourceUrl: 'https://www.javatpoint.com/static-keyword-in-java' },
  { title: 'Access Modifiers', resourceUrl: 'https://www.javatpoint.com/access-modifiers' },
  { title: 'Encapsulation', resourceUrl: 'https://www.javatpoint.com/encapsulation' },
  { title: 'Inheritance', resourceUrl: 'https://www.javatpoint.com/inheritance-in-java' },
  { title: 'Method Overriding', resourceUrl: 'https://www.javatpoint.com/method-overriding-in-java' },
  { title: 'Polymorphism', resourceUrl: 'https://www.javatpoint.com/runtime-polymorphism-in-java' },
  { title: 'Abstraction', resourceUrl: 'https://www.javatpoint.com/abstract-class-in-java' },
  { title: 'Interfaces', resourceUrl: 'https://www.javatpoint.com/interface-in-java' },
  { title: 'Multiple Inheritance', resourceUrl: 'https://www.javatpoint.com/multiple-inheritance-in-java' },
  { title: 'Object Class', resourceUrl: 'https://www.javatpoint.com/object-class' },
  { title: 'toString()', resourceUrl: 'https://www.javatpoint.com/tostring-method' },
  { title: 'equals()', resourceUrl: 'https://www.javatpoint.com/equals-method' },
  { title: 'HashCode', resourceUrl: 'https://www.javatpoint.com/hashcode-method' },
  { title: 'Packages', resourceUrl: 'https://www.javatpoint.com/package' },
  { title: 'Import', resourceUrl: 'https://www.javatpoint.com/import-keyword' },
  { title: 'Enums', resourceUrl: 'https://www.javatpoint.com/java-enum' },
  { title: 'Annotations', resourceUrl: 'https://www.javatpoint.com/java-annotation' },
  { title: 'Exception Handling', resourceUrl: 'https://www.javatpoint.com/exception-handling-in-java' },
  { title: 'try-catch-finally', resourceUrl: 'https://www.javatpoint.com/try-catch-block' },
  { title: 'throw/throws', resourceUrl: 'https://www.javatpoint.com/throw-keyword' },
  { title: 'Custom Exceptions', resourceUrl: 'https://www.javatpoint.com/custom-exception' },
  { title: 'File Handling', resourceUrl: 'https://www.javatpoint.com/java-file' },
  { title: 'File Read/Write', resourceUrl: 'https://www.javatpoint.com/java-filewriter' },
  { title: 'Serialization', resourceUrl: 'https://www.javatpoint.com/serialization-in-java' },
  { title: 'Collections Intro', resourceUrl: 'https://www.javatpoint.com/collections-in-java' },
  { title: 'ArrayList', resourceUrl: 'https://www.javatpoint.com/arraylist' },
  { title: 'LinkedList', resourceUrl: 'https://www.javatpoint.com/java-linkedlist' },
  { title: 'HashMap', resourceUrl: 'https://www.javatpoint.com/java-hashmap' },
  { title: 'HashSet', resourceUrl: 'https://www.javatpoint.com/java-hashset' },
  { title: 'Iterator', resourceUrl: 'https://www.javatpoint.com/java-iterator' },
  { title: 'Comparable vs Comparator', resourceUrl: 'https://www.javatpoint.com/difference-between-comparable-and-comparator' },
  { title: 'Mini Project (Library System)', resourceUrl: '' },
  { title: 'Generics', resourceUrl: 'https://www.javatpoint.com/generics-in-java' },
  { title: 'Lambda Expressions', resourceUrl: 'https://www.javatpoint.com/java-lambda-expressions' },
  { title: 'Functional Interfaces', resourceUrl: 'https://www.javatpoint.com/java-functional-interface' },
  { title: 'Streams API', resourceUrl: 'https://www.javatpoint.com/java-8-stream' },
  { title: 'Optional Class', resourceUrl: 'https://www.javatpoint.com/java-optional' },
  { title: 'Multithreading', resourceUrl: 'https://www.javatpoint.com/multithreading-in-java' },
  { title: 'Thread Lifecycle', resourceUrl: 'https://www.javatpoint.com/life-cycle-of-a-thread' },
  { title: 'Synchronization', resourceUrl: 'https://www.javatpoint.com/synchronization-in-java' },
  { title: 'Executor Framework', resourceUrl: 'https://www.javatpoint.com/java-executor-framework' },
  { title: 'Concurrency', resourceUrl: 'https://www.javatpoint.com/java-concurrency' },
  { title: 'JDBC', resourceUrl: 'https://www.javatpoint.com/java-jdbc' },
  { title: 'MySQL Connection', resourceUrl: 'https://www.javatpoint.com/example-to-connect-to-mysql' },
  { title: 'PreparedStatement', resourceUrl: 'https://www.javatpoint.com/preparedstatement-interface' },
  { title: 'Connection Pooling', resourceUrl: 'https://www.javatpoint.com/connection-pooling' },
  { title: 'Transactions', resourceUrl: 'https://www.javatpoint.com/transaction-management' },
  { title: 'Maven', resourceUrl: 'https://www.javatpoint.com/maven-tutorial' },
  { title: 'Gradle', resourceUrl: 'https://www.javatpoint.com/gradle-tutorial' },
  { title: 'Logging (Log4j)', resourceUrl: 'https://www.javatpoint.com/log4j' },
  { title: 'Testing (JUnit)', resourceUrl: 'https://www.javatpoint.com/junit-tutorial' },
  { title: 'Debugging Advanced', resourceUrl: '' },
  { title: 'REST APIs', resourceUrl: 'https://www.javatpoint.com/restful-web-services-tutorial' },
  { title: 'JSON Handling', resourceUrl: 'https://www.javatpoint.com/json-in-java' },
  { title: 'Spring Core', resourceUrl: 'https://www.javatpoint.com/spring-tutorial' },
  { title: 'Spring Boot', resourceUrl: 'https://www.javatpoint.com/spring-boot-tutorial' },
  { title: 'Dependency Injection', resourceUrl: '' },
  { title: 'Hibernate', resourceUrl: 'https://www.javatpoint.com/hibernate-tutorial' },
  { title: 'JPA', resourceUrl: 'https://www.javatpoint.com/jpa-tutorial' },
  { title: 'Microservices Intro', resourceUrl: '' },
  { title: 'Docker Basics', resourceUrl: 'https://www.javatpoint.com/docker-tutorial' },
  { title: 'CI/CD Basics', resourceUrl: '' },
  { title: 'Design Patterns', resourceUrl: 'https://www.javatpoint.com/design-patterns-in-java' },
  { title: 'SOLID Principles', resourceUrl: '' },
  { title: 'Clean Code', resourceUrl: '' },
  { title: 'System Design Basics', resourceUrl: '' },
  { title: 'Performance Optimization', resourceUrl: '' },
  { title: 'Security Basics', resourceUrl: '' },
  { title: 'Authentication (JWT)', resourceUrl: '' },
  { title: 'Deployment', resourceUrl: '' },
  { title: 'Capstone Project (Full App)', resourceUrl: '' },
  { title: 'Mastery + Portfolio', resourceUrl: '' },
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
          title: `${skill.toUpperCase()} Level ${level}: ${names[level - 1] || names[(level - 1) % names.length]}`,
          difficulty: getDifficultyForLevel(level),
          estimatedMinutes: getEstimatedMinutes(level, skill),
        };
      }),
    };
  });

const createDetailedTracks = (skill, entries) =>
  Array.from({ length: 10 }, (_, trackIndex) => {
    const trackNo = trackIndex + 1;
    const start = trackIndex * 10;
    const end = start + 10;
    const topics = entries.slice(start, end);

    return {
      trackId: `${skill}-track-${trackNo}`,
      title: `${skill.toUpperCase()} Levels ${start + 1}-${end}`,
      topics: topics.map((entry, offset) => {
        const level = start + offset + 1;
        const difficulty = level <= 25 ? 'easy' : level <= 60 ? 'medium' : 'hard';
        const estimatedMinutes = difficulty === 'easy' ? 25 : difficulty === 'medium' ? 35 : 50;

        return {
          topicId: `${skill}-l${String(level).padStart(3, '0')}`,
          title: `JAVA Level ${level}: ${entry.title}`,
          difficulty,
          estimatedMinutes,
          resourceUrl: entry.resourceUrl || null,
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
    version: 3,
    tracks: createTracks('python', pythonLevelTopics),
  },
  {
    id: 'dsa',
    skill_id: 'dsa',
    category: 'Study',
    name: 'Data Structures & Algorithms',
    version: 3,
    tracks: createTracks('dsa', dsaLevelTopics),
  },
  {
    id: 'java',
    skill_id: 'java',
    category: 'Study',
    name: 'Java Programming',
    version: 1,
    tracks: createDetailedTracks('java', javaLevelEntries),
  },
  {
    id: 'gym',
    skill_id: 'gym',
    category: 'Health',
    name: 'Gym Fitness',
    version: 3,
    tracks: createTracks('gym', Array.from({ length: 100 }, (_, index) => gymTopicNames[index % gymTopicNames.length])),
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
