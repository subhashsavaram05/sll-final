import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Play,
  ArrowRight,
  ArrowLeft,
  Check,
  Clock,
  Copy,
  Layers,
  Sparkles,
  Zap,
  Activity,
  Award,
  Link as LinkIcon,
  Search,
  Code2,
} from 'lucide-react';
import { TechniqueType } from '../types/game';
import { progressManager, normalizeTheoryChapterId } from '../utils/progressManager';
import { soundManager } from '../utils/audio';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { TheoryVisualEnhancer } from './TheoryVisualEnhancer';

export interface LearnHashingSectionProps {
  initialTopic?: string;
  onStartLevel: (levelId: number) => void;
  onOpenSandbox: (technique?: TechniqueType, size?: number) => void;
}

export interface CodeBlockProps {
  cCode?: string;
  javaCode?: string;
  pythonCode?: string;
}

export interface TheoryChapter {
  id: string; // 'theory-01' to 'theory-15'
  number: string;
  category: string;
  title: string;
  shortTitle: string;
  readTime: string;
  contentLead?: string;
  diagramAscii?: string;
  bullets?: string[];
  exampleAscii?: string;
  analogy?: string;
  steps?: string[];
  resultAscii?: string;
  cCode?: string;
  javaCode?: string;
  pythonCode?: string;
  timeComplexity?: string;
  timeComplexityNote?: string;
  tableData?: Array<{ operation: string; complexity: string }>;
  advantages?: Array<{ num: number; title: string; desc: string }>;
  disadvantages?: Array<{ num: number; title: string; desc: string; diagram?: string }>;
  applications?: Array<{ num: number; title: string; desc: string; diagram?: string }>;
  quickRevisionPoints?: string[];
  quickRevisionDiagram?: string;
  quickRevisionConclusion?: string;
  operationsGroups?: Array<{
    groupTitle: string;
    groupSubtitle?: string;
    items: string[];
  }>;
  searchExample?: {
    listAscii: string;
    query: string;
    steps: Array<{ label: string; status: 'wrong' | 'found' }>;
  };
  displayExample?: {
    listAscii: string;
    output: string;
  };
}

