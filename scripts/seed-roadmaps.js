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

const javaLevelTitles = [
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
  'System Design Basics',
];

const W3_JAVA = 'https://www.w3schools.com/java/default.asp';
const GFG_JAVA = 'https://www.geeksforgeeks.org/java/';

const javaResourceOverrides = {
  1: 'https://www.geeksforgeeks.org/java/java-programming-language/',
  2: 'https://www.geeksforgeeks.org/java/how-to-install-java-on-windows/',
  3: 'https://www.w3schools.com/java/java_intro.asp',
  4: 'https://www.w3schools.com/java/java_syntax.asp',
  5: 'https://www.w3schools.com/java/java_variables.asp',
  6: 'https://www.w3schools.com/java/java_data_types.asp',
  7: 'https://www.w3schools.com/java/java_type_casting.asp',
  8: 'https://www.w3schools.com/java/java_operators.asp',
  9: 'https://www.w3schools.com/java/java_user_input.asp',
  10: 'https://www.w3schools.com/java/java_conditions.asp',
  11: 'https://www.w3schools.com/java/java_switch.asp',
  12: 'https://www.w3schools.com/java/java_while_loop.asp',
  13: 'https://www.w3schools.com/java/java_break.asp',
  14: 'https://www.w3schools.com/java/java_methods.asp',
  15: 'https://www.w3schools.com/java/java_methods_param.asp',
  16: 'https://www.w3schools.com/java/java_methods_return.asp',
  17: 'https://www.geeksforgeeks.org/java/method-overloading-in-java/',
  18: 'https://www.w3schools.com/java/java_arrays.asp',
  19: 'https://www.w3schools.com/java/java_arrays_multi.asp',
  20: 'https://www.geeksforgeeks.org/java/java-programming-examples/',
  21: 'https://www.w3schools.com/java/java_strings.asp',
  22: 'https://www.w3schools.com/java/java_strings_methods.asp',
  23: 'https://www.geeksforgeeks.org/java/stringbuilder-class-in-java-with-examples/',
  24: 'https://www.geeksforgeeks.org/java/stringbuffer-class-in-java/',
  25: 'https://www.geeksforgeeks.org/java/wrapper-classes-java/',
  26: 'https://www.w3schools.com/java/java_math.asp',
  27: 'https://www.geeksforgeeks.org/java/date-class-java-examples/',
  28: 'https://www.w3schools.com/java/java_classes.asp',
  29: 'https://www.w3schools.com/java/java_constructors.asp',
  30: 'https://www.geeksforgeeks.org/java/this-reference-in-java/',
  31: 'https://www.w3schools.com/java/java_class_attributes.asp',
  32: 'https://www.w3schools.com/java/java_modifiers.asp',
  33: 'https://www.geeksforgeeks.org/java/encapsulation-in-java/',
  34: 'https://www.w3schools.com/java/java_inheritance.asp',
  35: 'https://www.w3schools.com/java/java_polymorphism.asp',
  36: 'https://www.w3schools.com/java/java_abstract.asp',
  37: 'https://www.w3schools.com/java/java_interface.asp',
  38: 'https://www.w3schools.com/java/java_packages.asp',
  39: 'https://www.w3schools.com/java/java_enums.asp',
  40: 'https://www.geeksforgeeks.org/java/object-oriented-programming-oops-concept-in-java/',
  41: 'https://www.w3schools.com/java/java_arraylist.asp',
  42: 'https://www.w3schools.com/java/java_linkedlist.asp',
  43: 'https://www.w3schools.com/java/java_hashmap.asp',
  44: 'https://www.w3schools.com/java/java_hashset.asp',
  45: 'https://www.geeksforgeeks.org/java/treemap-in-java-with-examples/',
  46: 'https://www.geeksforgeeks.org/java/treeset-in-java-with-examples/',
  47: 'https://www.geeksforgeeks.org/java/iterators-in-java/',
  48: 'https://www.geeksforgeeks.org/java/comparable-vs-comparator-in-java/',
  49: 'https://www.geeksforgeeks.org/java/collections-class-in-java/',
  50: 'https://www.geeksforgeeks.org/stack-class-in-java/',
  51: 'https://www.geeksforgeeks.org/queue-interface-java/',
  52: 'https://www.geeksforgeeks.org/priorityqueue-class-in-java-2/',
  53: 'https://www.w3schools.com/java/java_files.asp',
  54: 'https://www.w3schools.com/java/java_files_read.asp',
  55: 'https://www.w3schools.com/java/java_files_create.asp',
  56: 'https://www.w3schools.com/java/java_try_catch.asp',
  57: 'https://www.w3schools.com/java/java_try_catch.asp',
  58: 'https://www.geeksforgeeks.org/java/throw-throws-java/',
  59: 'https://www.geeksforgeeks.org/user-defined-custom-exception-in-java/',
  60: 'https://www.geeksforgeeks.org/java/file-handling-in-java/',
  61: 'https://www.geeksforgeeks.org/java/multithreading-in-java/',
  62: 'https://www.geeksforgeeks.org/java/lifecycle-and-states-of-a-thread-in-java/',
  63: 'https://www.geeksforgeeks.org/java/difference-between-thread-and-runnable-in-java/',
  64: 'https://www.geeksforgeeks.org/java/synchronization-in-java/',
  65: 'https://www.geeksforgeeks.org/deadlock-in-java-multithreading/',
  66: 'https://www.geeksforgeeks.org/stream-in-java/',
  67: 'https://www.geeksforgeeks.org/java/lambda-expressions-java-8/',
  68: 'https://www.geeksforgeeks.org/functional-interfaces-java/',
  69: 'https://www.geeksforgeeks.org/java-8-optional-class/',
  70: 'https://www.geeksforgeeks.org/java/java-8-features/',
  71: 'https://www.geeksforgeeks.org/serialization-in-java/',
  72: 'https://www.geeksforgeeks.org/computer-networks/networking-in-java/',
  73: 'https://www.geeksforgeeks.org/computer-networks/socket-programming-in-java/',
  74: 'https://www.geeksforgeeks.org/introduction-to-jdbc/',
  75: 'https://www.geeksforgeeks.org/java/how-to-connect-java-application-with-mysql-database/',
  76: 'https://www.geeksforgeeks.org/java/crud-operations-using-jdbc/',
  77: 'https://www.geeksforgeeks.org/java/reflection-in-java/',
  78: 'https://www.geeksforgeeks.org/java/annotations-in-java/',
  79: 'https://www.geeksforgeeks.org/java/logger-in-java-logging-example/',
  80: 'https://www.geeksforgeeks.org/command-line-arguments-in-java/',
  81: 'https://www.geeksforgeeks.org/system-design/singleton-class-java/',
  82: 'https://www.geeksforgeeks.org/software-engineering/mvc-design-pattern/',
  83: 'https://www.geeksforgeeks.org/rest-api-introduction/',
  84: 'https://www.geeksforgeeks.org/java/spring-boot/',
  85: 'https://www.geeksforgeeks.org/java/spring-boot-rest-api/',
  86: 'https://www.geeksforgeeks.org/spring-dependency-injection-with-example/',
  87: 'https://www.geeksforgeeks.org/java/hibernate-tutorial/',
  88: 'https://www.geeksforgeeks.org/spring-data-jpa-with-spring-boot/',
  89: 'https://www.geeksforgeeks.org/security-in-java/',
  90: 'https://www.geeksforgeeks.org/java/jwt-authentication-with-spring-boot/',
  91: 'https://www.geeksforgeeks.org/microservices-introduction/',
  92: 'https://www.geeksforgeeks.org/devops/docker-tutorial/',
  93: 'https://www.geeksforgeeks.org/software-testing/junit-tutorial/',
  94: 'https://www.geeksforgeeks.org/software-testing/mockito-tutorial/',
  95: 'https://www.geeksforgeeks.org/java/java-performance-tuning-tips/',
  96: 'https://www.geeksforgeeks.org/java/memory-management-in-java/',
  97: 'https://www.geeksforgeeks.org/java/jvm-works-jvm-architecture/',
  98: 'https://www.geeksforgeeks.org/full-stack-development/java-backend-roadmap/',
  99: 'https://www.geeksforgeeks.org/devops/deploy-spring-boot-application/',
  100: 'https://www.geeksforgeeks.org/system-design/system-design-tutorial/',
};

const resolveJavaResource = (level) => {
  if (javaResourceOverrides[level]) {
    return javaResourceOverrides[level];
  }

  if (level <= 60) {
    return W3_JAVA;
  }

  return GFG_JAVA;
};

const buildJavaTask = (title) => `Study ${title}, then implement one small Java program to practice it.`;

const javaLevelEntries = javaLevelTitles.map((title, index) => {
  const level = index + 1;
  return {
    title,
    task: buildJavaTask(title),
    resourceUrl: resolveJavaResource(level),
  };
});

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
          task: entry.task,
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

  console.log('Seeded roadmaps for python, dsa, java, and gym.');
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
