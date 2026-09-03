import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Play,
  Layers,
  Star,
  Timer as TimerIcon,
  Activity,
  Check,
  Zap,
  Info,
  Link as LinkIcon,
  PlusCircle,
  Trash2,
  Eye,
  Search,
  BookOpen,
  Award,
} from 'lucide-react';
import {
  SLLNode,
  SLLPointerState,
  SLLFeedback,
  SLLGameStateSnapshot,
  SLLActionModalType,
  SLLTaskDef,
  AssistanceMode,
} from '../../types/sllGame';
import { SLL_TASKS, LEVEL_TASK_IDS, LEVEL_METADATA } from '../../data/sllTasks';
import { SLLWorkspace } from './SLLWorkspace';
import { SLLInfoPanels } from './SLLInfoPanels';
import { SLLTaskPanel } from './SLLTaskPanel';
import { SLLBottomControls } from './SLLBottomControls';
import { SLLActionModal } from './SLLActionModal';
import { SLLHowItWorksModal } from './SLLHowItWorksModal';
import { SLLSolveWalkthrough } from './SLLSolveWalkthrough';
import { SLLMissionBoard } from './SLLMissionBoard';
import { validateTaskAnswer } from '../../utils/sllValidator';
import { soundManager } from '../../utils/audio';
import { progressManager } from '../../utils/progressManager';
import { Compass, X } from 'lucide-react';

interface SLLOperationGameScreenProps {
  taskId: string;
  onBackToMenu: () => void;
  onCompleteTask: (taskId: string, nextTaskId?: string) => void;
  onSelectLevel: (lvlId: number) => void;
  onSelectTask?: (taskId: string) => void;
  totalScore: number;
}

