import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  BookOpen,
  Gamepad2,
  Check,
  Star,
  Layers,
  ChevronRight,
  ListOrdered,
  Trophy,
  Home,
} from 'lucide-react';
import { progressManager } from '../utils/progressManager';
import { soundManager } from '../utils/audio';
import { useScrollReveal } from '../hooks/useScrollReveal';

export interface QuizViewProps {
  onNavigateToTheory: (chapterId?: string) => void;
  onNavigateToQuest: (levelId?: number) => void;
  onNavigateToProgress: () => void;
  onNavigateToHome?: () => void;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  correctAnswerText: string;
  explanation: string;
  exampleSnippet?: string;
  techniqueCode: string;
  targetChapterId?: string;
  targetLevelId?: number;
}

export interface StudentAnswerRecord {
  questionId: number;
  selectedOptionIndex: number;
  selectedAnswerText: string;
  correctOptionIndex: number;
  correctAnswerText: string;
  isCorrect: boolean;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is a single linked list?',
    options: [
      'A collection of nodes where each node points to the next node',
      'A collection of elements stored only in consecutive memory locations',
      'A collection of nodes where every node points to every other node',
      'A collection that can store only one data value',
    ],
    correctIndex: 0,
    correctAnswerText: 'A collection of nodes where each node points to the next node',
    explanation:
      'Correct! A single linked list consists of nodes, and each node stores data and a pointer to the next node.',
    techniqueCode: 'CORE-01',
    targetChapterId: 'theory-01',
    targetLevelId: 1,
  },
  {
    id: 2,
    question: 'What are the main parts of a node in a single linked list?',
    options: [
      'Data and a pointer to the next node',
      'Data and two pointers to previous nodes',
      'Only a data value',
      'Index and array size',
    ],
    correctIndex: 0,
    correctAnswerText: 'Data and a pointer to the next node',
    explanation:
      'Every node in a single linked list contains two main parts: the DATA component (holding the value) and the NEXT pointer (holding the address of the next node).',
    techniqueCode: 'CORE-02',
    targetChapterId: 'theory-01',
    targetLevelId: 1,
  },
  {
    id: 3,
    question: 'What does HEAD represent in a single linked list?',
    options: [
      'The first node of the linked list',
      'The last node of the linked list',
      'The middle node of the linked list',
      'The number of nodes in the linked list',
    ],
    correctIndex: 0,
    correctAnswerText: 'The first node of the linked list',
    explanation:
      'HEAD is the pointer pointing to the first node of the linked list. If HEAD is NULL, the list is empty. Also, the last node in the list has its NEXT pointer set to NULL.',
    techniqueCode: 'CORE-03',
    targetChapterId: 'theory-01',
    targetLevelId: 1,
  },
  {
    id: 4,
    question:
      'When inserting a new node at the beginning of a single linked list, what should be done first with the new node\'s NEXT pointer?',
    options: [
      'Point it to the current HEAD',
      'Set it permanently to NULL',
      'Point it to the TAIL',
      'Delete the current HEAD',
    ],
    correctIndex: 0,
    correctAnswerText: 'Point it to the current HEAD',
    explanation:
      'The NEXT pointer connects a node to the following node, so the new node must point to the current HEAD when inserting at the beginning (new_node.next = HEAD) before moving HEAD.',
    techniqueCode: 'INS-01',
    targetChapterId: 'theory-02',
    targetLevelId: 1,
  },
  {
    id: 5,
    question:
      'When inserting a new node at the end of a non-empty single linked list, where should the new node be connected?',
    options: [
      'After the current last node',
      'Before the current first node',
      'Between HEAD and the second node',
      'Before the current last node',
    ],
    correctIndex: 0,
    correctAnswerText: 'After the current last node',
    explanation:
      'To insert at the end, the new node is connected after the current last node by updating the last node\'s NEXT pointer to point to the new node (tail.next = new_node).',
    techniqueCode: 'INS-02',
    targetChapterId: 'theory-02',
    targetLevelId: 1,
  },
  {
    id: 6,
    question:
      'What happens to HEAD when the first node of a single linked list is deleted?',
    options: [
      'HEAD moves to the second node',
      'HEAD remains on the deleted node',
      'HEAD becomes the last node',
      'HEAD is always set to the previous node',
    ],
    correctIndex: 0,
    correctAnswerText: 'HEAD moves to the second node',
    explanation:
      'When deleting the first node, HEAD is updated to point to the second node (HEAD = HEAD.next), and the first node\'s memory is freed.',
    techniqueCode: 'DEL-01',
    targetChapterId: 'theory-03',
    targetLevelId: 2,
  },
  {
    id: 7,
    question:
      'To delete the last node of a single linked list, what should the previous node\'s NEXT pointer become?',
    options: [
      'NULL',
      'HEAD',
      'The deleted node\'s address',
      'The first node\'s DATA',
    ],
    correctIndex: 0,
    correctAnswerText: 'NULL',
    explanation:
      'To delete the last node, traverse to the second-to-last node and set its NEXT pointer to NULL, making it the new end of the list before freeing the old last node.',
    techniqueCode: 'DEL-02',
    targetChapterId: 'theory-03',
    targetLevelId: 2,
  },
  {
    id: 8,
    question: 'How does traversal normally proceed in a single linked list?',
    options: [
      'Start at HEAD and follow NEXT pointers until NULL',
      'Start at TAIL and follow PREVIOUS pointers',
      'Start at the middle and move randomly',
      'Start at HEAD and stop after the first node',
    ],
    correctIndex: 0,
    correctAnswerText: 'Start at HEAD and follow NEXT pointers until NULL',
    explanation:
      'Traversal starts at HEAD and follows NEXT pointers (CURRENT = CURRENT.next) sequentially node by node until reaching NULL.',
    techniqueCode: 'TRAV-01',
    targetChapterId: 'theory-04',
    targetLevelId: 3,
  },
  {
    id: 9,
    question: 'How is an element normally searched for in a single linked list?',
    options: [
      'Visit nodes one by one and compare their DATA values',
      'Check only the first node',
      'Check only the last node',
      'Access any node directly using an array index',
    ],
    correctIndex: 0,
    correctAnswerText: 'Visit nodes one by one and compare their DATA values',
    explanation:
      'Searching in a single linked list requires linear traversal: inspect each node\'s DATA starting from HEAD until the matching value is found or the list terminates at NULL.',
    techniqueCode: 'SEARCH-01',
    targetChapterId: 'theory-05',
    targetLevelId: 4,
  },
  {
    id: 10,
    question:
      'Consider this linked list:\n\nHEAD → [10 | 2002] → [20 | 2003] → [30 | NULL]\n\nIf a new node containing 5 is inserted at the beginning, what should the new structure be?',
    options: [
      'HEAD → [5 | 2001] → [10 | 2002] → [20 | 2003] → [30 | NULL]',
      'HEAD → [10 | 2002] → [5 | 2001] → [20 | 2003] → [30 | NULL]',
      'HEAD → [5 | NULL] → [10 | 2002] → [20 | 2003] → [30 | NULL]',
      'HEAD → [30 | NULL] → [20 | 2003] → [10 | 2002] → [5 | 2001]',
    ],
    correctIndex: 0,
    correctAnswerText:
      'HEAD → [5 | 2001] → [10 | 2002] → [20 | 2003] → [30 | NULL]',
    explanation:
      'When inserting node 5 at the beginning, new_node.next points to address 2001 (containing 10), and HEAD updates to point to the new node 5, resulting in HEAD → [5 | 2001] → [10 | 2002] → [20 | 2003] → [30 | NULL].',
    techniqueCode: 'MASTER-01',
    targetChapterId: 'theory-02',
    targetLevelId: 5,
  },
];

