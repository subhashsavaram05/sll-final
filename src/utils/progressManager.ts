import { ModuleRecord, ModuleStatus, UserProgressState } from '../types/game';

const STORAGE_KEY = 'sll_learning_progress_v1';

export const SLL_PROGRESS_ACTIVITIES: Omit<ModuleRecord, 'status' | 'progressPercent'>[] = [
  {
    id: 'sl-01-intro',
    number: '01',
    code: 'SL-01',
    title: 'What is a Singly Linked List?',
    category: 'FOUNDATION',
    description: 'Learn how nodes store data and connect to the next node. Understand Head and node connections.',
    criteriaDescription: 'Understand linear node chaining, Head pointer reference, and dynamic memory allocation.',
    targetTab: 'THEORY',
    targetChapterId: 'what-is-sll',
  },
  {
    id: 'sl-02-nodes',
    number: '02',
    code: 'SL-02',
    title: 'Understanding Nodes',
    category: 'FOUNDATION',
    description: 'Explore the internal anatomy of a node: data fields holding values and next pointers referencing memory.',
    criteriaDescription: 'Master node structure, payload storage, and pointer allocation in memory.',
    targetTab: 'THEORY',
    targetChapterId: 'understanding-nodes',
  },
  {
    id: 'sl-03-head-connections',
    number: '03',
    code: 'SL-03',
    title: 'Head and Node Connections',
    category: 'FOUNDATION',
    description: 'Master the list entry point with Head, pointer references between nodes, and terminating at null.',
    criteriaDescription: 'Trace head referencing, sequential chaining, and null terminus verification.',
    targetTab: 'THEORY',
    targetChapterId: 'head-connections',
  },
  {
    id: 'sl-04-traversal',
    number: '04',
    code: 'SL-04',
    title: 'Traversing a Singly Linked List',
    category: 'FOUNDATION',
    description: 'Walk through each linked node sequentially from Head to null using temporary traversal pointers.',
    criteriaDescription: 'Implement pointer traversal using current = current.next without losing list references.',
    targetTab: 'THEORY',
    targetChapterId: 'traversal',
  },
  {
    id: 'sl-05-insert-beginning',
    number: '05',
    code: 'SL-05',
    title: 'Insertion at Beginning',
    category: 'TECHNIQUE',
    description: 'Prepend a new node at the start of the list in O(1) constant time by updating the Head pointer.',
    criteriaDescription: 'Point new node next to current Head, then reassign Head to the new node.',
    targetTab: 'GAME',
    targetLevelId: 1,
  },
  {
    id: 'sl-06-insert-end',
    number: '06',
    code: 'SL-06',
    title: 'Insertion at End',
    category: 'TECHNIQUE',
    description: 'Traverse to the tail node and attach a new node by setting the last node\'s next pointer.',
    criteriaDescription: 'Locate the terminal node whose next is null and link it to the newly created node.',
    targetTab: 'GAME',
    targetLevelId: 2,
  },
  {
    id: 'sl-07-insert-position',
    number: '07',
    code: 'SL-07',
    title: 'Insertion at Specific Position',
    category: 'TECHNIQUE',
    description: 'Insert a node at any arbitrary index or position by traversing to index-1 and rewiring pointers.',
    criteriaDescription: 'Set new_node.next = prev.next, then update prev.next = new_node without breaking the chain.',
    targetTab: 'GAME',
    targetLevelId: 3,
  },
  {
    id: 'sl-08-delete-first',
    number: '08',
    code: 'SL-08',
    title: 'Deleting the First Node',
    category: 'TECHNIQUE',
    description: 'Remove the head element in O(1) time by reassigning Head to head.next and freeing memory.',
    criteriaDescription: 'Advance Head pointer to the second node and cleanly deallocate the former head.',
    targetTab: 'GAME',
    targetLevelId: 4,
  },
  {
    id: 'sl-09-delete-final',
    number: '09',
    code: 'SL-09',
    title: 'Deleting the Final Node',
    category: 'TECHNIQUE',
    description: 'Traverse to the penultimate node, disconnect the tail node, and update the new tail\'s next to null.',
    criteriaDescription: 'Find the second-to-last node, free the tail node, and set the next pointer to null.',
    targetTab: 'GAME',
    targetLevelId: 4,
  },
  {
    id: 'sl-10-delete-specific',
    number: '10',
    code: 'SL-10',
    title: 'Deleting a Specific Node',
    category: 'TECHNIQUE',
    description: 'Locate a specific target node by key or position and bridge the previous node directly to target.next.',
    criteriaDescription: 'Bypass target node with prev.next = current.next and clean up unlinked memory.',
    targetTab: 'GAME',
    targetLevelId: 4,
  },
  {
    id: 'sl-11-search',
    number: '11',
    code: 'SL-11',
    title: 'Searching in a Linked List',
    category: 'TECHNIQUE',
    description: 'Perform linear search starting from Head to locate a target value in O(n) worst-case time.',
    criteriaDescription: 'Sequentially compare each node\'s data value until the target is found or null is reached.',
    targetTab: 'THEORY',
    targetChapterId: 'search',
  },
  {
    id: 'sl-12-operations',
    number: '12',
    code: 'SL-12',
    title: 'Linked List Operations',
    category: 'TECHNIQUE',
    description: 'Examine length calculation, reversal, concatenation, and pointer safety rules across list operations.',
    criteriaDescription: 'Analyze operation mechanics, pointer safety rules, and algorithmic complexity.',
    targetTab: 'THEORY',
    targetChapterId: 'operations',
  },
  {
    id: 'sl-13-memory',
    number: '13',
    code: 'SL-13',
    title: 'Memory Representation',
    category: 'ANALYSIS',
    description: 'Understand how linked nodes are allocated non-contiguously across Heap memory with pointer addresses.',
    criteriaDescription: 'Contrast non-contiguous heap memory addresses with contiguous array blocks.',
    targetTab: 'THEORY',
    targetChapterId: 'memory-representation',
  },
  {
    id: 'sl-14-dynamic-memory',
    number: '14',
    code: 'SL-14',
    title: 'Dynamic Memory',
    category: 'ANALYSIS',
    description: 'Examine runtime allocation, pointer referencing, avoiding leaks, and dynamic node deallocation.',
    criteriaDescription: 'Master dynamic heap allocation, pointer lifecycle, and memory management.',
    targetTab: 'THEORY',
    targetChapterId: 'dynamic-memory',
  },
  {
    id: 'sl-15-vs-array',
    number: '15',
    code: 'SL-15',
    title: 'Linked List vs Array',
    category: 'ANALYSIS',
    description: 'Evaluate algorithmic trade-offs: dynamic growth and O(1) insertions vs cache locality and random access.',
    criteriaDescription: 'Analyze trade-offs between O(1) random indexing and O(1) localized insertions.',
    targetTab: 'THEORY',
    targetChapterId: 'linked-list-vs-array',
  },
  {
    id: 'sl-16-connection-game',
    number: '16',
    code: 'SL-16',
    title: 'Node Connection Game',
    category: 'EXAMINATION',
    description: 'Interactive challenge connecting nodes, setting pointer links, and establishing valid chains.',
    criteriaDescription: 'Successfully wire nodes sequentially and maintain valid Head and null pointers.',
    targetTab: 'GAME',
    targetLevelId: 1,
  },
  {
    id: 'sl-17-insertion-challenge',
    number: '17',
    code: 'SL-17',
    title: 'Insertion Challenge',
    category: 'EXAMINATION',
    description: 'Interactive challenge executing beginning, ending, and intermediate insertions without breaking chains.',
    criteriaDescription: 'Complete all insertion puzzles with precision and zero dangling pointers.',
    targetTab: 'GAME',
    targetLevelId: 2,
  },
  {
    id: 'sl-18-deletion-challenge',
    number: '18',
    code: 'SL-18',
    title: 'Deletion Challenge',
    category: 'EXAMINATION',
    description: 'Interactive challenge safely removing nodes and bridging surrounding pointers to Head.',
    criteriaDescription: 'Remove target nodes and ensure remaining nodes stay securely connected.',
    targetTab: 'GAME',
    targetLevelId: 3,
  },
  {
    id: 'sl-19-quiz',
    number: '19',
    code: 'SL-19',
    title: 'Singly Linked List Quiz',
    category: 'EXAMINATION',
    description: 'Comprehensive 10-question examination assessing nodes, head pointers, traversals, and operations.',
    criteriaDescription: 'Score 80% or higher on Singly Linked List pointer theory and complexity questions.',
    targetTab: 'QUIZ',
  },
  {
    id: 'sl-20-final-lab',
    number: '20',
    code: 'SL-20',
    title: 'Singly Linked List Final Lab',
    category: 'EXAMINATION',
    description: 'Interactive hands-on sandbox lab constructing, mutating, and stress-testing custom Singly Linked Lists.',
    criteriaDescription: 'Execute interactive creation, insertions, deletions, and traversals in the sandbox workspace.',
    targetTab: 'LAB',
  },
];

