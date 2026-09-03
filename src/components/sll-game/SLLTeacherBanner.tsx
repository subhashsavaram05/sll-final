import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lightbulb,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Play,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { SLLTeacherStep } from '../../types/sllGame';

interface SLLTeacherBannerProps {
  step: SLLTeacherStep | null;
  lastActionResult: string | null;
  isTaskComplete: boolean;
  completedSteps?: number[];
  onExecuteStep: () => void;
  onSwitchToPlay: () => void;
  onNextTask: () => void;
  hasNextTask: boolean;
}

export const SLLTeacherBanner: React.FC<SLLTeacherBannerProps> = ({
  step,
  lastActionResult,
  isTaskComplete,
  completedSteps = [],
  onExecuteStep,
  onSwitchToPlay,
  onNextTask,
  hasNextTask,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-3xl p-4 sm:p-5 bg-amber-500/10 dark:bg-amber-500/15 border-2 border-amber-400 dark:border-amber-500/40 shadow-xs relative overflow-hidden font-sans mb-3"
    >
      {/* Decorative subtle background icon */}
      <Lightbulb className="absolute -right-4 -bottom-4 w-28 h-28 text-amber-500/10 dark:text-amber-400/10 pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-amber-300/40 dark:border-amber-500/25 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
            <Lightbulb className="w-4 h-4 fill-slate-950" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              TEACHING ASSISTANT
            </span>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {isTaskComplete
                  ? 'Task Finished!'
                  : step
                  ? `Step ${step.stepNumber} of ${step.totalSteps}: ${step.title}`
                  : 'All Steps Complete!'}
              </h4>
              {step && step.totalSteps > 1 && (
                <div className="flex items-center gap-1 ml-1.5">
                  {Array.from({ length: step.totalSteps }).map((_, idx) => {
                    const stepNum = idx + 1;
                    const isDone = completedSteps.includes(stepNum);
                    const isCurr = step.stepNumber === stepNum && !isTaskComplete;
                    return (
                      <span
                        key={stepNum}
                        className={`h-1.5 rounded-full transition-all ${
                          isDone
                            ? 'w-3.5 bg-emerald-500'
                            : isCurr
                            ? 'w-5 bg-amber-500 animate-pulse'
                            : 'w-2 bg-amber-300/60 dark:bg-amber-900/60'
                        }`}
                        title={`Step ${stepNum}`}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSwitchToPlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0E1736] border border-amber-300 dark:border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-bold hover:bg-amber-100/60 transition-all cursor-pointer shadow-2xs"
            title="Switch to interactive play mode"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Try in PLAY Mode</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {isTaskComplete ? (
        <div className="space-y-3 relative z-10">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Excellent! You built the linked list correctly.</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            All pointer linkages, memory addresses, and data criteria match the target specification.
          </p>
          <div className="pt-1">
            <button
              type="button"
              id="teacher-next-task-btn"
              onClick={onNextTask}
              className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
            >
              <span>{hasNextTask ? 'Continue to Next Task' : 'Complete Level!'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : step ? (
        <div className="space-y-3 relative z-10">
          {/* WHAT WE ARE DOING */}
          <div className="flex items-start gap-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-mono text-[10px] font-bold shrink-0 mt-0.5">
              WHAT
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-snug">
              {step.what}
            </p>
          </div>

          {/* WHY WE ARE DOING IT */}
          <div className="flex items-start gap-2">
            <span className="px-2 py-0.5 rounded-md bg-white/80 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 font-mono text-[10px] font-bold shrink-0 mt-0.5">
              WHY
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {step.why}
            </p>
          </div>

          {/* Last Step Result (if any) */}
          <AnimatePresence>
            {lastActionResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-2.5 rounded-xl bg-emerald-100/90 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-200 text-xs font-medium flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{lastActionResult}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Trigger Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="button"
              id="guide-solve-perform-step-btn"
              onClick={onExecuteStep}
              className="py-2.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/25 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>GUIDE & SOLVE: Perform Step {step.stepNumber}</span>
            </button>

            <span className="text-[11px] text-amber-900/80 dark:text-amber-300/80 font-medium">
              One click = One step. Never auto-finishes entire level.
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Current operations look complete! Click Check Answer to verify.</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};