const QUIZ_STORAGE_ANSWERS_KEY = 'sll_quiz_answers_v1';
const QUIZ_STORAGE_SUBMITTED_KEY = 'sll_quiz_submitted_v1';

export const QuizView: React.FC<QuizViewProps> = ({
  onNavigateToTheory,
  onNavigateToQuest,
  onNavigateToProgress,
  onNavigateToHome,
}) => {
  useScrollReveal();

  // Load persisted student answers
  const [studentAnswers, setStudentAnswers] = useState<Record<number, StudentAnswerRecord>>(() => {
    try {
      const stored = localStorage.getItem(QUIZ_STORAGE_ANSWERS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return {};
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(() => {
    try {
      const storedSub = localStorage.getItem(QUIZ_STORAGE_SUBMITTED_KEY);
      if (storedSub !== null) {
        return storedSub === 'true';
      }
      return progressManager.getState().quizSubmitted || false;
    } catch {
      return false;
    }
  });

  // Subscribe to progressManager for reset synchronization
  useEffect(() => {
    const unsub = progressManager.subscribe((pState) => {
      if (!pState.quizSubmitted) {
        setIsSubmitted(false);
        try {
          const stored = localStorage.getItem(QUIZ_STORAGE_ANSWERS_KEY);
          if (!stored) {
            setStudentAnswers({});
          }
        } catch {
          // Ignore
        }
      }
    });
    return unsub;
  }, []);

  // Navigation within Quiz (0-indexed current question)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  // Temporary selection before confirming/submitting the question
  const [pendingSelection, setPendingSelection] = useState<number | null>(null);
  // Optional collapsible detailed question breakdown
  const [showDetailedReview, setShowDetailedReview] = useState<boolean>(false);

  // Current question helper
  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex] || QUIZ_QUESTIONS[0];
  const currentAnswerRecord = studentAnswers[currentQuestion.id];
  const isCurrentQuestionAnswered = currentAnswerRecord !== undefined;

  // Synchronize selection with current question record
  useEffect(() => {
    if (currentAnswerRecord !== undefined) {
      setPendingSelection(currentAnswerRecord.selectedOptionIndex);
    } else {
      setPendingSelection(null);
    }
  }, [currentQuestionIndex, currentAnswerRecord]);

  // Persist answers to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(QUIZ_STORAGE_ANSWERS_KEY, JSON.stringify(studentAnswers));
    } catch {
      // Ignore storage errors
    }
  }, [studentAnswers]);

  // Calculate score deterministically from stored answers
  const { score, totalQuestions, percentage } = useMemo(() => {
    let correct = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      const rec = studentAnswers[q.id];
      if (rec && rec.isCorrect) {
        correct++;
      }
    });
    const total = QUIZ_QUESTIONS.length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    return {
      score: correct,
      totalQuestions: total,
      percentage: pct,
      correctAnswersCount: correct,
    };
  }, [studentAnswers]);

  // Handle student selecting an option (before or during answering)
  const handleSelectOption = (optionIndex: number) => {
    if (isCurrentQuestionAnswered && isSubmitted) return;
    soundManager.playQuizSelect();
    setPendingSelection(optionIndex);
  };

  // Handle confirming answer for current question (Records answer without revealing final result screen)
  const handleConfirmAnswer = () => {
    if (pendingSelection === null || isCurrentQuestionAnswered) return;

    const q = currentQuestion;
    const isCorrect = pendingSelection === q.correctIndex;
    const selectedText = q.options[pendingSelection] || '';

    const newRecord: StudentAnswerRecord = {
      questionId: q.id,
      selectedOptionIndex: pendingSelection,
      selectedAnswerText: selectedText,
      correctOptionIndex: q.correctIndex,
      correctAnswerText: q.correctAnswerText,
      isCorrect,
    };

    const updatedAnswers = {
      ...studentAnswers,
      [q.id]: newRecord,
    };

    setStudentAnswers(updatedAnswers);

    // Play appropriate interaction sound
    if (isCorrect) {
      soundManager.playQuizCorrect();
    } else {
      soundManager.playQuizWrong();
    }
  };

  // Handle submitting the entire examination ONLY when user clicks "Complete & Review"
  const handleSubmitExamination = () => {
    // If pending selection on current question is not saved yet, save it
    const updatedAnswers = { ...studentAnswers };
    if (pendingSelection !== null && !updatedAnswers[currentQuestion.id]) {
      const q = currentQuestion;
      const isCorrect = pendingSelection === q.correctIndex;
      const selectedText = q.options[pendingSelection] || '';
      const newRecord: StudentAnswerRecord = {
        questionId: q.id,
        selectedOptionIndex: pendingSelection,
        selectedAnswerText: selectedText,
        correctOptionIndex: q.correctIndex,
        correctAnswerText: q.correctAnswerText,
        isCorrect,
      };
      updatedAnswers[q.id] = newRecord;
      setStudentAnswers(updatedAnswers);
    }

    const totalAnswered = Object.keys(updatedAnswers).length;
    if (totalAnswered < QUIZ_QUESTIONS.length) {
      soundManager.playError();
      const firstUnansweredIndex = QUIZ_QUESTIONS.findIndex((quest) => updatedAnswers[quest.id] === undefined);
      if (firstUnansweredIndex >= 0) {
        setCurrentQuestionIndex(firstUnansweredIndex);
      }
      return;
    }

    setIsSubmitted(true);
    try {
      localStorage.setItem(QUIZ_STORAGE_SUBMITTED_KEY, 'true');
    } catch {
      // Ignore storage errors
    }

    // Calculate final correct score
    let calculatedCorrect = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      const rec = updatedAnswers[q.id];
      if (rec && rec.isCorrect) calculatedCorrect++;
    });

    // Synchronize with progressManager
    const rawScoresMap: Record<number, number> = {};
    (Object.values(updatedAnswers) as StudentAnswerRecord[]).forEach((rec) => {
      rawScoresMap[rec.questionId] = rec.selectedOptionIndex;
    });

    progressManager.recordQuizCompletion(rawScoresMap, calculatedCorrect, QUIZ_QUESTIONS.length);

    if (calculatedCorrect >= 6) {
      soundManager.playQuizComplete();
    } else {
      soundManager.playQuizWrong();
    }
  };

  // Handle resetting the quiz completely
  const handleResetQuiz = () => {
    soundManager.playReset();
    setStudentAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
    setPendingSelection(null);
    setShowDetailedReview(false);

    try {
      localStorage.removeItem(QUIZ_STORAGE_ANSWERS_KEY);
      localStorage.setItem(QUIZ_STORAGE_SUBMITTED_KEY, 'false');
    } catch {
      // Ignore
    }

    progressManager.resetQuizAttempt();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const answeredCount = Object.keys(studentAnswers).length;

  // Dynamic mastery assessment according to score percentage:
  // 90% - 100% = OUTSTANDING MASTERY (GRADE A+)
  // 80% - 89% = EXCELLENT PERFORMANCE (GRADE A)
  // 70% - 79% = GOOD PROGRESS (GRADE B)
  // 60% - 69% = KEEP PRACTICING (GRADE C)
  // Below 60% = NEEDS MORE PRACTICE
  const masteryAssessment = useMemo(() => {
    if (percentage >= 90) {
      return {
        badgeText: 'OUTSTANDING MASTERY (GRADE A+)',
        badgeClass:
          'border border-emerald-300/80 dark:border-emerald-500/40 bg-[#E6F8F0] dark:bg-emerald-950/50 text-[#008A54] dark:text-emerald-300',
        message:
          'Outstanding work! You demonstrated thorough command of Singly Linked List concepts, node connections, and algorithmic operations.',
        trophyBg: 'bg-[#00A86B] dark:bg-emerald-600',
      };
    }
    if (percentage >= 80) {
      return {
        badgeText: 'EXCELLENT PERFORMANCE (GRADE A)',
        badgeClass:
          'border border-blue-300/80 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300',
        message:
          'Excellent work! You demonstrated strong understanding of Singly Linked List concepts and operations.',
        trophyBg: 'bg-[#00A86B] dark:bg-emerald-600',
      };
    }
    if (percentage >= 70) {
      return {
        badgeText: 'GOOD PROGRESS (GRADE B)',
        badgeClass:
          'border border-sky-300/80 dark:border-sky-500/40 bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300',
        message:
          'Good progress! You have a solid grasp of core Singly Linked List fundamentals with just a few details to polish.',
        trophyBg: 'bg-[#00A86B] dark:bg-emerald-600',
      };
    }
    if (percentage >= 60) {
      return {
        badgeText: 'KEEP PRACTICING (GRADE C)',
        badgeClass:
          'border border-amber-300/80 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300',
        message:
          'Good effort! Keep practicing node pointer manipulation, insertion, and deletion steps to build complete mastery.',
        trophyBg: 'bg-[#00A86B] dark:bg-emerald-600',
      };
    }
    return {
      badgeText: 'NEEDS MORE PRACTICE',
      badgeClass:
        'border border-rose-300/80 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300',
      message:
        'Needs more practice! Review the Singly Linked List theory guide and try the interactive levels to reinforce your knowledge.',
      trophyBg: 'bg-[#00A86B] dark:bg-emerald-600',
    };
  }, [percentage]);

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-4 font-sans text-slate-900 dark:text-white animate-page-enter">
      {/* If quiz is submitted, show the dedicated QUIZ ASSESSMENT COMPLETED screen */}
      {isSubmitted ? (
        <div className="w-full max-w-2xl mx-auto space-y-6">
          <div
            id="quiz-result-card"
            className="p-6 sm:p-10 lg:p-12 bg-white dark:bg-[#0B1228] border border-slate-200/90 dark:border-blue-900/30 rounded-3xl flex flex-col items-center justify-center text-center shadow-lg dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] animate-editorial-scale transition-all"
          >
            {/* Top row: Trophy Icon & Mastery Badge */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3.5 mb-5">
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0 ${masteryAssessment.trophyBg}`}
              >
                <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[2.2]" />
              </div>

              <div
                className={`inline-flex items-center justify-center px-4 py-2 rounded-full font-mono text-xs sm:text-sm font-bold tracking-wider uppercase ${masteryAssessment.badgeClass}`}
              >
                <span>★ {masteryAssessment.badgeText} ★</span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B192C] dark:text-white tracking-tight uppercase mb-2 sm:mb-3">
              QUIZ ASSESSMENT COMPLETED
            </h1>

            {/* Dynamic performance message */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed font-normal mb-7 sm:mb-8">
              {masteryAssessment.message}
            </p>

            {/* Large Highlighted Score Card */}
            <div className="w-full max-w-lg mx-auto p-6 sm:p-8 rounded-2xl border border-indigo-200/80 dark:border-blue-500/30 bg-white dark:bg-[#080D1F] shadow-xs flex flex-col items-center justify-center text-center">
              <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.2em] uppercase text-indigo-600 dark:text-blue-400 mb-2">
                FINAL HIGHLIGHTED SCORE
              </span>
              <div className="text-6xl sm:text-7xl lg:text-8xl font-black font-sans tracking-tight text-emerald-500 dark:text-emerald-400 my-2 leading-none">
                {percentage}%
              </div>
              <div className="mt-2 px-5 py-1.5 rounded-full bg-slate-50 dark:bg-[#0B1228] border border-slate-200 dark:border-blue-900/40 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                {score} / {totalQuestions} Questions Correct
              </div>
            </div>

            {/* 3 Statistic Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg mx-auto mt-6 mb-8">
              {/* Correct */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#080D1F] border border-slate-200/90 dark:border-blue-900/30 shadow-2xs flex flex-col items-center justify-center text-center">
                <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-1">
                  CORRECT
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#00A86B] dark:text-emerald-400 flex items-center justify-center gap-1.5">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                  <span>{score}</span>
                </span>
              </div>

              {/* Incorrect */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#080D1F] border border-slate-200/90 dark:border-blue-900/30 shadow-2xs flex flex-col items-center justify-center text-center">
                <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-1">
                  INCORRECT
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-500 dark:text-rose-400">
                  {totalQuestions - score}
                </span>
              </div>

              {/* Accuracy */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#080D1F] border border-slate-200/90 dark:border-blue-900/30 shadow-2xs flex flex-col items-center justify-center text-center">
                <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-1">
                  ACCURACY
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                  {percentage}%
                </span>
              </div>
            </div>

            {/* Bottom Two Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full max-w-md mx-auto">
              <button
                id="btn-quiz-retake"
                type="button"
                onClick={handleResetQuiz}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/25 dark:shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <RotateCcw className="w-4 h-4 stroke-[2.2]" />
                <span>Retake Quiz</span>
              </button>

              <button
                id="btn-quiz-back-home"
                type="button"
                onClick={() => {
                  soundManager.playNav();
                  if (onNavigateToHome) {
                    onNavigateToHome();
                  } else {
                    onNavigateToTheory('theory-01');
                  }
                }}
                className="px-6 py-3 rounded-xl bg-white dark:bg-[#080D1F] border border-slate-200/90 dark:border-blue-900/40 hover:bg-slate-50 dark:hover:bg-[#0F1733] text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm shadow-2xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <Home className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>Back to Home</span>
              </button>
            </div>

            {/* Question Breakdown Toggle */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-blue-900/20 w-full text-center">
              <button
                id="btn-quiz-toggle-review"
                type="button"
                onClick={() => {
                  soundManager.playNav();
                  setShowDetailedReview((prev) => !prev);
                }}
                className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-blue-400 hover:text-indigo-700 dark:hover:text-blue-300 inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <ListOrdered className="w-4 h-4" />
                <span>{showDetailedReview ? 'Hide Question Explanations' : 'Review Questions & Explanations (10)'}</span>
              </button>
            </div>
          </div>

          {/* Full Question Review Breakdown (when expanded) */}
          {showDetailedReview && (
            <div id="quiz-question-overview-section" className="space-y-6 pt-2 animate-page-enter">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-blue-900/25">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
                  <ListOrdered className="w-5 h-5 text-indigo-600 dark:text-blue-400" />
                  <span>Full Question-by-Question Review</span>
                </h3>
                <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold font-mono">
                  {score} of {totalQuestions} Correct
                </span>
              </div>

              {/* 10 Question Review Cards */}
              <div className="space-y-5">
                {QUIZ_QUESTIONS.map((q, idx) => {
                  const rec = studentAnswers[q.id];
                  const isCorrect = rec?.isCorrect || false;
                  const cleanQuestionText = q.question.replace(/^\d+\.\s*/, '');
                  const questionNumberStr = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;

                  return (
                    <div
                      key={q.id}
                      id={`quiz-review-card-${q.id}`}
                      className={`p-6 sm:p-7 rounded-[22px] sm:rounded-[24px] bg-white dark:bg-[#0B1228] transition-all shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] ${
                        isCorrect
                          ? 'border-2 border-emerald-400 dark:border-emerald-500/50'
                          : 'border-2 border-rose-300 dark:border-rose-500/50'
                      }`}
                    >
                      {/* Top Header: Badge + Identifier (Left) & Status Badge (Right) */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="px-3 py-1 bg-[#2563EB] dark:bg-blue-600 text-white rounded-full text-xs font-bold font-mono tracking-wide shadow-xs inline-flex items-center justify-center">
                            Question {questionNumberStr}
                          </span>
                          <span className="text-xs font-bold text-[#2563EB] dark:text-blue-300 font-mono tracking-wider">
                            {q.techniqueCode}
                          </span>
                        </div>

                        <div>
                          {isCorrect ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E6F8F0] dark:bg-emerald-950/60 border border-[#00A86B]/30 dark:border-emerald-500/30 text-[#008A54] dark:text-emerald-300 rounded-lg text-xs font-bold font-sans">
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Correct</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-bold font-sans">
                              <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Incorrect</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Question Statement */}
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-3.5 mb-4 leading-snug break-words whitespace-pre-line">
                        {cleanQuestionText}
                      </h4>

                      {/* Submission and Correct Answer Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                        {/* Left: Your Submission */}
                        <div
                          className={`p-3.5 sm:p-4 rounded-xl border ${
                            isCorrect
                              ? 'bg-[#E8FAF0] dark:bg-emerald-950/40 border-[#A7F3D0] dark:border-emerald-500/30'
                              : 'bg-[#FEECEB] dark:bg-rose-950/40 border-rose-200 dark:border-rose-500/30'
                          }`}
                        >
                          <div
                            className={`text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase mb-1.5 font-sans ${
                              isCorrect ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
                            }`}
                          >
                            YOUR SUBMISSION:
                          </div>
                          <div className="font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 break-words">
                            {rec
                              ? `${String.fromCharCode(65 + rec.selectedOptionIndex)}: ${rec.selectedAnswerText}`
                              : 'No Answer Submitted'}
                          </div>
                        </div>

                        {/* Right: Correct Answer */}
                        <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-blue-900/30 bg-[#F8FAFC] dark:bg-[#070B18]">
                          <div className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1.5 font-sans">
                            CORRECT ANSWER:
                          </div>
                          <div className="font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 break-words">
                            {String.fromCharCode(65 + q.correctIndex)}: {q.correctAnswerText}
                          </div>
                        </div>
                      </div>

                      {/* Technical Explanation Panel */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#070B18] border border-slate-200 dark:border-blue-900/25 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs sm:text-sm mb-2">
                          <HelpCircle className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
                          <span>Technical Explanation:</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-3 font-normal">
                          {q.explanation}
                        </p>

                        {q.exampleSnippet && (
                          <div className="mb-3 p-2.5 bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-blue-900/40 rounded-lg font-mono text-xs text-[#1D4ED8] dark:text-blue-300 font-semibold">
                            Example: {q.exampleSnippet}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                          {q.targetChapterId && (
                            <button
                              onClick={() => {
                                soundManager.playNav();
                                onNavigateToTheory(q.targetChapterId);
                              }}
                              className="text-[#2563EB] dark:text-blue-400 hover:text-[#1D4ED8] dark:hover:text-blue-300 font-semibold text-xs inline-flex items-center gap-1.5 hover:underline cursor-pointer"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>Review in Theory Guide →</span>
                            </button>
                          )}
                          {q.targetLevelId && (
                            <button
                              onClick={() => {
                                soundManager.playNav();
                                onNavigateToQuest(q.targetLevelId);
                              }}
                              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold text-xs inline-flex items-center gap-1.5 hover:underline cursor-pointer"
                            >
                              <Gamepad2 className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                              <span>Practice in Quest Level {q.targetLevelId} →</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Header Banner for active quiz taking */}
          <div className="border border-slate-200 dark:border-blue-900/30 rounded-2xl pb-6 mb-6 bg-white dark:bg-[#0B1228] p-6 sm:p-8 shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] reveal-on-scroll">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFF6FF] dark:bg-blue-950/60 border border-[#BFDBFE] dark:border-blue-500/30 text-[#2563EB] dark:text-blue-300 rounded-lg text-xs font-semibold uppercase tracking-wider font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                <span>KNOWLEDGE ASSESSMENT</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Single Linked List Quiz (10 Questions)
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight animate-heading-enter">
              Single Linked List Knowledge Check
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Test your understanding of nodes, pointers, traversal, insertion, deletion, searching, and the basic operations of a single linked list.
            </p>

            {/* Question Index Tabs / Progress Tracker */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-blue-900/20">
              <div className="flex items-center justify-between gap-2 mb-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                  <span>
                    Progress: <strong className="text-[#2563EB] dark:text-blue-300 font-mono">{answeredCount}</strong> / {totalQuestions} Answered
                  </span>
                </div>
              </div>

              {/* Question Index Pills */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                {QUIZ_QUESTIONS.map((q, idx) => {
                  const rec = studentAnswers[q.id];
                  const isAnswered = rec !== undefined;
                  const isCurrent = currentQuestionIndex === idx;

                  let pillStyle = 'bg-slate-50 dark:bg-[#080D1F] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-blue-900/30 hover:bg-slate-100 dark:hover:bg-[#0F1733]';
                  if (isCurrent) {
                    pillStyle = 'bg-[#2563EB] dark:bg-blue-600 text-white border-[#2563EB] dark:border-blue-500 font-bold shadow-xs dark:shadow-[0_0_12px_rgba(37,99,235,0.4)]';
                  } else if (isAnswered) {
                    if (rec.isCorrect) {
                      pillStyle = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30 font-semibold';
                    } else {
                      pillStyle = 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-500/30 font-semibold';
                    }
                  }

                  return (
                    <button
                      key={q.id}
                      id={`btn-quiz-jump-${q.id}`}
                      onClick={() => {
                        soundManager.playNav();
                        setCurrentQuestionIndex(idx);
                      }}
                      className={`py-2 text-center text-xs font-mono rounded-lg border transition-all cursor-pointer ${pillStyle}`}
                      title={`Question ${idx + 1}`}
                    >
                      <span>Q{idx + 1}</span>
                      {isAnswered && (
                        <span className="block text-[10px] leading-tight mt-0.5">
                          {rec.isCorrect ? '✓' : '✕'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Taking the Quiz: Step-by-Step Question Flow (Questions 1 to 10) */}
          <div className="space-y-6">
          <div
            key={currentQuestion.id}
            id={`quiz-step-card-${currentQuestion.id}`}
            className={`p-6 sm:p-8 border rounded-2xl transition-all bg-white dark:bg-[#0B1228] shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] animate-chapter-switch ${
              isCurrentQuestionAnswered
                ? currentAnswerRecord?.isCorrect
                  ? 'border-emerald-300 dark:border-emerald-500/40 ring-1 ring-emerald-200 dark:ring-emerald-500/30'
                  : 'border-rose-300 dark:border-rose-500/40 ring-1 ring-rose-200 dark:ring-rose-500/30'
                : 'border-slate-200 dark:border-blue-900/30'
            }`}
          >
            {/* Question Header */}
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-blue-900/20">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-[#2563EB] dark:bg-blue-600 text-white rounded-md text-xs font-bold font-mono shadow-xs">
                  Question {currentQuestionIndex + 1 < 10 ? `0${currentQuestionIndex + 1}` : currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <span className="text-xs font-semibold text-[#2563EB] dark:text-blue-300 font-mono">{currentQuestion.techniqueCode}</span>
              </div>

              {isCurrentQuestionAnswered && (
                <div>
                  {currentAnswerRecord?.isCorrect ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 rounded-lg">
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Correct</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-950/60 text-xs font-bold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 rounded-lg">
                      <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                      <span>Incorrect</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Question Statement */}
            <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-6 leading-snug break-words whitespace-pre-line">
              {currentQuestion.question}
            </p>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((opt, optIdx) => {
                const isSelected = pendingSelection === optIdx;
                let optStyle =
                  'bg-white dark:bg-[#080D1F] border-slate-200 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-[#0F1733] text-slate-800 dark:text-slate-200';

                if (isCurrentQuestionAnswered) {
                  if (optIdx === currentQuestion.correctIndex) {
                    optStyle =
                      'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-bold ring-2 ring-emerald-400 dark:ring-emerald-500/40';
                  } else if (isSelected && !currentAnswerRecord?.isCorrect) {
                    optStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-950 dark:text-rose-200 font-bold';
                  } else {
                    optStyle = 'bg-white dark:bg-[#080D1F] opacity-40 border-slate-200 dark:border-blue-900/20 text-slate-400 dark:text-slate-500';
                  }
                } else if (isSelected) {
                  optStyle =
                    'bg-[#EFF6FF] dark:bg-blue-950/60 border-[#2563EB] dark:border-blue-500 text-[#1D4ED8] dark:text-blue-200 font-semibold ring-2 ring-[#2563EB]/40 dark:ring-blue-500/30';
                }

                return (
                  <button
                    key={optIdx}
                    id={`quiz-q${currentQuestion.id}-opt${optIdx}`}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={isCurrentQuestionAnswered && isSubmitted}
                    style={{ animationDelay: `${(optIdx + 1) * 60}ms` }}
                    className={`w-full p-4 text-left text-sm font-sans rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer animate-chapter-switch ${optStyle}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border text-xs font-bold font-mono ${
                        isSelected
                          ? isCurrentQuestionAnswered
                            ? optIdx === currentQuestion.correctIndex
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-rose-600 text-white border-rose-600'
                            : 'bg-[#2563EB] dark:bg-blue-600 text-white border-[#2563EB] dark:border-blue-500'
                          : 'bg-slate-100 dark:bg-[#0B1228] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-blue-900/40'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1 pt-0.5 leading-relaxed break-words">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Answer Confirmation / Next Button Bar */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-blue-900/20 flex flex-wrap items-center justify-between gap-3">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => {
                  soundManager.playNav();
                  setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
                }}
                className={`btn-modern-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  currentQuestionIndex === 0 ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {!isCurrentQuestionAnswered ? (
                currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    id="btn-confirm-answer"
                    disabled={pendingSelection === null}
                    onClick={handleConfirmAnswer}
                    className={`btn-modern-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                      pendingSelection !== null ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed pointer-events-none'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>Submit Answer</span>
                  </button>
                ) : (
                  <button
                    id="btn-finish-quiz"
                    disabled={pendingSelection === null}
                    onClick={handleSubmitExamination}
                    className={`btn-modern-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                      pendingSelection !== null ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed pointer-events-none'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>Complete & Review</span>
                  </button>
                )
              ) : currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  id="btn-next-question"
                  onClick={() => {
                    soundManager.playClick();
                    setCurrentQuestionIndex((prev) => prev + 1);
                  }}
                  className="btn-modern-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="btn-finish-quiz"
                  onClick={handleSubmitExamination}
                  className="btn-modern-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Complete & Review</span>
                </button>
              )}
            </div>

            {/* Technical Explanation Panel (visible once answered) */}
            {isCurrentQuestionAnswered && (
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-blue-900/20 bg-slate-50 dark:bg-[#080D1F] rounded-xl p-4 sm:p-5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-2">
                  <HelpCircle className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
                  <span>Technical Explanation:</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3 font-normal text-sm">
                  {currentQuestion.explanation}
                </p>

                {currentQuestion.exampleSnippet && (
                  <div className="mb-3 p-3 bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-blue-900/40 rounded-lg font-mono text-xs text-[#1D4ED8] dark:text-blue-300 font-semibold">
                    Example: {currentQuestion.exampleSnippet}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                  {currentQuestion.targetChapterId && (
                    <button
                      onClick={() => {
                        soundManager.playNav();
                        onNavigateToTheory(currentQuestion.targetChapterId);
                      }}
                      className="text-[#2563EB] dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Review in Theory Guide →</span>
                    </button>
                  )}
                  {currentQuestion.targetLevelId && (
                    <button
                      onClick={() => {
                        soundManager.playNav();
                        onNavigateToQuest(currentQuestion.targetLevelId);
                      }}
                      className="text-slate-700 dark:text-slate-300 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Gamepad2 className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                      <span>Practice in Quest Level {currentQuestion.targetLevelId} →</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default QuizView;