// Re-export for backward compatibility
export const FIELD_NOTES_MODULES = SLL_PROGRESS_ACTIVITIES;

export interface SLLLevelDef {
  id: number;
  title: string;
  subtitle: string;
}

export const SLL_LEVELS: SLLLevelDef[] = [
  { id: 1, title: 'Node Explorer', subtitle: 'Explore Node Anatomy, Data Fields & Head Pointers' },
  { id: 2, title: 'Connection Builder', subtitle: 'Wire Sequential Next Pointers & Build Chains' },
  { id: 3, title: 'Traversal Master', subtitle: 'Iterate Step-by-Step from Head to the Null Terminus' },
  { id: 4, title: 'Operation Expert', subtitle: 'Master Beginning, Middle, and End Insertions & Deletions' },
  { id: 5, title: 'Singly Linked List Master', subtitle: 'Conquer Complex Pointer Manipulation & Edge Cases' },
];

const INITIAL_PROGRESS: UserProgressState = {
  version: 3,
  modules: {
    'sl-01-intro': 'NOT_STARTED',
    'sl-02-nodes': 'NOT_STARTED',
    'sl-03-head-connections': 'NOT_STARTED',
    'sl-04-traversal': 'NOT_STARTED',
    'sl-05-insert-beginning': 'NOT_STARTED',
    'sl-06-insert-end': 'NOT_STARTED',
    'sl-07-insert-position': 'NOT_STARTED',
    'sl-08-delete-first': 'NOT_STARTED',
    'sl-09-delete-final': 'NOT_STARTED',
    'sl-10-delete-specific': 'NOT_STARTED',
    'sl-11-search': 'NOT_STARTED',
    'sl-12-operations': 'NOT_STARTED',
    'sl-13-memory': 'NOT_STARTED',
    'sl-14-dynamic-memory': 'NOT_STARTED',
    'sl-15-vs-array': 'NOT_STARTED',
    'sl-16-connection-game': 'NOT_STARTED',
    'sl-17-insertion-challenge': 'NOT_STARTED',
    'sl-18-deletion-challenge': 'NOT_STARTED',
    'sl-19-quiz': 'NOT_STARTED',
    'sl-20-final-lab': 'NOT_STARTED',
  },
  moduleProgress: {},
  completedTheoryChapters: [],
  currentTheoryChapterId: 'what-is-sll',
  levelCompletedKeys: {},
  levelsCompleted: [],
  levelsMastered: [],
  quizScores: {},
  quizSubmitted: false,
  quizFinalScore: 0,
  masterChallengesCompleted: [],
  sandboxOperationsCount: 0,
  totalScore: 0,
  streak: 0,
  currentActiveModuleId: 'sl-01-intro',
  lastActiveTimestamp: Date.now(),
  completedVideos: [],
  hasCelebrated100Percent: false,
};