export const THEORY_CHAPTERS: TheoryChapter[] = [
  // 1. INTRODUCTION TO SINGLY LINKED LIST
  {
    id: 'theory-01',
    number: '01',
    category: 'INTRODUCTION',
    title: 'Introduction to Singly Linked List',
    shortTitle: '1. Introduction to SLL',
    readTime: '3 MIN',
    contentLead:
      'A Singly Linked List is a collection of nodes connected in one direction.\n\nEach node contains two parts:',
    diagramAscii: `┌──────────┬──────────┐
│  DATA    │   NEXT   │
└──────────┴──────────┘`,
    bullets: [
      'DATA → stores the value.',
      'NEXT → stores the address/reference of the next node.',
      'The first node is called HEAD.',
      'The last node points to NULL because there is no next node.',
    ],
    exampleAscii: `HEAD
 ↓
[10 | •] → [20 | •] → [30 | NULL]`,
    analogy: 'Think of it like a chain. Each node knows where the next node is.',
  },

  // 2. OPERATIONS OF SINGLY LINKED LIST
  {
    id: 'theory-02',
    number: '02',
    category: 'OVERVIEW',
    title: 'Operations of Singly Linked List',
    shortTitle: '2. Operations of SLL',
    readTime: '2 MIN',
    contentLead: 'The main operations of a Singly Linked List are:',
    operationsGroups: [
      {
        groupTitle: 'Insertion',
        groupSubtitle: 'Adding a new node.',
        items: [
          '1. Insertion at the beginning',
          '2. Insertion at the end',
          '3. Insertion at any position',
        ],
      },
      {
        groupTitle: 'Deletion',
        groupSubtitle: 'Removing a node.',
        items: [
          '1. Deletion at the beginning',
          '2. Deletion at the end',
          '3. Deletion at any position',
        ],
      },
      {
        groupTitle: 'Other operations',
        items: [
          '4. Display → show all nodes.',
          '5. Search → find a particular value.',
        ],
      },
    ],
  },

  // 3. INSERTION AT THE BEGINNING
  {
    id: 'theory-03',
    number: '03',
    category: 'INSERTION',
    title: 'Insertion at the Beginning',
    shortTitle: '3. Insert at Beginning',
    readTime: '3 MIN',
    contentLead: 'Suppose we have:',
    diagramAscii: `10 → 20 → 30 → NULL`,
    analogy: 'We want to insert 5.',
    steps: [
      '1. Create a new node containing 5.',
      '2. Make the new node point to the current HEAD.',
      '3. Make HEAD point to the new node.',
    ],
    resultAscii: `5 → 10 → 20 → 30 → NULL
↑
HEAD`,
    cCode: `struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));

newNode->data = 5;
newNode->next = head;
head = newNode;`,
    javaCode: `Node newNode = new Node(5);

newNode.next = head;
head = newNode;`,
    pythonCode: `new_node = Node(5)

new_node.next = head
head = new_node`,
    timeComplexity: 'O(1)',
  },

  // 4. INSERTION AT THE END
  {
    id: 'theory-04',
    number: '04',
    category: 'INSERTION',
    title: 'Insertion at the End',
    shortTitle: '4. Insert at End',
    readTime: '4 MIN',
    contentLead: 'Suppose:',
    diagramAscii: `10 → 20 → 30 → NULL`,
    analogy: 'We want to add 40.',
    steps: [
      '1. Create a new node.',
      '2. Set its next to NULL.',
      '3. Start from HEAD.',
      '4. Move until the last node.',
      '5. Make the last node point to the new node.',
    ],
    resultAscii: `10 → 20 → 30 → 40 → NULL`,
    cCode: `struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));

newNode->data = 40;
newNode->next = NULL;

if (head == NULL) {
    head = newNode;
} else {
    struct Node* temp = head;

    while (temp->next != NULL) {
        temp = temp->next;
    }

    temp->next = newNode;
}`,
    javaCode: `Node newNode = new Node(40);

if (head == null) {
    head = newNode;
} else {
    Node temp = head;

    while (temp.next != null) {
        temp = temp.next;
    }

    temp.next = newNode;
}`,
    pythonCode: `new_node = Node(40)

if head is None:
    head = new_node
else:
    temp = head

    while temp.next is not None:
        temp = temp.next

    temp.next = new_node`,
    timeComplexity: 'O(n)',
    timeComplexityNote: 'when there is no tail pointer.',
  },

  // 5. INSERTION AT ANY POSITION
  {
    id: 'theory-05',
    number: '05',
    category: 'INSERTION',
    title: 'Insertion at Any Position',
    shortTitle: '5. Insert at Position',
    readTime: '4 MIN',
    contentLead: 'Suppose:',
    diagramAscii: `10 → 20 → 40 → NULL`,
    analogy: 'We want to insert 30 between 20 and 40.',
    resultAscii: `10 → 20 → 30 → 40 → NULL`,
    steps: [
      '1. Create a new node.',
      '2. Move to the node just before the required position.',
      '3. Save the next node.',
      '4. Make the new node point to the next node.',
      '5. Make the previous node point to the new node.',
    ],
    cCode: `struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));

newNode->data = 30;

struct Node* temp = head;

for (int i = 1; i < position - 1; i++) {
    temp = temp->next;
}

newNode->next = temp->next;
temp->next = newNode;`,
    javaCode: `Node newNode = new Node(30);

Node temp = head;

for (int i = 1; i < position - 1; i++) {
    temp = temp.next;
}

newNode.next = temp.next;
temp.next = newNode;`,
    pythonCode: `new_node = Node(30)

temp = head

for i in range(1, position - 1):
    temp = temp.next

new_node.next = temp.next
temp.next = new_node`,
    timeComplexity: 'O(n)',
  },

  // 6. DELETION AT THE BEGINNING
  {
    id: 'theory-06',
    number: '06',
    category: 'DELETION',
    title: 'Deletion at the Beginning',
    shortTitle: '6. Delete at Beginning',
    readTime: '3 MIN',
    contentLead: 'Suppose:',
    diagramAscii: `10 → 20 → 30 → NULL`,
    analogy: 'We want to delete 10.',
    steps: [
      '1. Move HEAD to the second node.',
      '2. The first node is removed from the list.',
    ],
    resultAscii: `20 → 30 → NULL
↑
HEAD`,
    cCode: `if (head != NULL) {
    struct Node* temp = head;
    head = head->next;
    free(temp);
}`,
    javaCode: `if (head != null) {
    head = head.next;
}`,
    pythonCode: `if head is not None:
    head = head.next`,
    timeComplexity: 'O(1)',
  },

  // 7. DELETION AT THE END
  {
    id: 'theory-07',
    number: '07',
    category: 'DELETION',
    title: 'Deletion at the End',
    shortTitle: '7. Delete at End',
    readTime: '4 MIN',
    contentLead: 'Suppose:',
    diagramAscii: `10 → 20 → 30 → NULL`,
    analogy: 'We want to delete 30.',
    resultAscii: `10 → 20 → NULL`,
    steps: [
      '1. Start from HEAD.',
      '2. Find the last node.',
      '3. Stop at the node before the last node.',
      '4. Make its next point to NULL.',
    ],
    cCode: `if (head == NULL) {
    return;
}

if (head->next == NULL) {
    free(head);
    head = NULL;
    return;
}

struct Node* temp = head;

while (temp->next->next != NULL) {
    temp = temp->next;
}

free(temp->next);
temp->next = NULL;`,
    javaCode: `if (head == null) {
    return;
}

if (head.next == null) {
    head = null;
    return;
}

Node temp = head;

while (temp.next.next != null) {
    temp = temp.next;
}

temp.next = null;`,
    pythonCode: `if head is None:
    return

if head.next is None:
    head = None
    return

temp = head

while temp.next.next is not None:
    temp = temp.next

temp.next = None`,
    timeComplexity: 'O(n)',
  },

  // 8. DELETION AT ANY POSITION
  {
    id: 'theory-08',
    number: '08',
    category: 'DELETION',
    title: 'Deletion at Any Position',
    shortTitle: '8. Delete at Position',
    readTime: '4 MIN',
    contentLead: 'Suppose:',
    diagramAscii: `10 → 20 → 30 → 40 → NULL`,
    analogy: 'We want to delete 30.',
    resultAscii: `10 → 20 → 40 → NULL`,
    bullets: [
      'The important idea is:',
      '20 → 30 → 40\n\nbecomes\n\n20 ─────────→ 40',
      'The previous node simply skips the node being deleted.',
    ],
    cCode: `struct Node* temp = head;

for (int i = 1; i < position - 1; i++) {
    temp = temp->next;
}

struct Node* deleteNode = temp->next;

temp->next = deleteNode->next;

free(deleteNode);`,
    javaCode: `Node temp = head;

for (int i = 1; i < position - 1; i++) {
    temp = temp.next;
}

temp.next = temp.next.next;`,
    pythonCode: `temp = head

for i in range(1, position - 1):
    temp = temp.next

temp.next = temp.next.next`,
    timeComplexity: 'O(n)',
  },

  // 9. SEARCHING
  {
    id: 'theory-09',
    number: '09',
    category: 'SEARCHING',
    title: 'Searching',
    shortTitle: '9. Searching',
    readTime: '3 MIN',
    contentLead:
      'Searching means finding whether a particular value exists in the linked list.',
    searchExample: {
      listAscii: '10 → 20 → 30 → 40 → NULL',
      query: 'Search for 30.',
      steps: [
        { label: '10', status: 'wrong' },
        { label: '20', status: 'wrong' },
        { label: '30', status: 'found' },
      ],
    },
    cCode: `int search(struct Node* head, int key) {
    struct Node* temp = head;

    while (temp != NULL) {
        if (temp->data == key) {
            return 1;
        }

        temp = temp->next;
    }

    return 0;
}`,
    javaCode: `boolean search(Node head, int key) {
    Node temp = head;

    while (temp != null) {
        if (temp.data == key) {
            return true;
        }

        temp = temp.next;
    }

    return false;
}`,
    pythonCode: `def search(head, key):
    temp = head

    while temp is not None:
        if temp.data == key:
            return True

        temp = temp.next

    return False`,
    timeComplexity: 'O(n)',
  },

  // 10. DISPLAY
  {
    id: 'theory-10',
    number: '10',
    category: 'TRAVERSAL',
    title: 'Display',
    shortTitle: '10. Display',
    readTime: '2 MIN',
    contentLead: 'Display means visiting every node and printing its data.',
    displayExample: {
      listAscii: '10 → 20 → 30 → NULL',
      output: '10 20 30',
    },
    cCode: `void display(struct Node* head) {
    struct Node* temp = head;

    while (temp != NULL) {
        printf("%d ", temp->data);
        temp = temp->next;
    }
}`,
    javaCode: `void display(Node head) {
    Node temp = head;

    while (temp != null) {
        System.out.print(temp.data + " ");
        temp = temp.next;
    }
}`,
    pythonCode: `def display(head):
    temp = head

    while temp is not None:
        print(temp.data, end=" ")
        temp = temp.next`,
    timeComplexity: 'O(n)',
  },

  // 11. TIME COMPLEXITIES
  {
    id: 'theory-11',
    number: '11',
    category: 'COMPLEXITY',
    title: 'Time Complexities',
    shortTitle: '11. Time Complexities',
    readTime: '3 MIN',
    contentLead: 'Let n = number of nodes.',
    tableData: [
      { operation: 'Insert at beginning', complexity: 'O(1)' },
      { operation: 'Insert at end', complexity: 'O(n)' },
      { operation: 'Insert at any position', complexity: 'O(n)' },
      { operation: 'Delete at beginning', complexity: 'O(1)' },
      { operation: 'Delete at end', complexity: 'O(n)' },
      { operation: 'Delete at any position', complexity: 'O(n)' },
      { operation: 'Search', complexity: 'O(n)' },
      { operation: 'Display', complexity: 'O(n)' },
    ],
    bullets: [
      'Easy way to remember:',
      'If we can directly change HEAD, it is usually: O(1)',
      'If we need to walk through the list, it is usually: O(n)',
    ],
  },

  // 12. ADVANTAGES OF SINGLY LINKED LIST
  {
    id: 'theory-12',
    number: '12',
    category: 'ANALYSIS',
    title: 'Advantages of Singly Linked List',
    shortTitle: '12. Advantages',
    readTime: '3 MIN',
    advantages: [
      {
        num: 1,
        title: 'Dynamic size',
        desc: 'The list can grow or shrink when needed.',
      },
      {
        num: 2,
        title: 'Easy insertion',
        desc: 'Adding a node at the beginning is very fast: O(1).',
      },
      {
        num: 3,
        title: 'Easy deletion',
        desc: 'Deleting the first node is also very fast: O(1).',
      },
      {
        num: 4,
        title: 'No continuous memory required',
        desc: 'Nodes do not have to be stored next to each other in memory.',
      },
      {
        num: 5,
        title: 'Useful for dynamic data',
        desc: 'It works well when the amount of data changes frequently.',
      },
    ],
  },

  // 13. DISADVANTAGES OF SINGLY LINKED LIST
  {
    id: 'theory-13',
    number: '13',
    category: 'ANALYSIS',
    title: 'Disadvantages of Singly Linked List',
    shortTitle: '13. Disadvantages',
    readTime: '3 MIN',
    disadvantages: [
      {
        num: 1,
        title: 'No direct access',
        desc: 'You cannot directly jump to the 5th node like you can with an array. You have to start from HEAD and move through the nodes.',
      },
      {
        num: 2,
        title: 'Searching is slower',
        desc: 'Searching can take O(n) time.',
      },
      {
        num: 3,
        title: 'Extra memory',
        desc: 'Each node needs extra space for the next pointer.',
      },
      {
        num: 4,
        title: 'Only forward movement',
        desc: 'A singly linked list can move: 10 → 20 → 30 but cannot easily move backward: 30 → 20.',
        diagram: '10 → 20 → 30\n(cannot easily move backward: 30 → 20)',
      },
      {
        num: 5,
        title: 'More pointer handling',
        desc: 'Incorrectly changing a pointer can break the links in the list.',
      },
    ],
  },

  // 14. APPLICATIONS OF SINGLY LINKED LIST
  {
    id: 'theory-14',
    number: '14',
    category: 'APPLICATIONS',
    title: 'Applications of Singly Linked List',
    shortTitle: '14. Applications',
    readTime: '3 MIN',
    contentLead:
      'Singly linked lists are useful when data needs to be connected sequentially.',
    applications: [
      {
        num: 1,
        title: 'Implementing stacks',
        desc: 'A linked list can be used to create a stack.',
        diagram: `TOP
 ↓
30 → 20 → 10 → NULL`,
      },
      {
        num: 2,
        title: 'Implementing queues',
        desc: 'Linked lists can also be used to implement queues.',
        diagram: `FRONT → 10 → 20 → 30 ← REAR`,
      },
      {
        num: 3,
        title: 'Dynamic memory structures',
        desc: 'They are useful when the number of elements changes frequently.',
      },
      {
        num: 4,
        title: 'Graph representation',
        desc: 'Linked lists can be used in some graph representations, such as adjacency lists.',
      },
      {
        num: 5,
        title: 'Polynomial representation',
        desc: 'A polynomial can be represented using nodes containing coefficients and powers.',
      },
      {
        num: 6,
        title: 'Hash table chaining',
        desc: 'Linked lists can be used to store multiple elements in the same hash-table bucket.',
      },
    ],
  },

  // 15. QUICK REVISION
  {
    id: 'theory-15',
    number: '15',
    category: 'REVISION',
    title: '⭐ Quick Revision',
    shortTitle: '15. Quick Revision',
    readTime: '2 MIN',
    contentLead: 'Remember these five ideas:',
    quickRevisionPoints: [
      'NODE = DATA + NEXT',
      'HEAD → FIRST NODE',
      'LAST NODE → NULL',
      'INSERT = CONNECT A NEW NODE',
      'DELETE = BYPASS A NODE',
    ],
    quickRevisionDiagram: `        HEAD
          ↓
     ┌─────────┐
     │  DATA   │
     │  NEXT ──┼──→ ┌─────────┐
     └─────────┘    │  DATA   │
                    │  NEXT ──┼──→ NULL
                    └─────────┘`,
    quickRevisionConclusion:
      'The most important thing to understand: a singly linked list is simply a sequence of nodes where each node knows the address/reference of the next node.',
  },
];