export const SLLOperationGameScreen: React.FC<SLLOperationGameScreenProps> = ({
  taskId,
  onBackToMenu,
  onCompleteTask,
  onSelectLevel,
  onSelectTask,
  totalScore,
}) => {
  const activeTask: SLLTaskDef = SLL_TASKS[taskId] || SLL_TASKS.L1_T1;
  const currentLevelId = activeTask.levelId;
  const levelTaskIds = LEVEL_TASK_IDS[currentLevelId] || [];
  const currentTaskIndex = levelTaskIds.indexOf(taskId);
  const nextTaskId = currentTaskIndex >= 0 && currentTaskIndex < levelTaskIds.length - 1 ? levelTaskIds[currentTaskIndex + 1] : undefined;

  // Assistance Mode: 'guide' | 'play' | 'solve'
  const [assistanceMode, setAssistanceMode] = useState<AssistanceMode>('guide');
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [showMissionBoard, setShowMissionBoard] = useState<boolean>(false);

  // Direct Workspace Interaction Modes
  const [pendingConnectFrom, setPendingConnectFrom] = useState<number | null>(null);
  const [isSettingHeadMode, setIsSettingHeadMode] = useState<boolean>(false);
  const [isSettingTailMode, setIsSettingTailMode] = useState<boolean>(false);

  // Local RAM State
  const [nodes, setNodes] = useState<SLLNode[]>(() => JSON.parse(JSON.stringify(activeTask.initialNodes)));
  const [pointers, setPointers] = useState<SLLPointerState>(() => JSON.parse(JSON.stringify(activeTask.initialPointers)));
  const [stagedNodes, setStagedNodes] = useState<SLLNode[]>(() => JSON.parse(JSON.stringify(activeTask.initialStagedNodes || [])));
  const [traversalOutput, setTraversalOutput] = useState<number[]>([]);
  const [isTraversing, setIsTraversing] = useState<boolean>(false);

  // Search state
  const [searchTarget, setSearchTarget] = useState<number | null>(40);
  const [searchResult, setSearchResult] = useState<'idle' | 'searching' | 'found' | 'not_found'>('idle');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchStepIndex, setSearchStepIndex] = useState<number>(0);

  // Traversal interactive state for Level 3
  const [currentTraversalAddress, setCurrentTraversalAddress] = useState<number | null>(null);

  // Undo / Redo History
  const [history, setHistory] = useState<SLLGameStateSnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<SLLGameStateSnapshot[]>([]);

  // Modals & Inspector
  const [activeModal, setActiveModal] = useState<SLLActionModalType>('NONE');
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [hintLevel, setHintLevel] = useState<number>(0);

  // Evaluation & HUD
  const [feedback, setFeedback] = useState<SLLFeedback | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(1);

  const clockTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset/Initialize task
  const resetTaskState = () => {
    const initialNodes = JSON.parse(JSON.stringify(activeTask.initialNodes));
    const initialPointers = JSON.parse(JSON.stringify(activeTask.initialPointers));
    const initialStaged = JSON.parse(JSON.stringify(activeTask.initialStagedNodes || []));

    setNodes(initialNodes);
    setPointers(initialPointers);
    setStagedNodes(initialStaged);
    setTraversalOutput([]);
    setIsTraversing(false);
    setSearchResult('idle');
    setIsSearching(false);
    setSearchStepIndex(0);
    setCurrentTraversalAddress(null);
    setSelectedAddress(null);
    setPendingConnectFrom(null);
    setIsSettingHeadMode(false);
    setIsSettingTailMode(false);
    setFeedback(null);
    setIsCompleted(false);
    setHintLevel(0);
    setHistory([]);
    setRedoStack([]);
  };

  useEffect(() => {
    resetTaskState();
  }, [taskId]);

  // Live Timer
  useEffect(() => {
    if (clockTimerRef.current) clearInterval(clockTimerRef.current);
    clockTimerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (clockTimerRef.current) clearInterval(clockTimerRef.current);
    };
  }, [taskId]);

  // Record Snapshot for Undo
  const pushSnapshot = () => {
    const snapshot: SLLGameStateSnapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      pointers: JSON.parse(JSON.stringify(pointers)),
      stagedNodes: JSON.parse(JSON.stringify(stagedNodes)),
      traversalOutput: [...traversalOutput],
      taskStepIndex: 0,
    };
    setHistory((prev) => [...prev, snapshot]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    const current: SLLGameStateSnapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      pointers: JSON.parse(JSON.stringify(pointers)),
      stagedNodes: JSON.parse(JSON.stringify(stagedNodes)),
      traversalOutput: [...traversalOutput],
      taskStepIndex: 0,
    };

    setRedoStack((prev) => [...prev, current]);
    setHistory((prev) => prev.slice(0, prev.length - 1));

    setNodes(previous.nodes);
    setPointers(previous.pointers);
    setStagedNodes(previous.stagedNodes);
    setTraversalOutput(previous.traversalOutput);
    setFeedback(null);
    soundManager.play('step');
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    const current: SLLGameStateSnapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      pointers: JSON.parse(JSON.stringify(pointers)),
      stagedNodes: JSON.parse(JSON.stringify(stagedNodes)),
      traversalOutput: [...traversalOutput],
      taskStepIndex: 0,
    };

    setHistory((prev) => [...prev, current]);
    setRedoStack((prev) => prev.slice(0, prev.length - 1));

    setNodes(nextState.nodes);
    setPointers(nextState.pointers);
    setStagedNodes(nextState.stagedNodes);
    setTraversalOutput(nextState.traversalOutput);
    setFeedback(null);
    soundManager.play('step');
  };

  // Node & Pointer Operations
  const handleCreateNode = (data: number, address: number, nextAddress: number | null) => {
    pushSnapshot();
    const newNode: SLLNode = {
      id: `node-${address}`,
      data,
      address,
      nextAddress,
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedAddress(address);
    soundManager.play('allocate');
    setFeedback({
      type: 'info',
      title: 'Node Allocated in Heap RAM',
      message: `Node [ DATA: ${data} | ADDR: ${address} | NEXT: ${nextAddress !== null ? nextAddress : 'NULL'} ] was placed in memory.`,
    });
  };

  const handleChangeNext = (fromAddress: number, toNextAddress: number | null) => {
    pushSnapshot();
    setNodes((prev) =>
      prev.map((n) => (n.address === fromAddress ? { ...n, nextAddress: toNextAddress } : n))
    );
    soundManager.play('link');
    setFeedback({
      type: 'info',
      title: 'NEXT Pointer Updated',
      message: `Node at Address ${fromAddress} now points to NEXT = ${toNextAddress !== null ? toNextAddress : 'NULL'}.`,
    });
  };

  const handleSetHead = (address: number | null) => {
    pushSnapshot();
    setPointers((prev) => ({ ...prev, headAddress: address }));
    soundManager.play('link');
    setFeedback({
      type: 'info',
      title: 'HEAD Pointer Updated',
      message: `HEAD pointer is now pointing to Address ${address !== null ? address : 'NULL'}.`,
    });
  };

  const handleSetTail = (address: number | null) => {
    pushSnapshot();
    setPointers((prev) => ({ ...prev, tailAddress: address }));
    soundManager.play('link');
    setFeedback({
      type: 'info',
      title: 'TAIL Pointer Updated',
      message: `TAIL pointer is now pointing to Address ${address !== null ? address : 'NULL'}.`,
    });
  };

  const handleDeleteNode = (address: number) => {
    pushSnapshot();
    setNodes((prev) => prev.filter((n) => n.address !== address));
    if (selectedAddress === address) setSelectedAddress(null);
    if (pointers.headAddress === address) setPointers((prev) => ({ ...prev, headAddress: null }));
    if (pointers.tailAddress === address) setPointers((prev) => ({ ...prev, tailAddress: null }));

    soundManager.play('free');
    setFeedback({
      type: 'info',
      title: 'Node Memory Deallocated (free)',
      message: `Node at Address ${address} has been freed from memory.`,
    });
  };

  // Direct Workspace Pointer Actions (No typing required)
  const handleSetHeadDirect = (address: number) => {
    pushSnapshot();
    setPointers((prev) => ({ ...prev, headAddress: address }));
    setIsSettingHeadMode(false);
    soundManager.play('link');
    setFeedback({
      type: 'info',
      title: 'HEAD Connected!',
      message: `HEAD pointer now points to Node at Address ${address}.`,
    });
  };

  const handleSetTailDirect = (address: number) => {
    pushSnapshot();
    setPointers((prev) => ({ ...prev, tailAddress: address }));
    setIsSettingTailMode(false);
    soundManager.play('link');
    setFeedback({
      type: 'info',
      title: 'TAIL Connected!',
      message: `TAIL pointer now points to Node at Address ${address}.`,
    });
  };

  const handleConnectNextDirect = (fromAddr: number, toAddr: number | null) => {
    pushSnapshot();
    setNodes((prev) =>
      prev.map((n) => (n.address === fromAddr ? { ...n, nextAddress: toAddr } : n))
    );
    setPendingConnectFrom(null);
    soundManager.play('link');
    setFeedback({
      type: 'info',
      title: 'Pointers Linked!',
      message: `Node ${fromAddr}'s NEXT pointer connects to ${toAddr !== null ? `Node ${toAddr}` : 'NULL'}.`,
    });
  };

  const handleInsertBetween = (prevAddr: number | null, nextAddr: number | null) => {
    setSelectedAddress(prevAddr);
    setActiveModal('CREATE_NODE');
  };

  // Assistance Mode switcher with penalty enforcement
  const handleSelectAssistanceMode = (mode: AssistanceMode) => {
    if (mode === 'solve' && assistanceMode !== 'solve') {
      // Penalty for full solve walkthrough: -20
      progressManager.addScore(-20);
      soundManager.play('click');
    }
    setAssistanceMode(mode);
  };

  const handleOpenHint = () => {
    // Penalty for hint: -5
    progressManager.addScore(-5);
    setActiveModal('HINT');
  };

  // Traversal Step Interaction (Level 3)
  const handleTraversalAnswer = (answer: string) => {
    pushSnapshot();
    if (pointers.currentAddress === null) {
      // Expecting HEAD
      if (answer === String(pointers.headAddress)) {
        const headNode = nodes.find((n) => n.address === pointers.headAddress);
        if (headNode) {
          setPointers((prev) => ({ ...prev, currentAddress: headNode.address }));
          setTraversalOutput([headNode.data]);
          soundManager.play('step');
          setFeedback({
            type: 'info',
            title: 'CURRENT Initialized to HEAD',
            message: `CURRENT = ${headNode.address}. Node data ${headNode.data} printed to stream.`,
          });
        }
      } else {
        soundManager.play('error');
        setFeedback({
          type: 'error',
          title: 'Incorrect Address',
          message: `Traversal must begin at HEAD (${pointers.headAddress}).`,
        });
      }
    } else {
      const curr = nodes.find((n) => n.address === pointers.currentAddress);
      if (!curr) return;

      if (curr.nextAddress === null) {
        if (answer.toUpperCase() === 'NULL') {
          setPointers((prev) => ({ ...prev, currentAddress: null }));
          soundManager.play('success');
          setIsCompleted(true);
          setFeedback({
            type: 'success',
            title: 'Traversal Reached NULL! 🎉',
            message: 'All elements printed in order to the output stream.',
          });
          progressManager.addScore(activeTask.xpReward);
        } else {
          soundManager.play('error');
          setFeedback({
            type: 'error',
            title: 'End of List',
            message: `Current node has NEXT = NULL. Enter "NULL" to finish.`,
          });
        }
      } else {
        if (answer === String(curr.nextAddress)) {
          const nextNode = nodes.find((n) => n.address === curr.nextAddress);
          if (nextNode) {
            setPointers((prev) => ({ ...prev, currentAddress: nextNode.address }));
            setTraversalOutput((prev) => [...prev, nextNode.data]);
            soundManager.play('step');
            setFeedback({
              type: 'info',
              title: 'CURRENT Advanced',
              message: `CURRENT moved to ${nextNode.address}. Outputted DATA: ${nextNode.data}.`,
            });
          }
        } else {
          soundManager.play('error');
          setFeedback({
            type: 'error',
            title: 'Wrong NEXT Address',
            message: `Node ${curr.address} stores NEXT = ${curr.nextAddress}. Look at the NEXT field.`,
          });
        }
      }
    }
  };

  // Search Step Interaction (Level 4 Task 4)
  const currentSearchNode = nodes.find((n) => n.address === pointers.currentAddress);
  const handleSearchAnswer = (isMatchAnswer: boolean) => {
    if (!currentSearchNode) return;
    const target = 40;
    const actualMatch = currentSearchNode.data === target;

    if (isMatchAnswer === actualMatch) {
      if (actualMatch) {
        setSearchResult('found');
        setIsCompleted(true);
        soundManager.play('success');
        setFeedback({
          type: 'success',
          title: 'Target Element 40 Found! 🎯',
          message: `Matched at Address ${currentSearchNode.address}! Search halts in O(k) steps.`,
        });
        progressManager.addScore(activeTask.xpReward);
      } else {
        // Advance to next
        if (currentSearchNode.nextAddress !== null) {
          setPointers((prev) => ({ ...prev, currentAddress: currentSearchNode.nextAddress }));
          soundManager.play('step');
          setFeedback({
            type: 'info',
            title: 'Advancing CURRENT',
            message: `${currentSearchNode.data} ≠ ${target}. Moving to Address ${currentSearchNode.nextAddress}.`,
          });
        }
      }
    } else {
      soundManager.play('error');
      setFeedback({
        type: 'error',
        title: 'Comparison Error',
        message: actualMatch
          ? `Current node data is ${currentSearchNode.data}, which matches ${target}!`
          : `Current node data is ${currentSearchNode.data}, which does not match ${target}.`,
      });
    }
  };

  // "CHECK ANSWER" Primary Validation
  const handleCheckAnswer = () => {
    setAttempts((prev) => prev + 1);
    const searchDone = isCompleted || searchResult === 'found';
    const result = validateTaskAnswer(activeTask, nodes, pointers, traversalOutput, searchDone);

    setFeedback(result.feedback);

    if (result.isValid) {
      soundManager.play('success');
      setIsCompleted(true);
      progressManager.addScore(activeTask.xpReward);
    } else {
      soundManager.play('error');
      // Penalty for wrong attempt: -10
      progressManager.addScore(-10);
    }
  };

  const handleNextTaskClick = () => {
    if (nextTaskId) {
      soundManager.play('click');
      onCompleteTask(taskId, nextTaskId);
    } else {
      // Completed level!
      soundManager.play('levelUp');
      onCompleteTask(taskId);
    }
  };

  const selectedNode = nodes.find((n) => n.address === selectedAddress) || null;

  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto w-full font-sans animate-chapter-switch">
      {/* 1. TOP HEADER HUD */}
      <div className="bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/25 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              soundManager.play('click');
              onBackToMenu();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-purple-950/60 border border-slate-200 dark:border-purple-500/30 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Levels</span>
          </button>

          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-purple-400 block">
              LEVEL 0{currentLevelId} • TASK #{activeTask.taskIndex}
            </span>
            <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white leading-tight">
              {activeTask.title}
            </h2>
          </div>
        </div>

        {/* Center: Assistance Mode Switcher & Concept Guide Button */}
        <div className="flex items-center gap-2">
          {/* 3-Mode Segmented Control: GUIDE | PLAY | SOLVE */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-[#070B19] border border-slate-200 dark:border-purple-500/20 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleSelectAssistanceMode('guide')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                assistanceMode === 'guide'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Guide Mode: Step-by-step pointers & visual cues (0 penalty)"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>GUIDE</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectAssistanceMode('play')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                assistanceMode === 'play'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Play Mode: Direct workspace manipulation"
            >
              <Play className="w-3.5 h-3.5" />
              <span>PLAY</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectAssistanceMode('solve')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                assistanceMode === 'solve'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Solve Walkthrough: Animated step-by-step solution (-20 penalty)"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>SOLVE</span>
            </button>
          </div>

          {/* Visual Concept Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsHowItWorksOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
            title="Learn how this linked list operation works visually"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Concept</span>
          </button>

          {/* Level 5 Master Mission Board Button */}
          {currentLevelId === 5 && (
            <button
              type="button"
              onClick={() => setShowMissionBoard(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 transition-colors cursor-pointer"
              title="View Master Mission Board"
            >
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Missions</span>
            </button>
          )}
        </div>

        {/* Right: HUD Stats */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-purple-500/20 text-slate-700 dark:text-slate-300 font-bold">
            <TimerIcon className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              {String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:
              {String(elapsedSeconds % 60).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-purple-500/20 text-amber-600 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{totalScore} XP</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-purple-500/20 text-slate-600 dark:text-slate-400 font-bold">
            <Activity className="w-3.5 h-3.5 text-indigo-500" />
            <span>Attempt #{attempts}</span>
          </div>
        </div>
      </div>

      {/* 2. FOUR INFORMATION PANELS */}
      <SLLInfoPanels
        task={activeTask}
        nodes={nodes}
        pointers={pointers}
        onOpenCreateNode={() => setActiveModal('CREATE_NODE')}
        onOpenChangeNext={() => setActiveModal('CHANGE_NEXT')}
        onOpenSetHead={() => setActiveModal('SET_HEAD')}
        onOpenSetTail={() => setActiveModal('SET_TAIL')}
        onOpenDeleteNode={() => setActiveModal('DELETE_NODE')}
      />

      {/* 3. MAIN GAMEPLAY BODY */}
      {assistanceMode === 'solve' ? (
        /* SOLVE MODE: Interactive Step-by-Step Solution Walkthrough */
        <div className="w-full">
          <SLLSolveWalkthrough
            task={activeTask}
            onExitSolve={() => setAssistanceMode('play')}
            onTryItYourself={() => setAssistanceMode('play')}
          />
        </div>
      ) : (
        /* STANDARD / GUIDE / PLAY MODE: Workspace + Task Panel */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Interactive RAM Workspace + Bottom Controls */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <SLLWorkspace
              nodes={nodes}
              pointers={pointers}
              stagedNodes={stagedNodes}
              traversalOutput={traversalOutput}
              searchTarget={searchTarget}
              searchResult={searchResult}
              selectedAddress={selectedAddress}
              onSelectNode={(addr) => setSelectedAddress(addr)}
              onOpenChangeNext={(addr) => {
                setSelectedAddress(addr);
                setActiveModal('CHANGE_NEXT');
              }}
              isTraversing={isTraversing}
              isSearching={isSearching}
              levelId={currentLevelId}
              // Direct interactive workspace props
              pendingConnectFrom={pendingConnectFrom}
              isSettingHeadMode={isSettingHeadMode}
              isSettingTailMode={isSettingTailMode}
              onSetHeadDirect={handleSetHeadDirect}
              onSetTailDirect={handleSetTailDirect}
              onConnectNextDirect={handleConnectNextDirect}
              onDeleteNodeDirect={handleDeleteNode}
              onInsertBetween={handleInsertBetween}
              guideTargetAddress={activeTask.targetCondition.expectedHead ?? undefined}
            />

            {/* Bottom Interactive Controls */}
            <SLLBottomControls
              onOpenCreateNode={() => setActiveModal('CREATE_NODE')}
              onOpenChangeNext={() => setActiveModal('CHANGE_NEXT')}
              onOpenSetHead={() => setActiveModal('SET_HEAD')}
              onOpenSetTail={() => setActiveModal('SET_TAIL')}
              onOpenDeleteNode={() => setActiveModal('DELETE_NODE')}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onResetTask={resetTaskState}
              onOpenHint={handleOpenHint}
              canUndo={history.length > 0}
              canRedo={redoStack.length > 0}
              nodeCount={nodes.length}
              isSettingHeadMode={isSettingHeadMode}
              isSettingTailMode={isSettingTailMode}
              pendingConnectFrom={pendingConnectFrom}
              onToggleSetHeadMode={() => setIsSettingHeadMode((prev) => !prev)}
              onToggleSetTailMode={() => setIsSettingTailMode((prev) => !prev)}
              onCancelDirectMode={() => {
                setIsSettingHeadMode(false);
                setIsSettingTailMode(false);
                setPendingConnectFrom(null);
              }}
            />
          </div>

          {/* Right Column: Task Instructions & Evaluation Panel */}
          <div className="lg:col-span-4">
            <SLLTaskPanel
              task={activeTask}
              nodes={nodes}
              pointers={pointers}
              selectedNode={selectedNode}
              onOpenCreateNode={() => setActiveModal('CREATE_NODE')}
              onOpenChangeNext={(addr) => {
                if (addr) setSelectedAddress(addr);
                setActiveModal('CHANGE_NEXT');
              }}
              onOpenSetHead={() => setActiveModal('SET_HEAD')}
              onOpenSetTail={() => setActiveModal('SET_TAIL')}
              onOpenDeleteNode={(addr) => {
                if (addr) setSelectedAddress(addr);
                setActiveModal('DELETE_NODE');
              }}
              onOpenHint={handleOpenHint}
              onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
              assistanceMode={assistanceMode}
              onSelectAssistanceMode={handleSelectAssistanceMode}
              onCheckAnswer={handleCheckAnswer}
              feedback={feedback}
              isCompleted={isCompleted}
              onNextTask={handleNextTaskClick}
              hasNextTask={Boolean(nextTaskId)}
              // Traversal props
              onTraversalAnswer={activeTask.targetCondition.customValidator === 'L3_TRAVERSAL_COMPLETE' ? handleTraversalAnswer : undefined}
              // Search props
              searchStepPrompt={
                (activeTask.targetCondition.customValidator === 'L4_SEARCH_COMPLETE' || activeTask.targetCondition.customValidator === 'L5_SEARCH_25') &&
                currentSearchNode
                  ? { currentData: currentSearchNode.data, targetData: 40 }
                  : null
              }
              onSearchAnswer={handleSearchAnswer}
            />
          </div>
        </div>
      )}

      {/* 4. MODAL DIALOGS FOR CREATING, EDITING & HINTS */}
      <SLLActionModal
        modalType={activeModal}
        onClose={() => setActiveModal('NONE')}
        nodes={nodes}
        pointers={pointers}
        activeTask={activeTask}
        selectedAddress={selectedAddress}
        onCreateNode={handleCreateNode}
        onChangeNext={handleChangeNext}
        onSetHead={handleSetHead}
        onSetTail={handleSetTail}
        onDeleteNode={handleDeleteNode}
        hintLevel={hintLevel}
        onAdvanceHint={() => setHintLevel((prev) => Math.min(2, prev + 1))}
      />

      {/* 5. CONCEPT GUIDE MODAL (SEE -> UNDERSTAND) */}
      <SLLHowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        info={activeTask.howItWorks}
        taskTitle={activeTask.title}
      />

      {/* 6. LEVEL 5 MISSION BOARD OVERLAY */}
      {showMissionBoard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs font-sans">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            className="bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/30 rounded-3xl p-5 sm:p-6 w-full max-w-2xl shadow-2xl overflow-hidden relative"
          >
            <button
              type="button"
              onClick={() => setShowMissionBoard(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <SLLMissionBoard
              currentTaskId={taskId}
              completedTaskIds={[]}
              onSelectMission={(missionId) => {
                if (onSelectTask) {
                  onSelectTask(missionId);
                }
                setShowMissionBoard(false);
              }}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};
