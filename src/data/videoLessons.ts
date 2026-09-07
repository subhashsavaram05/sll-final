export interface LessonItem {
  id: 'lesson-01' | 'lesson-02';
  lessonNumber: string;
  title: string;
  nowPlayingTitle: string;
  description: string;
  topics: string[];
  videoSrc: string;
  filename: string;
}

export const VIDEO_LESSONS: LessonItem[] = [
  {
    id: 'lesson-01',
    lessonNumber: 'LESSON 01',
    title: 'Introduction to Singly Linked List',
    nowPlayingTitle: 'Introduction to Singly Linked List',
    description: 'Learn the fundamentals of Singly Linked Lists, node structures, data payloads, and how the Head pointer links nodes into a dynamic sequence.',
    topics: [
      'Node Structure & Payload Storage',
      'Next Pointer Memory Connections',
      'Head Pointer & List Termination (null)',
      'Dynamic Non-Contiguous Allocation',
    ],
    videoSrc: '/videos/introduction.mp4',
    filename: 'introduction.mp4',
  },
  {
    id: 'lesson-02',
    lessonNumber: 'LESSON 02',
    title: 'Singly Linked List Operations',
    nowPlayingTitle: 'Singly Linked List Operations',
    description: 'Understand core Singly Linked List operations: insertion at beginning/end, node deletion, pointer rewiring, and sequential traversal.',
    topics: [
      'Insertion at Beginning & End',
      'Deleting First & Specific Nodes',
      'Sequential Traversal Mechanics',
      'Pointer Safety & Memory Deallocation',
    ],
    videoSrc: '/videos/collision.mp4',
    filename: 'collision.mp4',
  },
];