// Helper Multi-Language Code Block with Tabs & Copy
const MultiLanguageCodeBlock: React.FC<CodeBlockProps> = ({
  cCode,
  javaCode,
  pythonCode,
}) => {
  const [selectedLang, setSelectedLang] = useState<'c' | 'java' | 'python'>('c');
  const [copied, setCopied] = useState<boolean>(false);

  const currentCode =
    selectedLang === 'c' ? cCode : selectedLang === 'java' ? javaCode : pythonCode;

  const handleCopy = () => {
    if (!currentCode) return;
    navigator.clipboard.writeText(currentCode);
    soundManager.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 dark:bg-[#080D1F] border border-slate-700/60 dark:border-purple-500/25 rounded-xl overflow-hidden shadow-xs font-mono text-xs my-4">
      {/* Tab bar header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-800/90 dark:bg-[#050816] border-b border-slate-700/50 dark:border-purple-500/20">
        <div className="flex items-center gap-1.5">
          {cCode && (
            <button
              onClick={() => setSelectedLang('c')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                selectedLang === 'c'
                  ? 'bg-indigo-600 dark:bg-purple-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 dark:hover:bg-[#0F1733]'
              }`}
            >
              C
            </button>
          )}
          {javaCode && (
            <button
              onClick={() => setSelectedLang('java')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                selectedLang === 'java'
                  ? 'bg-indigo-600 dark:bg-purple-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 dark:hover:bg-[#0F1733]'
              }`}
            >
              Java
            </button>
          )}
          {pythonCode && (
            <button
              onClick={() => setSelectedLang('python')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                selectedLang === 'python'
                  ? 'bg-indigo-600 dark:bg-purple-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 dark:hover:bg-[#0F1733]'
              }`}
            >
              Python
            </button>
          )}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-700/60 dark:bg-[#0F1733] hover:bg-slate-600 dark:hover:bg-[#152044] text-slate-300 dark:text-cyan-300 text-[11px] transition-colors cursor-pointer"
          title="Copy to Clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code viewport */}
      <div className="p-4 overflow-x-auto text-slate-100 dark:text-cyan-200 leading-relaxed font-mono">
        <pre>
          <code>{currentCode}</code>
        </pre>
      </div>
    </div>
  );
};

export const LearnHashingSection: React.FC<LearnHashingSectionProps> = ({
  initialTopic = 'theory-01',
  onStartLevel,
  onOpenSandbox,
}) => {
  useScrollReveal();

  // Active Chapter State
  const [activeChapterId, setActiveChapterId] = useState<string>(() =>
    normalizeTheoryChapterId(initialTopic)
  );

  // Progress State from Single Source of Truth
  const [pState, setPState] = useState(() => progressManager.getState());

  useEffect(() => {
    if (initialTopic) {
      const normalized = normalizeTheoryChapterId(initialTopic);
      setActiveChapterId(normalized);
    }
  }, [initialTopic]);

  useEffect(() => {
    const unsub = progressManager.subscribe((state) => {
      setPState(state);
    });
    return () => unsub();
  }, []);

  const activeChapterIndex = THEORY_CHAPTERS.findIndex(
    (c) => c.id === activeChapterId || c.number === activeChapterId
  );
  const activeChapter =
    activeChapterIndex >= 0 ? THEORY_CHAPTERS[activeChapterIndex] : THEORY_CHAPTERS[0];

  const completedChapters = pState.completedTheoryChapters || [];
  const isCurrentChapterCompleted = completedChapters.includes(activeChapter.id);
  const totalCompletedCount = completedChapters.length;
  const theoryPercentage = Math.round((totalCompletedCount / THEORY_CHAPTERS.length) * 100);

  // Hook for automatic scroll-to-reveal animations on chapter updates
  useScrollReveal([activeChapter.id]);

  const handleSelectChapter = (chapterId: string) => {
    soundManager.playSelect();
    const normalized = normalizeTheoryChapterId(chapterId);
    setActiveChapterId(normalized);
    progressManager.setCurrentTheoryChapter(normalized);
  };

  const handleMarkCompleted = () => {
    if (isCurrentChapterCompleted) return;
    const newlyCompleted = progressManager.completeTheoryChapter(activeChapter.id);
    if (newlyCompleted) {
      soundManager.playTheoryComplete();
    }
  };

  const handleNextChapter = () => {
    soundManager.playNav();
    if (!isCurrentChapterCompleted) {
      const newlyCompleted = progressManager.completeTheoryChapter(activeChapter.id);
      if (newlyCompleted) {
        soundManager.playTheoryComplete();
      }
    }

    if (activeChapterIndex < THEORY_CHAPTERS.length - 1) {
      const nextChapter = THEORY_CHAPTERS[activeChapterIndex + 1];
      setActiveChapterId(nextChapter.id);
      progressManager.setCurrentTheoryChapter(nextChapter.id);
    }
  };

  const handlePrevChapter = () => {
    soundManager.playNav();
    if (activeChapterIndex > 0) {
      const prevChapter = THEORY_CHAPTERS[activeChapterIndex - 1];
      setActiveChapterId(prevChapter.id);
      progressManager.setCurrentTheoryChapter(prevChapter.id);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-2 sm:py-4 px-2 sm:px-4 space-y-6 font-sans text-slate-900 dark:text-white animate-page-enter">
      {/* =========================================================================
          1. HEADER SECTION
          ========================================================================= */}
      <div className="border border-slate-200 dark:border-purple-500/20 rounded-2xl pt-5 pb-6 px-6 sm:px-8 bg-white dark:bg-[#0B1228] shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] reveal-on-scroll">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-purple-950/60 text-indigo-700 dark:text-purple-300 border border-indigo-100 dark:border-purple-500/30 rounded-md text-xs font-semibold uppercase tracking-wider font-mono">
              CURRICULUM // VOL. 01
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-sans">
              Data Structures & Linked Lists
            </span>
          </div>
          <div className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#080D1F] px-3 py-1 rounded-lg border border-slate-200 dark:border-purple-500/20">
            Progress: <span className="text-indigo-600 dark:text-purple-400 font-bold">{totalCompletedCount}</span> / 15 Sections ({theoryPercentage}%)
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight animate-heading-enter">
          Singly Linked List — Easy Notes
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl mt-2 leading-relaxed font-normal">
          A simple, student-friendly complete guide to Singly Linked Lists (SLL) with node architecture, step-by-step operations, multi-language code implementations (C, Java, Python), time complexities, and quick revision.
        </p>
      </div>

      {/* =========================================================================
          2. TWO-COLUMN INTERFACE:
             Left Sidebar: Chapter Directory (15 Chapters)
             Right Main: Active Chapter Content
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =========================================================================
            LEFT COLUMN: CHAPTER DIRECTORY (15 CHAPTERS)
            ========================================================================= */}
        <aside className="lg:col-span-4 bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/20 rounded-2xl shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] overflow-hidden">
          {/* Directory Header */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-purple-500/15 bg-slate-50/70 dark:bg-[#080D1F] flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
              Table of Contents
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-medium">
              15 Chapters
            </span>
          </div>

          {/* List of 15 Selectable Chapter Rows */}
          <nav className="divide-y divide-slate-100 dark:divide-purple-500/10 max-h-[680px] overflow-y-auto" aria-label="Table of Contents">
            {THEORY_CHAPTERS.map((chap) => {
              const isSelected = activeChapter.id === chap.id;
              const isCompleted = completedChapters.includes(chap.id);

              return (
                <button
                  key={chap.id}
                  id={`btn-chapter-${chap.id}`}
                  onClick={() => handleSelectChapter(chap.id)}
                  className={`w-full text-left px-4 py-3 transition-all flex items-center justify-between gap-2 cursor-pointer group select-none ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-purple-950/60 text-indigo-700 dark:text-cyan-300 font-semibold border-l-4 border-l-indigo-600 dark:border-l-purple-500'
                      : 'bg-white dark:bg-[#0B1228] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#0F1733] font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span
                      className={`text-xs font-mono font-bold shrink-0 ${
                        isSelected ? 'text-indigo-600 dark:text-purple-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                      }`}
                    >
                      {chap.number}
                    </span>
                    <span className="text-sm leading-snug font-sans break-words">
                      {chap.shortTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isCompleted ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs" title="Completed">
                        ✓
                      </span>
                    ) : isSelected ? (
                      <span className="text-indigo-600 dark:text-purple-400 text-xs font-bold" title="Current">
                        ●
                      </span>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-600 text-xs font-normal" title="Available">
                        ○
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer Progress Summary */}
          <div className="p-3.5 bg-slate-50 dark:bg-[#080D1F] border-t border-slate-100 dark:border-purple-500/15 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-sans">
            <span>Status:</span>
            <span className="font-semibold text-slate-900 dark:text-white font-mono">
              {totalCompletedCount} / 15 Completed
            </span>
          </div>
        </aside>

        {/* =========================================================================
            RIGHT COLUMN: ACTIVE CHAPTER VIEWER
            ========================================================================= */}
        <main
          key={activeChapter.id}
          className="lg:col-span-8 bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/20 rounded-2xl p-6 sm:p-8 shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] space-y-6 animate-chapter-switch"
        >
          {/* Chapter Metadata Header Tag & Read Time */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-purple-500/15 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-purple-950/60 border border-indigo-100 dark:border-purple-500/30 text-indigo-700 dark:text-purple-300 rounded-md text-xs font-semibold uppercase tracking-wider font-mono">
                Section {activeChapter.number} // {activeChapter.category}
              </span>
              {isCurrentChapterCompleted && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-md text-xs font-semibold font-sans">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                  <span>Completed</span>
                </span>
              )}
            </div>
            <div className="text-xs font-sans text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-purple-400" />
              <span>Est. Read: {activeChapter.readTime}</span>
            </div>
          </div>

          {/* Chapter Big Heading */}
          <div className="mb-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {activeChapter.title}
            </h2>
          </div>

          {/* Lead Content / Overview */}
          {activeChapter.contentLead && (
            <div className="space-y-2 reveal-on-scroll">
              <p className="text-base text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                {activeChapter.contentLead}
              </p>
            </div>
          )}

          {/* ASCII Node Diagram if present */}
          {activeChapter.diagramAscii && (
            <div className="bg-slate-50 dark:bg-[#080D1F] border border-slate-200 dark:border-purple-500/20 rounded-xl p-4 font-mono shadow-xs reveal-on-scroll">
              <div className="bg-[#F8FAFC] dark:bg-[#050816] text-[#111827] dark:text-cyan-300 p-3.5 rounded-lg text-xs sm:text-sm font-bold overflow-x-auto border border-[#E5E7EB] dark:border-purple-500/20 border-l-4 border-l-[#4F46E5] dark:border-l-purple-500">
                <pre>{activeChapter.diagramAscii}</pre>
              </div>
            </div>
          )}

          {/* Visual Enhancer / Interactive Diagram (Chapters 1, 8, 15) */}
          <TheoryVisualEnhancer chapterId={activeChapter.id} />

          {/* Bullet Points */}
          {activeChapter.bullets && activeChapter.bullets.length > 0 && (
            <div className="space-y-2 reveal-on-scroll">
              <ul className="space-y-2 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                {activeChapter.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-3 leading-relaxed whitespace-pre-line">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-purple-400 mt-2 shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Example ASCII Diagram */}
          {activeChapter.exampleAscii && (
            <div className="space-y-2 reveal-on-scroll">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono">
                Example:
              </span>
              <div className="bg-[#F8FAFC] dark:bg-[#050816] text-[#111827] dark:text-cyan-300 p-4 rounded-xl text-xs sm:text-sm font-bold font-mono overflow-x-auto border border-[#E5E7EB] dark:border-purple-500/20 border-l-4 border-l-[#4F46E5] dark:border-l-purple-500">
                <pre>{activeChapter.exampleAscii}</pre>
              </div>
            </div>
          )}

          {/* Analogy Card */}
          {activeChapter.analogy && (
            <div className="bg-indigo-50/60 dark:bg-purple-950/30 border-l-4 border-l-indigo-600 dark:border-l-purple-500 border border-indigo-100 dark:border-purple-500/20 rounded-r-xl p-4 sm:p-5 text-slate-800 dark:text-slate-200 leading-relaxed space-y-1.5 shadow-xs reveal-on-scroll">
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "{activeChapter.analogy}"
              </p>
            </div>
          )}

          {/* Operations Groups (Section 2) */}
          {activeChapter.operationsGroups && (
            <div className="space-y-5 reveal-on-scroll">
              {activeChapter.operationsGroups.map((grp, gIdx) => (
                <div
                  key={gIdx}
                  className="p-5 bg-slate-50/80 dark:bg-[#0F1733] border border-slate-200 dark:border-purple-500/20 rounded-xl space-y-3"
                >
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {grp.groupTitle}
                    </h3>
                    {grp.groupSubtitle && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {grp.groupSubtitle}
                      </p>
                    )}
                  </div>
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    {grp.items.map((item, iIdx) => (
                      <li key={iIdx} className="flex items-center gap-2.5 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-purple-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Steps */}
          {activeChapter.steps && activeChapter.steps.length > 0 && (
            <div className="space-y-3 reveal-on-scroll">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono">
                Steps
              </span>
              <div className="space-y-2">
                {activeChapter.steps.map((step, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3 bg-slate-50 dark:bg-[#080D1F] border border-slate-200 dark:border-purple-500/20 rounded-xl text-sm text-slate-700 dark:text-slate-300 font-sans"
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Result Diagram */}
          {activeChapter.resultAscii && (
            <div className="space-y-2 reveal-on-scroll">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono">
                Result:
              </span>
              <div className="bg-[#F8FAFC] dark:bg-[#050816] text-[#111827] dark:text-cyan-300 p-4 rounded-xl text-xs sm:text-sm font-bold font-mono overflow-x-auto border border-[#E5E7EB] dark:border-purple-500/20 border-l-4 border-l-[#10B981] dark:border-l-emerald-500">
                <pre>{activeChapter.resultAscii}</pre>
              </div>
            </div>
          )}

          {/* Search Example Visual (Section 9) */}
          {activeChapter.searchExample && (
            <div className="space-y-3 reveal-on-scroll">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono">
                Example Walkthrough:
              </span>
              <div className="bg-[#F8FAFC] dark:bg-[#050816] text-[#111827] dark:text-cyan-300 p-3.5 rounded-xl text-xs sm:text-sm font-bold font-mono overflow-x-auto border border-[#E5E7EB] dark:border-purple-500/20">
                <pre>{activeChapter.searchExample.listAscii}</pre>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-[#080D1F] border border-slate-200 dark:border-purple-500/20 rounded-xl space-y-2 text-sm font-mono">
                <div className="text-indigo-600 dark:text-purple-400 font-bold">
                  {activeChapter.searchExample.query}
                </div>
                <div className="space-y-1 text-xs">
                  <div className="text-slate-500 dark:text-slate-400">We check:</div>
                  {activeChapter.searchExample.steps.map((st, sIdx) => (
                    <div
                      key={sIdx}
                      className={`flex items-center gap-2 font-bold ${
                        st.status === 'found'
                          ? 'text-emerald-600 dark:text-emerald-400 text-sm'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      <span>{st.label}</span>
                      <span>{st.status === 'found' ? '✓ Found' : '✗'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Display Example Visual (Section 10) */}
          {activeChapter.displayExample && (
            <div className="space-y-3 reveal-on-scroll">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono">
                Example Traversal:
              </span>
              <div className="bg-[#F8FAFC] dark:bg-[#050816] text-[#111827] dark:text-cyan-300 p-3.5 rounded-xl text-xs sm:text-sm font-bold font-mono overflow-x-auto border border-[#E5E7EB] dark:border-purple-500/20">
                <pre>{activeChapter.displayExample.listAscii}</pre>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-[#080D1F] border border-slate-200 dark:border-purple-500/20 rounded-xl space-y-1.5 text-sm font-mono">
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Output:</span>
                <div className="text-base font-black text-indigo-600 dark:text-cyan-300">
                  {activeChapter.displayExample.output}
                </div>
              </div>
            </div>
          )}

          {/* Code Implementations (C, Java, Python) */}
          {(activeChapter.cCode || activeChapter.javaCode || activeChapter.pythonCode) && (
            <div className="space-y-2 reveal-on-scroll">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono">
                Code Implementations (C / Java / Python)
              </span>
              <MultiLanguageCodeBlock
                cCode={activeChapter.cCode}
                javaCode={activeChapter.javaCode}
                pythonCode={activeChapter.pythonCode}
              />
            </div>
          )}

          {/* Time Complexity Badge / Card */}
          {activeChapter.timeComplexity && (
            <div className="p-4 bg-slate-50 dark:bg-[#080D1F] border border-slate-200 dark:border-purple-500/20 rounded-xl flex items-center justify-between gap-3 font-mono shadow-xs reveal-on-scroll">
              <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">
                Time Complexity:
              </span>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-indigo-50 dark:bg-purple-950/70 border border-indigo-200 dark:border-purple-500/40 text-indigo-700 dark:text-cyan-300 rounded-lg font-black text-sm">
                  {activeChapter.timeComplexity}
                </span>
                {activeChapter.timeComplexityNote && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                    {activeChapter.timeComplexityNote}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Time Complexities Table (Section 11) */}
          {activeChapter.tableData && (
            <div className="space-y-3 reveal-on-scroll">
              <div className="overflow-x-auto border border-slate-200 dark:border-purple-500/20 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left font-mono text-xs sm:text-sm">
                  <thead className="bg-slate-100 dark:bg-[#050816] text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-purple-500/20 uppercase text-[11px] font-bold">
                    <tr>
                      <th className="px-4 py-3">Operation</th>
                      <th className="px-4 py-3 text-right">Time Complexity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-purple-500/10 bg-white dark:bg-[#0B1228]">
                    {activeChapter.tableData.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-[#0F1733] transition-colors">
                        <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-sans font-medium">
                          {row.operation}
                        </td>
                        <td className="px-4 py-3 text-right font-black text-indigo-600 dark:text-cyan-300">
                          {row.complexity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Advantages List (Section 12) */}
          {activeChapter.advantages && (
            <div className="space-y-3 reveal-on-scroll">
              {activeChapter.advantages.map((adv) => (
                <div
                  key={adv.num}
                  className="p-4 bg-slate-50/80 dark:bg-[#0F1733] border border-slate-200 dark:border-purple-500/20 rounded-xl space-y-1"
                >
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-mono font-bold">
                      {adv.num}
                    </span>
                    <span>{adv.title}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 pl-8 leading-relaxed">
                    {adv.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Disadvantages List (Section 13) */}
          {activeChapter.disadvantages && (
            <div className="space-y-3 reveal-on-scroll">
              {activeChapter.disadvantages.map((dis) => (
                <div
                  key={dis.num}
                  className="p-4 bg-slate-50/80 dark:bg-[#0F1733] border border-slate-200 dark:border-purple-500/20 rounded-xl space-y-1.5"
                >
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 flex items-center justify-center text-xs font-mono font-bold">
                      {dis.num}
                    </span>
                    <span>{dis.title}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 pl-8 leading-relaxed">
                    {dis.desc}
                  </p>
                  {dis.diagram && (
                    <div className="ml-8 mt-2 p-3 bg-white dark:bg-[#050816] rounded-lg border border-slate-200 dark:border-purple-500/20 font-mono text-xs text-rose-600 dark:text-rose-300">
                      {dis.diagram}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Applications List (Section 14) */}
          {activeChapter.applications && (
            <div className="space-y-4 reveal-on-scroll">
              {activeChapter.applications.map((app) => (
                <div
                  key={app.num}
                  className="p-4 bg-slate-50/80 dark:bg-[#0F1733] border border-slate-200 dark:border-purple-500/20 rounded-xl space-y-2"
                >
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-purple-950/70 text-indigo-700 dark:text-purple-300 flex items-center justify-center text-xs font-mono font-bold">
                      {app.num}
                    </span>
                    <span>{app.title}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 pl-8 leading-relaxed">
                    {app.desc}
                  </p>
                  {app.diagram && (
                    <div className="ml-8 p-3 bg-white dark:bg-[#050816] text-[#111827] dark:text-cyan-300 rounded-lg border border-slate-200 dark:border-purple-500/20 font-mono text-xs overflow-x-auto">
                      <pre>{app.diagram}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Quick Revision (Section 15) */}
          {activeChapter.quickRevisionPoints && (
            <div className="space-y-4 reveal-on-scroll">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                {activeChapter.quickRevisionPoints.map((point, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-3 bg-slate-50 dark:bg-[#080D1F] border border-slate-200 dark:border-purple-500/20 rounded-xl flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200"
                  >
                    <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-purple-400 shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {activeChapter.quickRevisionDiagram && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono">
                    And the basic structure is always:
                  </span>
                  <div className="bg-[#F8FAFC] dark:bg-[#050816] text-[#111827] dark:text-cyan-300 p-4 rounded-xl text-xs sm:text-sm font-bold font-mono overflow-x-auto border border-[#E5E7EB] dark:border-purple-500/20 border-l-4 border-l-[#4F46E5] dark:border-l-purple-500">
                    <pre>{activeChapter.quickRevisionDiagram}</pre>
                  </div>
                </div>
              )}

              {activeChapter.quickRevisionConclusion && (
                <div className="p-4 bg-indigo-50/70 dark:bg-purple-950/40 border border-indigo-200 dark:border-purple-500/30 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                  <strong>The most important thing to understand:</strong> a singly linked list is simply a sequence of nodes where <strong>each node knows the address/reference of the next node</strong>.
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              BOTTOM NAVIGATION AND IDEMPOTENT COMPLETION ACTIONS
              ========================================================================= */}
          <div className="border-t border-slate-100 dark:border-purple-500/15 pt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Prev Button */}
              <button
                id="btn-prev-chapter"
                onClick={handlePrevChapter}
                disabled={activeChapterIndex === 0}
                className="btn-modern-secondary px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              {/* Idempotent Mark Completed Button */}
              <button
                id="btn-mark-chapter-completed"
                onClick={handleMarkCompleted}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isCurrentChapterCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 cursor-default'
                    : 'btn-modern-primary'
                }`}
              >
                <Check
                  className={`w-3.5 h-3.5 ${
                    isCurrentChapterCompleted
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-white'
                  }`}
                />
                <span>{isCurrentChapterCompleted ? 'Completed' : 'Mark Completed'}</span>
              </button>

              {/* Next Button */}
              {activeChapterIndex < THEORY_CHAPTERS.length - 1 ? (
                <button
                  id="btn-next-chapter"
                  onClick={handleNextChapter}
                  className="btn-modern-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  id="btn-complete-theory-to-game"
                  onClick={() => {
                    handleMarkCompleted();
                    onStartLevel(1);
                  }}
                  className="btn-modern-primary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Start Game Mode</span>
                </button>
              )}
            </div>

            {/* Interactive Try Button */}
            <button
              id="btn-try-visualize"
              onClick={() => {
                soundManager.playClick();
                onStartLevel(1);
              }}
              className="btn-modern-secondary px-4 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Practice in Game Mode</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LearnHashingSection;
