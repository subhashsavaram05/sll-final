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
  Code2,
} from 'lucide-react';
import {
  SLLNode,
  SLLPointerState,
  SLLFeedback,
  SLLGameStateSnapshot,
  SLLActionModalType,
  SLLTaskDef,
  AssistanceMode,
  SLLTeacherStep,
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
import { SLLTeacherBanner } from './SLLTeacherBanner';
import { SLLHowToPlayModal } from './SLLHowToPlayModal';
import {
  getNextTeacherStep,
  executeSingleTeacherStep,
  getTaskStep,
  getTaskTotalSteps,
  getAllTaskSteps,
} from '../../utils/sllStepAssistant';
import { validateTaskAnswer } from '../../utils/sllValidator';
import { soundManager } from '../../utils/audio';
import { progressManager } from '../../utils/progressManager';
import { Compass, X, Lightbulb } from 'lucide-react';

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

  // Assistance Mode: 'guide_solve' | 'play'
  const [assistanceMode, setAssistanceMode] = useState<AssistanceMode>('guide_solve');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [taskStatus, setTaskStatus] = useState<'in_progress' | 'completed'>('in_progress');
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [showMissionBoard, setShowMissionBoard] = useState<boolean>(false);
  const [teacherLastActionResult, setTeacherLastActionResult] = useState<string | null>(null);

  // Direct Workspace Interaction Modes
  const [pendingConnectFrom, setPendingConnectFrom] = useState<number | null>(null);
  const [isSettingHeadMode, setIsSettingHeadMode] = useState<boolean>(false);
  const [isSettingTailMode, setIsSettingTailMode] = useState<boolean>(false);
  const [isDeletingNodeMode, setIsDeletingNodeMode] = useState<boolean>(false);
  const [isConnectingNextMode, setIsConnectingNextMode] = useState<boolean>(false);

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
    setIsDeletingNodeMode(false);
    setIsConnectingNextMode(false);
    setFeedback(null);
    setIsCompleted(false);
    setHintLevel(0);
    setTeacherLastActionResult(null);
    setCurrentStep(1);
    setCompletedSteps([]);
    setTaskStatus('in_progress');
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
      currentStep,
      completedSteps: [...completedSteps],
      taskStatus,
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
      currentStep,
      completedSteps: [...completedSteps],
      taskStatus,
    };

    setRedoStack((prev) => [...prev, current]);
    setHistory((prev) => prev.slice(0, prev.length - 1));

    setNodes(previous.nodes);
    setPointers(previous.pointers);
    setStagedNodes(previous.stagedNodes);
    setTraversalOutput(previous.traversalOutput);
    if (previous.currentStep !== undefined) setCurrentStep(previous.currentStep);
    if (previous.completedSteps !== undefined) setCompletedSteps(previous.completedSteps);
    if (previous.taskStatus !== undefined) setTaskStatus(previous.taskStatus);
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
      currentStep,
      completedSteps: [...completedSteps],
      taskStatus,
    };

    setHistory((prev) => [...prev, current]);
    setRedoStack((prev) => prev.slice(0, prev.length - 1));

    setNodes(nextState.nodes);
    setPointers(nextState.pointers);
    setStagedNodes(nextState.stagedNodes);
    setTraversalOutput(nextState.traversalOutput);
    if (nextState.currentStep !== undefined) setCurrentStep(nextState.currentStep);
    if (nextState.completedSteps !== undefined) setCompletedSteps(nextState.completedSteps);
    if (nextState.taskStatus !== undefined) setTaskStatus(nextState.taskStatus);
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
    advanceStepIfActionMatches('create_node', address, data);
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
    advanceStepIfActionMatches('connect_next', fromAddress, toNextAddress);
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
    advanceStepIfActionMatches('set_head', address);
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
    advanceStepIfActionMatches('set_tail', address);
  };

  const handleDeleteNode = (address: number) => {
    pushSnapshot();
    setNodes((prev) =>
      prev
        .filter((n) => n.address !== address)
        .map((n) => (n.nextAddress === address ? { ...n, nextAddress: null } : n))
    );
    if (selectedAddress === address) setSelectedAddress(null);
    if (pointers.headAddress === address) setPointers((prev) => ({ ...prev, headAddress: null }));
    if (pointers.tailAddress === address) setPointers((prev) => ({ ...prev, tailAddress: null }));
    if (pendingConnectFrom === address) setPendingConnectFrom(null);
    setIsDeletingNodeMode(false);

    soundManager.play('free');
    setFeedback({
      type: 'info',
      title: 'Node Memory Deallocated (free)',
      message: `Node at Address ${address} has been freed from memory and all incoming pointers cleared.`,
    });
    advanceStepIfActionMatches('delete_node', address);
  };

  const handleNodeClickDirect = (address: number) => {
    if (isDeletingNodeMode) {
      handleDeleteNode(address);
    } else if (pendingConnectFrom && pendingConnectFrom !== address) {
      handleConnectNextDirect(pendingConnectFrom, address);
    } else if (isConnectingNextMode && pendingConnectFrom === null) {
      setPendingConnectFrom(address);
    } else if (isSettingHeadMode) {
      handleSetHeadDirect(address);
    } else if (isSettingTailMode) {
      handleSetTailDirect(address);
    } else {
      setSelectedAddress(address);
    }
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
    advanceStepIfActionMatches('set_head', address);
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
    advanceStepIfActionMatches('set_tail', address);
  };

  const handleConnectNextDirect = (fromAddr: number, toAddr: number | null) => {
    pushSnapshot();
    setNodes((prev) =>
      prev.map((n) => (n.address === fromAddr ? { ...n, nextAddress: toAddr } : n))
    );
    setPendingConnectFrom(null);
    setIsConnectingNextMode(false);
    soundManager.play('link');
    setFeedback({
      type: 'info',
      title: 'Pointers Linked!',
      message: `Node ${fromAddr}'s NEXT pointer connects to ${toAddr !== null ? `Node ${toAddr}` : 'NULL'}.`,
    });
    advanceStepIfActionMatches('connect_next', fromAddr, toAddr);
  };

  const handleInsertBetween = (prevAddr: number | null, nextAddr: number | null) => {
    setSelectedAddress(prevAddr);
    setActiveModal('CREATE_NODE');
  };

  // Quick Create Node handler for toolbar in RAM Heap Workspace
  const handleQuickCreateNode = () => {
    // 1. Determine next data value compatible with task
    let nextData = 10;
    if (activeTask.id === 'L1_T1') {
      if (!nodes.some((n) => n.data === 10)) {
        nextData = 10;
      } else if (!nodes.some((n) => n.data === 20)) {
        nextData = 20;
      } else {
        nextData = Math.max(...nodes.map((n) => n.data), 20) + 10;
      }
    } else if (
      activeTask.defaultInputValues?.data !== undefined &&
      !nodes.some((n) => n.data === Number(activeTask.defaultInputValues?.data))
    ) {
      nextData = Number(activeTask.defaultInputValues.data);
    } else {
      const existing = nodes.map((n) => n.data);
      const standardSequence = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      const candidate = standardSequence.find((val) => !existing.includes(val));
      nextData = candidate !== undefined ? candidate : (existing.length > 0 ? Math.max(...existing) + 10 : 10);
    }

    // 2. Determine unique memory address
    const existingAddrs = new Set(nodes.map((n) => n.address));
    let nextAddress = 1001;
    while (existingAddrs.has(nextAddress)) {
      nextAddress++;
    }

    handleCreateNode(nextData, nextAddress, null);
  };

  const handleToggleHeadMode = () => {
    setIsDeletingNodeMode(false);
    setIsConnectingNextMode(false);
    setPendingConnectFrom(null);
    setIsSettingTailMode(false);
    setIsSettingHeadMode((prev) => !prev);
  };

  const handleToggleTailMode = () => {
    setIsDeletingNodeMode(false);
    setIsConnectingNextMode(false);
    setPendingConnectFrom(null);
    setIsSettingHeadMode(false);
    setIsSettingTailMode((prev) => !prev);
  };

  const handleToggleNextMode = () => {
    setIsDeletingNodeMode(false);
    setIsSettingHeadMode(false);
    setIsSettingTailMode(false);
    if (isConnectingNextMode || pendingConnectFrom !== null) {
      setIsConnectingNextMode(false);
      setPendingConnectFrom(null);
    } else {
      setIsConnectingNextMode(true);
      if (selectedAddress !== null) {
        setPendingConnectFrom(selectedAddress);
      } else {
        setPendingConnectFrom(null);
      }
    }
  };

  const handleToggleDeleteMode = () => {
    setIsSettingHeadMode(false);
    setIsSettingTailMode(false);
    setIsConnectingNextMode(false);
    setPendingConnectFrom(null);
    setIsDeletingNodeMode((prev) => !prev);
  };

  const handleCancelDirectMode = () => {
    setIsSettingHeadMode(false);
    setIsSettingTailMode(false);
    setIsConnectingNextMode(false);
    setPendingConnectFrom(null);
    setIsDeletingNodeMode(false);
  };

  const handleSetNextToNull = () => {
    if (pendingConnectFrom !== null) {
      handleConnectNextDirect(pendingConnectFrom, null);
      setPendingConnectFrom(null);
      setIsConnectingNextMode(false);
    }
  };

  // Assistance Mode switcher: GUIDE & SOLVE vs PLAY
  const handleSelectAssistanceMode = (mode: AssistanceMode) => {
    soundManager.play('click');
    if (mode === 'play') {
      const hasSeen = localStorage.getItem('sll_has_seen_how_to_play');
      if (!hasSeen) {
        setIsHowToPlayOpen(true);
      }
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

  // Active Teacher Step for GUIDE & SOLVE mode (real sequential step state machine)
  const currentTeacherStep = getTaskStep(activeTask, currentStep, nodes, pointers);
  const totalTaskSteps = getTaskTotalSteps(activeTask);

  // Helper to advance the step machine on successful user action in PLAY mode
  const advanceStepIfActionMatches = (
    actionType: SLLTeacherStep['actionType'],
    targetAddr?: number | null,
    targetVal?: number | null
  ) => {
    if (taskStatus === 'completed' || isCompleted) return;
    const step = currentTeacherStep || getTaskStep(activeTask, currentStep, nodes, pointers);
    if (!step) return;

    let matched = false;
    if (step.actionType === actionType) {
      if (actionType === 'create_node') {
        matched = true;
      } else if (actionType === 'set_head' || actionType === 'set_tail') {
        matched = step.targetAddress === undefined || step.targetAddress === targetAddr;
      } else if (actionType === 'connect_next') {
        matched = step.targetAddress === undefined || step.targetAddress === targetAddr;
      } else if (actionType === 'delete_node') {
        matched = step.targetAddress === undefined || step.targetAddress === targetAddr;
      } else {
        matched = true;
      }
    }

    if (matched) {
      const stepJustFinished = currentStep;
      const newCompleted = [...new Set([...completedSteps, stepJustFinished])];
      setCompletedSteps(newCompleted);

      const isLastStep = stepJustFinished >= totalTaskSteps || step.isCompleted;
      if (isLastStep) {
        setTaskStatus('completed');
        setIsCompleted(true);
        soundManager.play('celebrate');
        progressManager.addScore(activeTask.xpReward);
        setFeedback({
          type: 'success',
          title: 'TASK COMPLETE! 🎉',
          message: 'All steps completed! You built the linked list correctly.',
          explanation: activeTask.conceptExplanation,
        });
      } else {
        const nextStepNum = stepJustFinished + 1;
        setCurrentStep(nextStepNum);
      }
    }
  };

  // TEACHER STEP: Executes exactly ONE logical action in the live workspace
  const handleExecuteTeacherStep = () => {
    if (taskStatus === 'completed' || isCompleted) return;

    const stepToExecute = currentTeacherStep || getTaskStep(activeTask, currentStep, nodes, pointers);
    if (!stepToExecute) return;

    pushSnapshot();
    const result = executeSingleTeacherStep(stepToExecute, {
      nodes,
      pointers,
      traversalOutput,
    });
    setNodes(result.nodes);
    setPointers(result.pointers);
    setTraversalOutput(result.traversalOutput);
    setTeacherLastActionResult(result.feedbackMessage);

    const stepJustFinished = currentStep;
    const newCompleted = [...new Set([...completedSteps, stepJustFinished])];
    setCompletedSteps(newCompleted);
    soundManager.play('link');

    // Check if task is finished
    const isLastStep = stepJustFinished >= totalTaskSteps || stepToExecute.isCompleted;

    if (isLastStep) {
      setTaskStatus('completed');
      setIsCompleted(true);
      soundManager.play('celebrate');
      progressManager.addScore(activeTask.xpReward);
      setFeedback({
        type: 'success',
        title: 'TASK COMPLETE! 🎉',
        message: result.feedbackMessage || 'All steps completed! You built the linked list correctly.',
        explanation: activeTask.conceptExplanation,
      });
    } else {
      const nextStepNum = stepJustFinished + 1;
      setCurrentStep(nextStepNum);
      const nextStepDef = getTaskStep(activeTask, nextStepNum, result.nodes, result.pointers);
      setFeedback({
        type: 'info',
        title: `✓ Step ${stepJustFinished} Completed!`,
        message: `${result.feedbackMessage} Next: Step ${nextStepNum} - ${nextStepDef?.title || 'Next step'}`,
      });
    }
  };
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

        {/* Center: Assistance Mode Switcher (Guide & Solve, Concept, Play) */}
        <div className="flex items-center gap-2">
          {/* Segmented Mode Switcher: GUIDE & SOLVE | CONCEPT */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-[#070B19] border border-slate-200 dark:border-purple-500/20 text-xs font-bold shadow-2xs">
            <button
              type="button"
              id="mode-guide-solve-btn"
              onClick={() => handleSelectAssistanceMode('guide_solve')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                assistanceMode === 'guide_solve' || assistanceMode === 'guide'
                  ? 'bg-[#FFF3E0] dark:bg-[#2A1D0D] border border-[#FDBA5A] dark:border-[#FDBA5A]/60 text-[#7C3F00] dark:text-[#FDBA5A] font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent'
              }`}
              title="Guide & Solve: Teaching instructions and step-by-step guidance"
            >
              <Lightbulb className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
              <span>GUIDE & SOLVE</span>
            </button>

            <button
              type="button"
              id="sll-concept-btn"
              onClick={() => handleSelectAssistanceMode('concept')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                assistanceMode === 'concept'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent'
              }`}
              title="Concept: Current Objective, Pointer Tools info, Pointer Rule, RAM Memory State"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>CONCEPT</span>
            </button>
          </div>

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

      {/* 2. CONDITIONAL VIEW: CONCEPT SECTION vs MAIN GAMEPLAY BODY */}
      {assistanceMode === 'concept' ? (
        <div id="sll-concept-section" className="flex flex-col gap-5 font-sans">
          {/* Concept Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-indigo-50/70 dark:bg-[#0B1228] border border-indigo-200 dark:border-purple-500/30 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-purple-300">
                    Concept & Educational Reference
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white dark:bg-purple-950/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-purple-500/30">
                    Task #{activeTask.taskIndex}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {activeTask.title} — Conceptual Foundations
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSelectAssistanceMode('guide_solve')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF3E0] hover:bg-[#FFE8C2] dark:bg-[#2A1D0D] dark:hover:bg-[#382611] border-2 border-[#FDBA5A] text-[#7C3F00] dark:text-[#FDBA5A] text-xs font-bold shadow-xs cursor-pointer transition-all"
              >
                <Lightbulb className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                <span>Guide & Solve</span>
              </button>
            </div>
          </div>

          {/* THE FOUR MOVED SECTIONS (Reference Only Mode) */}
          <SLLInfoPanels
            task={activeTask}
            nodes={nodes}
            pointers={pointers}
            isReferenceOnly={true}
          />

          {/* DEEP-DIVE CONCEPT: Visual Flow & Algorithm */}
          {activeTask.howItWorks && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* ASCII Diagram & Visual Pointer Flow */}
              <div className="lg:col-span-7 p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/25 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-purple-500/20">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-indigo-600 dark:text-purple-400" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                        Memory Pointer Flow Architecture
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">RAM Pointer Trace</span>
                  </div>

                  <div className="mt-3 p-3.5 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                    <pre className="whitespace-pre leading-relaxed font-semibold">
                      {activeTask.howItWorks.diagram}
                    </pre>
                  </div>

                  <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-amber-200">
                    <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                      <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Golden Rule to Remember</span>
                    </div>
                    <p className="text-xs leading-relaxed font-medium">
                      {activeTask.howItWorks.keyRule}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-[11px] text-slate-500 dark:text-slate-400">
                  Linked lists require explicit sequential pointer traversal. Breaking a link before updating it causes immediate memory disconnect.
                </p>
              </div>

              {/* Step-by-Step Algorithmic Logic */}
              <div className="lg:col-span-5 p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/25 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-purple-500/20">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                        Execution Steps Breakdown
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-purple-300">
                      {activeTask.howItWorks.steps.length} Steps
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {activeTask.howItWorks.steps.map((stepText, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-purple-500/20 flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-lg bg-indigo-100 dark:bg-purple-950 text-indigo-700 dark:text-purple-300 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="text-xs">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">{stepText}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-purple-500/20 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">Practice Now:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectAssistanceMode('guide_solve')}
                      className="px-3 py-1.5 rounded-xl bg-[#FFF3E0] hover:bg-[#FFE8C2] dark:bg-[#2A1D0D] dark:hover:bg-[#382611] border border-[#FDBA5A] text-[#7C3F00] dark:text-[#FDBA5A] text-xs font-bold cursor-pointer transition-all shadow-xs"
                    >
                      Return to Workspace
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* MAIN GAMEPLAY BODY: Reflowed directly without the 4 cards */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Interactive RAM Workspace + Teacher Assistant + Bottom Controls */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* GUIDE & SOLVE TEACHER BANNER: Teaches step & performs ONE step */}
            {(assistanceMode === 'guide_solve' || assistanceMode === 'guide') && (
            <SLLTeacherBanner
              step={currentTeacherStep}
              lastActionResult={teacherLastActionResult}
              onExecuteStep={handleExecuteTeacherStep}
              isTaskComplete={isCompleted || taskStatus === 'completed'}
              completedSteps={completedSteps}
              onNextTask={handleNextTaskClick}
              hasNextTask={Boolean(nextTaskId)}
            />
          )}

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
            isDeletingNodeMode={isDeletingNodeMode}
            isConnectingNextMode={isConnectingNextMode}
            onSetHeadDirect={handleSetHeadDirect}
            onSetTailDirect={handleSetTailDirect}
            onConnectNextDirect={handleConnectNextDirect}
            onDeleteNodeDirect={handleDeleteNode}
            onNodeClickDirect={handleNodeClickDirect}
            onInsertBetween={handleInsertBetween}
            guideTargetAddress={currentTeacherStep?.targetAddress ?? activeTask.targetCondition.expectedHead ?? undefined}
            // Integrated Workspace Pointer Toolbar props
            onCreateNode={handleQuickCreateNode}
            onOpenCreateNodeModal={() => setActiveModal('CREATE_NODE')}
            onToggleHeadMode={handleToggleHeadMode}
            onToggleTailMode={handleToggleTailMode}
            onToggleNextMode={handleToggleNextMode}
            onToggleDeleteMode={handleToggleDeleteMode}
            onCancelDirectMode={handleCancelDirectMode}
            onSetNextToNull={handleSetNextToNull}
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
            onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
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
            assistanceMode={assistanceMode}
            currentStep={currentStep}
            task={activeTask}
            nodes={nodes}
            pointers={pointers}
            onExecuteTeacherStep={handleExecuteTeacherStep}
          />
        </div>

          {/* Right Column: Task Instructions & Evaluation Panel */}
          <div className="lg:col-span-4">
            <SLLTaskPanel
              task={activeTask}
              nodes={nodes}
              pointers={pointers}
              selectedNode={selectedNode}
              currentStep={currentStep}
              completedSteps={completedSteps}
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

      {/* 7. HOW TO PLAY ONBOARDING MODAL (PLAY MODE) */}
      <SLLHowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => {
          setIsHowToPlayOpen(false);
          localStorage.setItem('sll_has_seen_how_to_play', 'true');
        }}
      />
    </div>
  );
};