export const SLL_CHAPTER_MAP: Record<string, string> = {
  'what-is-sll': 'theory-01',
  'understanding-nodes': 'theory-02',
  'head-connections': 'theory-03',
  'traversal': 'theory-04',
  'insert-beginning': 'theory-05',
  'insert-end': 'theory-06',
  'insert-position': 'theory-07',
  'delete-first': 'theory-08',
  'delete-final': 'theory-09',
  'delete-specific': 'theory-10',
  'search': 'theory-11',
  'operations': 'theory-12',
  'memory-representation': 'theory-13',
  'dynamic-memory': 'theory-14',
  'linked-list-vs-array': 'theory-15',
};

export function normalizeTheoryChapterId(topicId?: string): string {
  if (!topicId) return 'theory-01';
  if (topicId.startsWith('theory-')) return topicId;
  if (SLL_CHAPTER_MAP[topicId]) {
    return SLL_CHAPTER_MAP[topicId];
  }
  const num = parseInt(topicId.replace(/\D/g, ''), 10);
  if (!isNaN(num) && num >= 1 && num <= 15) {
    return `theory-${String(num).padStart(2, '0')}`;
  }
  return 'theory-01';
}

type ProgressListener = (state: UserProgressState) => void;

class ProgressManager {
  private state: UserProgressState;
  private listeners: Set<ProgressListener> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): UserProgressState {
    if (typeof window === 'undefined') return INITIAL_PROGRESS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return INITIAL_PROGRESS;
      const parsed = JSON.parse(stored);
      if (parsed && parsed.version === 3) {
        return {
          ...INITIAL_PROGRESS,
          ...parsed,
          modules: {
            ...INITIAL_PROGRESS.modules,
            ...(parsed.modules || {}),
          },
          moduleProgress: { ...(parsed.moduleProgress || {}) },
          completedTheoryChapters: Array.isArray(parsed.completedTheoryChapters)
            ? Array.from(new Set(parsed.completedTheoryChapters))
            : [],
          completedVideos: Array.isArray(parsed.completedVideos)
            ? Array.from(new Set(parsed.completedVideos))
            : [],
          levelsCompleted: Array.isArray(parsed.levelsCompleted)
            ? Array.from(new Set(parsed.levelsCompleted))
            : [],
          levelsMastered: Array.isArray(parsed.levelsMastered)
            ? Array.from(new Set(parsed.levelsMastered))
            : [],
          masterChallengesCompleted: Array.isArray(parsed.masterChallengesCompleted)
            ? Array.from(new Set(parsed.masterChallengesCompleted))
            : [],
        };
      }
      return INITIAL_PROGRESS;
    } catch {
      return INITIAL_PROGRESS;
    }
  }

  private saveState() {
    if (typeof window === 'undefined') return;
    try {
      this.state.lastActiveTimestamp = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.notifyListeners();
    } catch {
      // Ignore write errors
    }
  }

  public subscribe(listener: ProgressListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const copy = this.getState();
    this.listeners.forEach((fn) => fn(copy));
  }

  public getState(): UserProgressState {
    return JSON.parse(JSON.stringify(this.state));
  }

  // 1. THEORY STATS (Theory Chapters)
  public getTheoryStats() {
    const list = Array.isArray(this.state.completedTheoryChapters)
      ? Array.from(new Set(this.state.completedTheoryChapters))
      : [];
    const total = 9;
    const completed = Math.min(total, list.length);
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      total,
      completed,
      percentage,
      isComplete: completed >= total,
      completedIds: [...list],
      currentChapterId: this.state.currentTheoryChapterId,
    };
  }

  // 2. VIDEO STATS (2 Singly Linked List Video Lessons)
  public getVideoStats() {
    const list = Array.isArray(this.state.completedVideos) ? this.state.completedVideos : [];
    const isIntroCompleted = list.includes('lesson-01') || list.includes('introduction') || list.includes('sll-intro');
    const isOperationsCompleted = list.includes('lesson-02') || list.includes('operations') || list.includes('sll-operations');
    const completed = (isIntroCompleted ? 1 : 0) + (isOperationsCompleted ? 1 : 0);
    const total = 2;
    const percentage = Math.round((completed / total) * 100);

    return {
      total,
      completed,
      percentage,
      isIntroCompleted,
      isOperationsCompleted,
      isCollisionCompleted: isOperationsCompleted, // backward compat
      isComplete: completed >= total,
      completedVideos: [...list],
    };
  }

  // 3. GAME STATS (5 Singly Linked List Levels)
  public getGameStats() {
    const rawList = Array.isArray(this.state.levelsCompleted) ? this.state.levelsCompleted : [];
    const completedList = Array.from(new Set(rawList.filter((lvl) => lvl >= 1 && lvl <= 5)));
    const completed = Math.min(5, completedList.length);
    const total = 5;
    const percentage = Math.round((completed / total) * 100);

    return {
      total,
      completed,
      percentage,
      isComplete: completed >= total,
      completedLevels: [...completedList],
    };
  }

  // 4. QUIZ STATS
  public getQuizStats() {
    const isSubmitted = Boolean(this.state.quizSubmitted);
    const completed = isSubmitted ? 1 : 0;
    const total = 1;
    const percentage = isSubmitted ? 100 : 0;

    return {
      total,
      completed,
      percentage,
      isSubmitted,
      finalScore: this.state.quizFinalScore || 0,
      isComplete: isSubmitted,
    };
  }

  // ALL 20 SINGLY LINKED LIST MODULES
  public getModules(): ModuleRecord[] {
    const theoryDone = this.state.completedTheoryChapters || [];
    const levelsDone = this.state.levelsCompleted || [];
    const videoStats = this.getVideoStats();
    const quizStats = this.getQuizStats();

    return SLL_PROGRESS_ACTIVITIES.map((m) => {
      let status: ModuleStatus = this.state.modules[m.id] || 'NOT_STARTED';
      let progressPercent = this.state.moduleProgress[m.id] || 0;

      // Auto-sync theory chapters
      if (m.targetChapterId && theoryDone.includes(m.targetChapterId)) {
        status = 'COMPLETED';
        progressPercent = 100;
      }

      // Auto-sync levels
      if (m.id === 'sl-05-insert-beginning' && levelsDone.includes(1)) {
        status = this.state.levelsMastered.includes(1) ? 'MASTERED' : 'COMPLETED';
        progressPercent = 100;
      } else if (m.id === 'sl-06-insert-end' && levelsDone.includes(2)) {
        status = this.state.levelsMastered.includes(2) ? 'MASTERED' : 'COMPLETED';
        progressPercent = 100;
      } else if (m.id === 'sl-07-insert-position' && levelsDone.includes(3)) {
        status = this.state.levelsMastered.includes(3) ? 'MASTERED' : 'COMPLETED';
        progressPercent = 100;
      } else if ((m.id === 'sl-08-delete-first' || m.id === 'sl-09-delete-final' || m.id === 'sl-10-delete-specific') && levelsDone.includes(4)) {
        status = this.state.levelsMastered.includes(4) ? 'MASTERED' : 'COMPLETED';
        progressPercent = 100;
      } else if (m.id === 'sl-16-connection-game' && levelsDone.includes(1)) {
        status = this.state.levelsMastered.includes(1) ? 'MASTERED' : 'COMPLETED';
        progressPercent = 100;
      } else if (m.id === 'sl-17-insertion-challenge' && levelsDone.includes(2)) {
        status = this.state.levelsMastered.includes(2) ? 'MASTERED' : 'COMPLETED';
        progressPercent = 100;
      } else if (m.id === 'sl-18-deletion-challenge' && levelsDone.includes(3)) {
        status = this.state.levelsMastered.includes(3) ? 'MASTERED' : 'COMPLETED';
        progressPercent = 100;
      } else if (m.id === 'sl-19-quiz' && quizStats.isSubmitted) {
        status = quizStats.finalScore >= 80 ? 'MASTERED' : 'COMPLETED';
        progressPercent = 100;
      } else if (m.id === 'sl-20-final-lab' && (this.state.sandboxOperationsCount || 0) >= 3) {
        status = 'COMPLETED';
        progressPercent = 100;
      }

      if (status === 'COMPLETED' || status === 'MASTERED') {
        progressPercent = 100;
      } else if (status === 'IN_PROGRESS' && progressPercent === 0) {
        progressPercent = 50;
      }

      return {
        ...m,
        status,
        progressPercent,
      };
    });
  }

  // OVERALL PROGRESS: Exactly 20 Measurable Singly Linked List Activities
  public getStats() {
    const modules = this.getModules();
    const total = 20;
    const completed = modules.filter((m) => m.status === 'COMPLETED' || m.status === 'MASTERED').length;
    const mastered = modules.filter((m) => m.status === 'MASTERED').length;
    const isAllComplete = completed >= total;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    // First unfinished module
    const currentUnfinished =
      modules.find(
        (m) => m.status === 'IN_PROGRESS' || m.status === 'NOT_STARTED'
      ) || modules[0];

    const theory = this.getTheoryStats();
    const video = this.getVideoStats();
    const game = this.getGameStats();
    const quiz = this.getQuizStats();

    return {
      total,
      completed,
      mastered,
      percentage,
      isAllComplete,
      nextModule: currentUnfinished,
      theory,
      video,
      game,
      quiz,
    };
  }

  // THEORY METHODS
  public isTheoryChapterCompleted(chapterId: string): boolean {
    return (this.state.completedTheoryChapters || []).includes(chapterId);
  }

  public completeTheoryChapter(chapterId: string): boolean {
    if (!this.state.completedTheoryChapters) {
      this.state.completedTheoryChapters = [];
    }

    if (this.state.completedTheoryChapters.includes(chapterId)) {
      return false;
    }

    this.state.completedTheoryChapters.push(chapterId);
    this.state.currentTheoryChapterId = chapterId;

    const targetModuleId = SLL_CHAPTER_MAP[chapterId];
    if (targetModuleId) {
      this.completeModule(targetModuleId);
    }

    this.saveState();
    return true;
  }

  public setCurrentTheoryChapter(chapterId: string) {
    this.state.currentTheoryChapterId = chapterId;
    this.saveState();
  }

  // VIDEO METHODS
  public isVideoCompleted(videoId: string): boolean {
    const list = this.state.completedVideos || [];
    return list.includes(videoId);
  }

  public completeVideo(videoId: string): boolean {
    if (!this.state.completedVideos) {
      this.state.completedVideos = [];
    }
    if (this.state.completedVideos.includes(videoId)) {
      return false;
    }
    this.state.completedVideos.push(videoId);
    this.saveState();
    return true;
  }

  // MODULE METHODS
  public startModule(moduleId: string) {
    if (!this.state.modules[moduleId] || this.state.modules[moduleId] === 'NOT_STARTED') {
      this.state.modules[moduleId] = 'IN_PROGRESS';
      this.state.moduleProgress[moduleId] = Math.max(this.state.moduleProgress[moduleId] || 0, 25);
      this.state.currentActiveModuleId = moduleId;
      this.saveState();
    }
  }

  public updateModuleProgress(moduleId: string, percent: number) {
    if (this.state.modules[moduleId] !== 'COMPLETED' && this.state.modules[moduleId] !== 'MASTERED') {
      this.state.modules[moduleId] = 'IN_PROGRESS';
      this.state.moduleProgress[moduleId] = Math.min(
        100,
        Math.max(this.state.moduleProgress[moduleId] || 0, percent)
      );
      this.state.currentActiveModuleId = moduleId;
      this.saveState();
    }
  }

  public completeModule(moduleId: string, isMastered: boolean = false) {
    const currentStatus = this.state.modules[moduleId];
    const newStatus: ModuleStatus =
      isMastered || currentStatus === 'MASTERED' ? 'MASTERED' : 'COMPLETED';

    this.state.modules[moduleId] = newStatus;
    this.state.moduleProgress[moduleId] = 100;
    this.state.currentActiveModuleId = moduleId;
    this.saveState();
  }

  public markLevelCompleted(levelId: number, scoreAwarded: number = 100, isPerfect: boolean = false) {
    if (!this.state.levelsCompleted) {
      this.state.levelsCompleted = [];
    }
    if (!this.state.levelsMastered) {
      this.state.levelsMastered = [];
    }

    const wasAlreadyCompleted = this.state.levelsCompleted.includes(levelId);

    if (!wasAlreadyCompleted) {
      this.state.levelsCompleted.push(levelId);
    }
    if (isPerfect && !this.state.levelsMastered.includes(levelId)) {
      this.state.levelsMastered.push(levelId);
    }

    // Auto complete corresponding activity
    const levelActivityMap: Record<number, string> = {
      1: 'sl-05-insert-beginning',
      2: 'sl-06-insert-end',
      3: 'sl-07-insert-position',
      4: 'sl-08-delete-first',
      5: 'sl-12-operations',
    };
    if (levelActivityMap[levelId]) {
      this.completeModule(levelActivityMap[levelId], isPerfect);
    }

    this.saveState();
  }

  public checkAndCompleteCertification() {
    const stats = this.getStats();
    if (stats.isAllComplete && !this.state.hasCelebrated100Percent) {
      this.saveState();
    }
  }

  public setCelebrationAcknowledged() {
    this.state.hasCelebrated100Percent = true;
    this.saveState();
  }

  public recordQuizCompletion(scores: Record<number, number>, correctCount: number, totalQuestions: number) {
    this.state.quizScores = scores;
    this.state.quizSubmitted = true;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    this.state.quizFinalScore = percentage;
    this.completeModule('sl-19-quiz', percentage >= 80);
    this.saveState();
  }

  public resetQuizAttempt() {
    this.state.quizScores = {};
    this.state.quizSubmitted = false;
    this.state.quizFinalScore = 0;
    this.saveState();
  }

  public recordMasterChallenge(challengeId: string) {
    if (!this.state.masterChallengesCompleted) {
      this.state.masterChallengesCompleted = [];
    }
    if (!this.state.masterChallengesCompleted.includes(challengeId)) {
      this.state.masterChallengesCompleted.push(challengeId);
    }
    this.saveState();
  }

  public recordSandboxOp() {
    this.state.sandboxOperationsCount += 1;
    if (this.state.sandboxOperationsCount >= 3) {
      this.completeModule('sl-20-final-lab');
    }
    this.saveState();
  }

  public addScore(points: number) {
    this.state.totalScore = (this.state.totalScore || 0) + points;
    this.saveState();
  }

  public resetProgress() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('hash_quest_quiz_answers_v3');
        localStorage.removeItem('hash_quest_quiz_submitted_v3');
        localStorage.removeItem('hash_quest_field_notes_progress_v2');
      } catch {
        // Ignore storage errors
      }
    }

    this.state = JSON.parse(JSON.stringify(INITIAL_PROGRESS));
    this.state.lastActiveTimestamp = Date.now();
    this.saveState();
  }
}

export const progressManager = new ProgressManager();

