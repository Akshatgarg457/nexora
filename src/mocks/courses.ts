import { Course } from '../types';

export const initialCourses: Course[] = [
  {
    id: 'course-os',
    title: 'Operating Systems & Distributed Systems Architecture',
    category: 'Computer Science',
    progressPercent: 68,
    streakDays: 14,
    nextAssessmentDate: '2026-10-18',
    topics: [
      { id: 'top-1', title: 'Processes, Threads, and Concurrency Control', completed: true, durationEst: '45 mins' },
      { id: 'top-2', title: 'CPU Scheduling Algorithms & Multilevel Feedback Queues', completed: true, durationEst: '40 mins' },
      { id: 'top-3', title: 'Memory Management, Virtual Memory, and Page Replacement', completed: true, durationEst: '60 mins' },
      { id: 'top-4', title: 'Deadlock Characterization, Prevention, and Banker’s Algorithm', completed: false, durationEst: '50 mins' },
      { id: 'top-5', title: 'File System Design & Distributed Consensus (Raft/Paxos)', completed: false, durationEst: '75 mins' },
    ],
    flashcards: [
      {
        id: 'fc-1',
        category: 'Operating Systems',
        front: 'What are the 4 necessary conditions for a Deadlock to occur?',
        back: '1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait (Coffman conditions)',
      },
      {
        id: 'fc-2',
        category: 'Operating Systems',
        front: 'What is the purpose of the Translation Lookaside Buffer (TLB)?',
        back: 'A high-speed hardware cache for virtual-to-physical page table mappings, drastically reducing memory access latency.',
      },
      {
        id: 'fc-3',
        category: 'Operating Systems',
        front: 'Explain Belady’s Anomaly in page replacement algorithms.',
        back: 'The phenomenon where allocating more page frames to a process paradoxically increases the number of page faults (observable in FIFO, but never in Stack algorithms like LRU).',
      },
      {
        id: 'fc-4',
        category: 'Distributed Systems',
        front: 'What guarantees does the CAP Theorem state a distributed system can provide?',
        back: 'In the event of a network partition (P), a system can guarantee either Consistency (C) or Availability (A), but cannot satisfy both simultaneously.',
      },
    ],
    quizzes: [
      {
        id: 'q-1',
        question: 'Which of the following condition sets is both necessary and sufficient for a deadlock in a single-instance resource allocation graph?',
        options: [
          'A cycle exists in the Resource Allocation Graph',
          'A knot exists in the Wait-For Graph without preemption',
          'Processes exceed allocated memory boundaries',
          'The scheduler selects priority inversion tasks',
        ],
        correctIndex: 0,
        explanation: 'In a resource-allocation graph where every resource type has exactly one instance, a directed cycle is both a necessary and sufficient condition for deadlock.',
      },
      {
        id: 'q-2',
        question: 'What is the primary advantage of Multi-Level Feedback Queue (MLFQ) scheduling?',
        options: [
          'It strictly minimizes overall context switches regardless of throughput',
          'It adapts to process behavior without requiring a priori knowledge of CPU burst lengths',
          'It guarantees absolute round-robin fairness for background batch tasks',
          'It eliminates cache thrashing entirely by pinning threads to cores',
        ],
        correctIndex: 1,
        explanation: 'MLFQ dynamically adjusts priority levels based on observed execution behavior—interactive I/O-bound jobs remain at top priority while CPU-heavy jobs sink down.',
      },
      {
        id: 'q-3',
        question: 'Which page replacement policy is immune to Belady’s Anomaly?',
        options: [
          'FIFO (First-In, First-Out)',
          'Second Chance (Clock algorithm)',
          'LRU (Least Recently Used)',
          'Random Replacement',
        ],
        correctIndex: 2,
        explanation: 'LRU is a stack algorithm. For any stack algorithm, the set of pages in memory for n frames is always a strict subset of the pages in memory for n+1 frames, preventing Belady’s anomaly.',
      },
    ],
  },
  {
    id: 'course-cloud',
    title: 'Cloud Native Microservices & Spring Boot Engineering',
    category: 'Software Engineering',
    progressPercent: 82,
    streakDays: 9,
    nextAssessmentDate: '2026-10-25',
    topics: [
      { id: 'top-6', title: 'Spring Boot REST Controller Design & DTO Validation', completed: true, durationEst: '35 mins' },
      { id: 'top-7', title: 'Stateless JWT Authentication and Security Filter Chains', completed: true, durationEst: '50 mins' },
      { id: 'top-8', title: 'Spring Data JPA Caching & Transaction Isolation Levels', completed: true, durationEst: '60 mins' },
      { id: 'top-9', title: 'Resilience4j Circuit Breakers and Retry Strategies', completed: false, durationEst: '45 mins' },
    ],
    flashcards: [
      {
        id: 'fc-5',
        category: 'Spring Boot',
        front: 'What is the function of @CrossOrigin vs WebMvcConfigurer in Spring Boot?',
        back: '@CrossOrigin applies CORS headers at the controller/method level, while WebMvcConfigurer configures global CORS mapping for the entire application servlet.',
      },
    ],
    quizzes: [
      {
        id: 'q-4',
        question: 'What happens when a Spring @Transactional method is called from within the same class without a proxy?',
        options: [
          'The transaction is committed immediately after each line executes',
          'Self-invocation bypasses the Spring AOP proxy, so no transactional advice is applied',
          'A TransactionRequiredException is thrown at runtime',
          'The call automatically delegates to the root entityManager',
        ],
        correctIndex: 1,
        explanation: 'Spring declarative transaction management relies on dynamic proxies or CGLIB proxies. Calling the method directly via "this.method()" bypasses the proxy interceptor.',
      },
    ],
  },
];
