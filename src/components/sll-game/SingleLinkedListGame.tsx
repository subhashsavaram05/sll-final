import React, { useState, useEffect } from 'react';
import { SLLOperationsMenu } from './SLLOperationsMenu';
import { SLLOperationGameScreen } from './SLLOperationGameScreen';
import { SLLLevelCompleteModal } from './SLLLevelCompleteModal';
import { LEVEL_TASK_IDS, LEVEL_METADATA } from '../../data/sllTasks';
import { progressManager } from '../../utils/progressManager';
import { soundManager } from '../../utils/audio';

interface SingleLinkedListGameProps {
  currentLevelId: number;
  onSelectLevel: (lvlId: number) => void;
  onOpenLab?: () => void;
  onOpenTheory?: () => void;
  onOpenQuiz?: () => void;
  onOpenProgress?: () => void;
}

export const SingleLinkedListGame: React.FC<SingleLinkedListGameProps> = ({
  currentLevelId,
  onSelectLevel,
  onOpenLab,
  onOpenTheory,
  onOpenQuiz,
  onOpenProgress,
}) => {
  // Navigation Flow State: 'menu' | 'task'
  const [viewMode, setViewMode] = useState<'menu' | 'task'>('menu');
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Completed tasks tracking
  const [completedTasks, setCompletedTasks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sll_completed_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [totalScore, setTotalScore] = useState<number>(() => progressManager.getState().totalScore);
  const [showLevelCompleteModal, setShowLevelCompleteModal] = useState<boolean>(false);

  // Save completed tasks to local storage
  useEffect(() => {
    try {
      localStorage.setItem('sll_completed_tasks', JSON.stringify(completedTasks));
    } catch (e) {
      console.error(e);
    }
  }, [completedTasks]);

  // When level tab changes, reset to menu
  useEffect(() => {
    setViewMode('menu');
    setActiveTaskId(null);
  }, [currentLevelId]);

  // Select a task to play
  const handleSelectTask = (taskId: string) => {
    setActiveTaskId(taskId);
    setViewMode('task');
  };

  // Back to task selection menu
  const handleBackToMenu = () => {
    setViewMode('menu');
    setActiveTaskId(null);
  };

  // On completing a task in the dedicated screen
  const handleCompleteTask = (taskId: string, nextTaskId?: string) => {
    setCompletedTasks((prev) => {
      if (!prev.includes(taskId)) {
        return [...prev, taskId];
      }
      return prev;
    });

    setTotalScore(progressManager.getState().totalScore);

    // Check if all tasks for the current level are completed
    const levelTaskList = LEVEL_TASK_IDS[currentLevelId] || [];
    const updatedCompleted = completedTasks.includes(taskId)
      ? completedTasks
      : [...completedTasks, taskId];

    const allLevelTasksDone = levelTaskList.every((id) => updatedCompleted.includes(id));

    if (allLevelTasksDone && !progressManager.getState().levelsCompleted.includes(currentLevelId)) {
      progressManager.markLevelCompleted(currentLevelId, 100, true);
      setShowLevelCompleteModal(true);
    }

    if (nextTaskId) {
      setActiveTaskId(nextTaskId);
      setViewMode('task');
    } else {
      setViewMode('menu');
      setActiveTaskId(null);
    }
  };

  const levelMeta = LEVEL_METADATA[currentLevelId] || LEVEL_METADATA[1];

  const levelTakeaways: Record<number, string[]> = {
    1: [
      'Nodes store DATA + NEXT address pointer in heap memory.',
      'Insert at Beginning: new_node.next = HEAD, then HEAD = new_node [O(1)].',
      'Insert at End: tail.next = new_node, then TAIL = new_node [O(1)].',
    ],
    2: [
      'Delete at Beginning: HEAD = HEAD.next, free old node [O(1)].',
      'Delete at End: Traverse to second-to-last node, set next = NULL, free last [O(N)].',
      'Always advance pointer before calling free() to avoid dangling pointer crash.',
    ],
    3: [
      'Single Linked Lists traverse in one forward direction from HEAD to NULL.',
      'CURRENT pointer advances via CURRENT = CURRENT.next.',
      'Traversal visits all N nodes in O(N) linear time.',
    ],
    4: [
      'Linear search examines elements sequentially starting from HEAD.',
      'Stops immediately upon finding matching DATA.',
      'Worst-case time complexity is O(N) when element is absent or at tail.',
    ],
    5: [
      'Demonstrated complete mastery of manual node allocation, pointer rewiring, deletions, search, and traversal.',
      'Maintained list structural integrity with zero memory leaks across 7 complex pointer manipulations.',
    ],
  };

  return (
    <div className="w-full">
      {viewMode === 'menu' || !activeTaskId ? (
        <SLLOperationsMenu
          currentLevelId={currentLevelId}
          onSelectLevel={onSelectLevel}
          onSelectTask={handleSelectTask}
          completedTasks={completedTasks}
          totalScore={totalScore}
        />
      ) : (
        <SLLOperationGameScreen
          taskId={activeTaskId}
          onBackToMenu={handleBackToMenu}
          onCompleteTask={handleCompleteTask}
          onSelectLevel={onSelectLevel}
          onSelectTask={(id) => setActiveTaskId(id)}
          totalScore={totalScore}
        />
      )}

      {/* Level Completion Celebration Modal */}
      {showLevelCompleteModal && (
        <SLLLevelCompleteModal
          levelId={currentLevelId}
          stars={3}
          scoreAwarded={100}
          onNextLevel={() => {
            setShowLevelCompleteModal(false);
            if (currentLevelId < 5) {
              onSelectLevel(currentLevelId + 1);
            } else {
              onSelectLevel(6);
            }
          }}
          onReplayLevel={() => {
            setShowLevelCompleteModal(false);
            setViewMode('menu');
          }}
          title={levelMeta.title}
          conceptsLearned={levelTakeaways[currentLevelId] || []}
        />
      )}
    </div>
  );
};
