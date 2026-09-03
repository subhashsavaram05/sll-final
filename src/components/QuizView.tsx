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

    try {
      localStorage.removeItem(QUIZ_STORAGE_ANSWERS_KEY);
      localStorage.setItem(QUIZ_STORAGE_SUBMITTED_KEY, 'false');
    } catch {
      // Ignore
    }

    progressManager.resetQuizAttempt();
  };

  const getPerformanceFeedback = (score: number) => {
    if (score >= 9) {
      return {
        badge: 'OUTSTANDING MASTERY (GRADE A+)',
        message: 'Excellent! You have a strong understanding of Single Linked Lists.',
      };
    }
    if (score >= 7) {
      return {
        badge: 'GOOD WORK (GRADE B+)',
        message: 'Good work! Review a few operations to strengthen your understanding.',
      };
    }
    if (score >= 5) {
      return {
        badge: 'PROGRESSING (GRADE C)',
        message: "You're getting there! Review insertion, deletion, and traversal.",
      };
    }
    return {
      badge: 'REVIEW NEEDED',
      message: 'Keep learning! Review the basic structure and operations of Single Linked Lists.',
    };
  };

  const answeredCount = Object.keys(studentAnswers).length;
  const feedback = getPerformanceFeedback(score);

  // Dynamic certificate/completion card theme determined by final quiz percentage
  const certificateTheme = useMemo(() => {
    if (percentage >= 80) {
      return {
        // Grade A — Green Theme (80% – 100%)
        cardBorder: 'border-2 border-emerald-500/40 dark:border-emerald-500/40 shadow-emerald-500/5 dark:shadow-[0_8px_30px_rgba(16,185,129,0.15)]',
        trophyBg: 'bg-[#00A86B] dark:bg-emerald-600 shadow-emerald-500/20 dark:shadow-emerald-950/50',
        badge: 'border border-[#00A86B]/40 dark:border-emerald-500/40 bg-[#E6F8F0] dark:bg-emerald-950/60 text-[#008A54] dark:text-emerald-300',
        scoreCardBorder: 'border-2 border-emerald-300/80 dark:border-emerald-500/40 shadow-[0_8px_30px_rgba(16,185,129,0.12)] dark:shadow-[0_8px_30px_rgba(16,185,129,0.2)]',
        scoreTag: 'text-emerald-600 dark:text-emerald-400',
        scoreText: 'text-[#00A86B] dark:text-emerald-400',
        accuracyPill: 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-200',
        correctStat: 'text-[#00A86B] dark:text-emerald-400',
      };
    } else if (percentage >= 40) {
      return {
        // Grade B — Light Blue Theme (40% – 79%)
        cardBorder: 'border-2 border-sky-400/50 dark:border-sky-500/40 shadow-sky-500/5 dark:shadow-[0_8px_30px_rgba(14,165,233,0.15)]',
        trophyBg: 'bg-sky-500 dark:bg-sky-600 shadow-sky-500/20 dark:shadow-sky-950/50',
        badge: 'border border-sky-400/50 dark:border-sky-500/40 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300',
        scoreCardBorder: 'border-2 border-sky-300/80 dark:border-sky-500/40 shadow-[0_8px_30px_rgba(14,165,233,0.12)] dark:shadow-[0_8px_30px_rgba(14,165,233,0.2)]',
        scoreTag: 'text-sky-600 dark:text-sky-400',
        scoreText: 'text-sky-500 dark:text-sky-400',
        accuracyPill: 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-200 dark:border-sky-500/30 text-sky-800 dark:text-sky-200',
        correctStat: 'text-sky-500 dark:text-sky-400',
      };
    } else {
      return {
        // Grade C — Yellow Theme (0% – 39%)
        cardBorder: 'border-2 border-amber-400/50 dark:border-amber-500/40 shadow-amber-500/5 dark:shadow-[0_8px_30px_rgba(245,158,11,0.15)]',
        trophyBg: 'bg-amber-500 dark:bg-amber-600 shadow-amber-500/20 dark:shadow-amber-950/50',
        badge: 'border border-amber-400/50 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
        scoreCardBorder: 'border-2 border-amber-300/80 dark:border-amber-500/40 shadow-[0_8px_30px_rgba(245,158,11,0.12)] dark:shadow-[0_8px_30px_rgba(245,158,11,0.2)]',
        scoreTag: 'text-amber-600 dark:text-amber-400',
        scoreText: 'text-amber-500 dark:text-amber-400',
        accuracyPill: 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-200',
        correctStat: 'text-amber-500 dark:text-amber-400',
      };
    }
  }, [percentage]);

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-4 font-sans text-slate-900 dark:text-white animate-page-enter">
      {/* Header Banner */}
      <div className="border border-slate-200 dark:border-purple-500/20 rounded-2xl pb-6 mb-6 bg-white dark:bg-[#0B1228] p-6 sm:p-8 shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] reveal-on-scroll">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-purple-950/60 border border-indigo-100 dark:border-purple-500/30 text-indigo-700 dark:text-purple-300 rounded-lg text-xs font-semibold uppercase tracking-wider font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-purple-400" />
            <span>KNOWLEDGE ASSESSMENT</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Single Linked List Quiz (10 Questions)
            </span>
            {isSubmitted && (
              <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-md text-xs font-semibold">
                Completed
              </span>
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight animate-heading-enter">
          Single Linked List Knowledge Check
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl mt-1 leading-relaxed">
          Test your understanding of nodes, pointers, traversal, insertion, deletion, searching, and the basic operations of a single linked list.
        </p>

        {/* Question Index Tabs / Progress Tracker */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-purple-500/15">
          <div className="flex items-center justify-between gap-2 mb-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-purple-400" />
              <span>
                Progress: <strong className="text-indigo-600 dark:text-purple-300 font-mono">{answeredCount}</strong> / {totalQuestions} Answered
              </span>
            </div>
            {isSubmitted && (
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
                {score} / {totalQuestions} Correct
              </span>
            )}
          </div>

          {/* Question Index Pills */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const rec = studentAnswers[q.id];
              const isAnswered = rec !== undefined;
              const isCurrent = currentQuestionIndex === idx && !isSubmitted;

              let pillStyle = 'bg-slate-50 dark:bg-[#080D1F] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-purple-500/20 hover:bg-slate-100 dark:hover:bg-[#0F1733]';
              if (isCurrent) {
                pillStyle = 'bg-indigo-600 dark:bg-purple-600 text-white border-indigo-600 dark:border-purple-500 font-bold shadow-xs dark:shadow-[0_0_12px_rgba(124,58,237,0.4)]';
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
                    if (isSubmitted) {
                      const el = document.getElementById(`quiz-review-card-${q.id}`);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    } else {
                      setCurrentQuestionIndex(idx);
                    }
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

      {/* QUIZ COMPLETION VIEW (Displayed ONLY after Complete & Review is clicked) */}
      {isSubmitted ? (
        <div className="space-y-8">
          <div
            id="quiz-result-card"
            className={`p-6 sm:p-10 lg:p-12 bg-white dark:bg-[#0B1228] rounded-3xl flex flex-col items-center justify-center text-center animate-editorial-scale transition-all ${certificateTheme.cardBorder}`}
          >
            {/* 1. Top Achievement Trophy Icon */}
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg mx-auto mb-4 sm:mb-5 ${certificateTheme.trophyBg}`}>
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-[2.2]" />
            </div>

            {/* 2. Achievement Badge */}
            <div className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full font-mono text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-3 sm:mb-4 ${certificateTheme.badge}`}>
              ★ {feedback.badge} ★
            </div>

            {/* 3. Main Completion Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B192C] dark:text-white tracking-tight uppercase mb-3">
              Single Linked List Knowledge Check Complete!
            </h2>

            {/* 4. Supporting Description */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed font-normal mb-6 sm:mb-8">
              {feedback.message}
            </p>

            {/* 5. Highlighted Score Card */}
            <div className={`w-full max-w-md mx-auto p-6 sm:p-8 bg-white dark:bg-[#070B18] rounded-3xl flex flex-col items-center justify-center text-center mb-6 sm:mb-8 ${certificateTheme.scoreCardBorder}`}>
              <span className={`text-[11px] sm:text-xs font-mono font-bold tracking-[0.2em] uppercase mb-2 ${certificateTheme.scoreTag}`}>
                FINAL HIGHLIGHTED SCORE
              </span>
              <div className={`text-5xl sm:text-6xl font-black font-sans tracking-tight leading-none my-2 ${certificateTheme.scoreText}`}>
                {score} / {totalQuestions}
              </div>
              <div className={`mt-3 px-4 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-semibold border ${certificateTheme.accuracyPill}`}>
                Accuracy: {percentage}%
              </div>
            </div>

            {/* 6. Summary Statistics Cards: Correct Answers, Incorrect Answers, Accuracy */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-2xl mx-auto">
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#070B18] border border-slate-200/90 dark:border-purple-500/30 shadow-xs flex flex-col items-center justify-center text-center">
                <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-1.5">
                  CORRECT ANSWERS
                </span>
                <span className={`text-xl sm:text-2xl font-extrabold font-mono flex items-center justify-center gap-1.5 ${certificateTheme.correctStat}`}>
                  <Check className="w-5 h-5 stroke-[2.5]" />
                  {score}
                </span>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#070B18] border border-slate-200/90 dark:border-purple-500/30 shadow-xs flex flex-col items-center justify-center text-center">
                <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-1.5">
                  INCORRECT ANSWERS
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-rose-500 dark:text-rose-400 font-mono">
                  {totalQuestions - score}
                </span>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#070B18] border border-slate-200/90 dark:border-purple-500/30 shadow-xs flex flex-col items-center justify-center text-center">
                <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-1.5">
                  ACCURACY
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {percentage}%
                </span>
              </div>
            </div>

            {/* 7. Action Buttons: Review Answers, Retry Quiz, Continue Learning */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 mt-8 w-full max-w-lg mx-auto">
              <button
                id="btn-quiz-review-answers"
                type="button"
                onClick={() => {
                  soundManager.playNav();
                  const el = document.getElementById('quiz-question-overview-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-50 dark:bg-purple-950/60 border border-indigo-200 dark:border-purple-500/30 text-indigo-700 dark:text-purple-300 font-sans text-xs sm:text-sm font-semibold shadow-xs hover:bg-indigo-100 dark:hover:bg-purple-900/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ListOrdered className="w-4 h-4" />
                <span>Review Answers</span>
              </button>

              <button
                id="btn-quiz-retake"
                type="button"
                onClick={handleResetQuiz}
                className="btn-modern-primary px-6 py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 stroke-[2.2]" />
                <span>Retry Quiz</span>
              </button>

              <button
                id="btn-quiz-continue-learning"
                type="button"
                onClick={() => {
                  soundManager.playNav();
                  if (onNavigateToQuest) {
                    onNavigateToQuest(1);
                  } else if (onNavigateToHome) {
                    onNavigateToHome();
                  }
                }}
                className="btn-modern-secondary px-5 py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4 text-indigo-600 dark:text-purple-400" />
                <span>Continue Learning</span>
              </button>
            </div>
          </div>

          {/* 2. QUESTION OVERVIEW SECTION (Directly Below Completion Certificate) */}
          <div id="quiz-question-overview-section" className="space-y-6">
            {/* Section Heading */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-purple-500/20">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
                <ListOrdered className="w-5 h-5 text-indigo-600 dark:text-purple-400" />
                <span>Full Question-by-Question Review</span>
              </h3>
              <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold font-mono">
                {score} of {totalQuestions} Correct
              </span>
            </div>

            {/* 10 Question Review Cards (Sequential Order 01 to 10) */}
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
                        <span className="px-3 py-1 bg-indigo-600 dark:bg-purple-600 text-white rounded-full text-xs font-bold font-mono tracking-wide shadow-xs inline-flex items-center justify-center">
                          Question {questionNumberStr}
                        </span>
                        <span className="text-xs font-bold text-indigo-600 dark:text-cyan-300 font-mono tracking-wider">
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
                      <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-purple-500/25 bg-[#F8FAFC] dark:bg-[#070B18]">
                        <div className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-1.5 font-sans">
                          CORRECT ANSWER:
                        </div>
                        <div className="font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 break-words">
                          {String.fromCharCode(65 + q.correctIndex)}: {q.correctAnswerText}
                        </div>
                      </div>
                    </div>

                    {/* Technical Explanation Panel */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#070B18] border border-slate-200 dark:border-purple-500/20 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs sm:text-sm mb-2">
                        <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-purple-400" />
                        <span>Technical Explanation:</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-3 font-normal">
                        {q.explanation}
                      </p>

                      {q.exampleSnippet && (
                        <div className="mb-3 p-2.5 bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/30 rounded-lg font-mono text-xs text-indigo-700 dark:text-cyan-300 font-semibold">
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
                            className="text-indigo-600 dark:text-purple-400 hover:text-indigo-700 dark:hover:text-purple-300 font-semibold text-xs inline-flex items-center gap-1.5 hover:underline cursor-pointer"
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
                            <Gamepad2 className="w-3.5 h-3.5 text-indigo-600 dark:text-purple-400" />
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
        </div>
      ) : (
        /* Taking the Quiz: Step-by-Step Question Flow (Questions 1 to 10) */
        <div className="space-y-6">
          <div
            key={currentQuestion.id}
            id={`quiz-step-card-${currentQuestion.id}`}
            className={`p-6 sm:p-8 border rounded-2xl transition-all bg-white dark:bg-[#0B1228] shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] animate-chapter-switch ${
              isCurrentQuestionAnswered
                ? currentAnswerRecord?.isCorrect
                  ? 'border-emerald-300 dark:border-emerald-500/40 ring-1 ring-emerald-200 dark:ring-emerald-500/30'
                  : 'border-rose-300 dark:border-rose-500/40 ring-1 ring-rose-200 dark:ring-rose-500/30'
                : 'border-slate-200 dark:border-purple-500/20'
            }`}
          >
            {/* Question Header */}
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-purple-500/15">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-indigo-600 dark:bg-purple-600 text-white rounded-md text-xs font-bold font-mono shadow-xs">
                  Question {currentQuestionIndex + 1 < 10 ? `0${currentQuestionIndex + 1}` : currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <span className="text-xs font-semibold text-indigo-600 dark:text-cyan-300 font-mono">{currentQuestion.techniqueCode}</span>
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
                  'bg-white dark:bg-[#080D1F] border-slate-200 dark:border-purple-500/25 hover:border-indigo-300 dark:hover:border-purple-500/50 hover:bg-slate-50 dark:hover:bg-[#0F1733] text-slate-800 dark:text-slate-200';

                if (isCurrentQuestionAnswered) {
                  if (optIdx === currentQuestion.correctIndex) {
                    optStyle =
                      'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-bold ring-2 ring-emerald-400 dark:ring-emerald-500/40';
                  } else if (isSelected && !currentAnswerRecord?.isCorrect) {
                    optStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-950 dark:text-rose-200 font-bold';
                  } else {
                    optStyle = 'bg-white dark:bg-[#080D1F] opacity-40 border-slate-200 dark:border-purple-500/20 text-slate-400 dark:text-slate-500';
                  }
                } else if (isSelected) {
                  optStyle =
                    'bg-indigo-50/80 dark:bg-purple-950/60 border-indigo-600 dark:border-cyan-400 text-indigo-900 dark:text-cyan-200 font-semibold ring-2 ring-indigo-500 dark:ring-cyan-500/30';
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
                            : 'bg-indigo-600 dark:bg-purple-600 text-white border-indigo-600 dark:border-purple-500'
                          : 'bg-slate-100 dark:bg-[#0B1228] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-purple-500/30'
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
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-purple-500/15 flex flex-wrap items-center justify-between gap-3">
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
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-purple-500/15 bg-slate-50 dark:bg-[#080D1F] rounded-xl p-4 sm:p-5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-purple-400" />
                  <span>Technical Explanation:</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3 font-normal text-sm">
                  {currentQuestion.explanation}
                </p>

                {currentQuestion.exampleSnippet && (
                  <div className="mb-3 p-3 bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/30 rounded-lg font-mono text-xs text-indigo-700 dark:text-cyan-300 font-semibold">
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
                      className="text-indigo-600 dark:text-cyan-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
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
                      <Gamepad2 className="w-3.5 h-3.5 text-indigo-600 dark:text-purple-400" />
                      <span>Practice in Quest Level {currentQuestion.targetLevelId} →</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizView;
