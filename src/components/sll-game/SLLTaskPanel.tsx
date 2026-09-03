import React from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Code2,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Info,
  Layers,
  Link as LinkIcon,
  Plus,
  Trash2,
  Eye,
  Search,
} from 'lucide-react';
import { SLLTaskDef, SLLNode, SLLPointerState, SLLFeedback } from '../../types/sllGame';
import { getAllTaskSteps } from '../../utils/sllStepAssistant';

interface SLLTaskPanelProps {
  task: SLLTaskDef;
  nodes: SLLNode[];
  pointers: SLLPointerState;
  selectedNode: SLLNode | null;
  currentStep?: number;
  completedSteps?: number[];
  onOpenCreateNode: () => void;
  onOpenChangeNext: (address?: number) => void;
  onOpenSetHead: () => void;
  onOpenSetTail: () => void;
  onOpenDeleteNode: (address?: number) => void;
  onOpenHint: () => void;
  onCheckAnswer: () => void;
  onOpenHowItWorks?: () => void;
  assistanceMode?: 'guide_solve' | 'play' | 'guide' | 'solve';
  onSelectAssistanceMode?: (mode: 'guide_solve' | 'play' | 'guide' | 'solve') => void;
  feedback: SLLFeedback | null;
  isCompleted: boolean;
  onNextTask: () => void;
  hasNextTask: boolean;
  // Traversal & Search Interactive Props
  currentTraversalStep?: number;
  onTraversalAnswer?: (answer: string) => void;
  searchStepPrompt?: {
    currentData: number;
    targetData: number;
  } | null;
  onSearchAnswer?: (isMatch: boolean) => void;
}

export const SLLTaskPanel: React.FC<SLLTaskPanelProps> = ({
  task,
  nodes,
  pointers,
  selectedNode,
  currentStep = 1,
  completedSteps = [],
  onOpenCreateNode,
  onOpenChangeNext,
  onOpenSetHead,
  onOpenSetTail,
  onOpenDeleteNode,
  onOpenHint,
  onCheckAnswer,
  onOpenHowItWorks,
  assistanceMode = 'play',
  onSelectAssistanceMode,
  feedback,
  isCompleted,
  onNextTask,
  hasNextTask,
  currentTraversalStep,
  onTraversalAnswer,
  searchStepPrompt,
  onSearchAnswer,
}) => {
  // Check target condition completion in real time for beginner feedback
  const target = task.targetCondition;
  const isCountOk = target.nodeCount === undefined || nodes.length === target.nodeCount;
  const isHeadOk = target.headAddress === undefined || pointers.headAddress === target.headAddress;
  const isTailOk = target.tailAddress === undefined || pointers.tailAddress === target.tailAddress;
  const allSteps = getAllTaskSteps(task, nodes, pointers);

  return (
    <div className="w-full flex flex-col gap-4 font-sans">
      {/* Task Objective Card */}
      <div className="bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/25 rounded-3xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-2 pb-2.5 border-b border-slate-100 dark:border-purple-500/20">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-lg bg-indigo-100 dark:bg-purple-950 text-indigo-700 dark:text-purple-300 font-mono text-[11px] font-bold">
              Task #{task.taskIndex}
            </span>
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
              +{task.xpReward} XP
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenHowItWorks && (
              <button
                type="button"
                onClick={onOpenHowItWorks}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
                title="View visual step explanation"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Concept</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenHint}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Hint</span>
            </button>
          </div>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5">
          {task.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          {task.objective}
        </p>

        {/* Real-time Target Criteria Checklist */}
        <div className="mt-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-purple-500/20">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Target Verification Checklist:
          </span>
          <div className="space-y-1 text-xs">
            {target.nodeCount !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Total Nodes in List:</span>
                <span className={`font-mono font-bold flex items-center gap-1 ${isCountOk ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {isCountOk ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <span className="w-3 h-3 rounded-full border border-slate-400" />}
                  {nodes.length} / {target.nodeCount}
                </span>
              </div>
            )}
            {target.headAddress !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">HEAD Pointer:</span>
                <span className={`font-mono font-bold flex items-center gap-1 ${isHeadOk ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {isHeadOk ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <span className="w-3 h-3 rounded-full border border-slate-400" />}
                  {pointers.headAddress !== null ? pointers.headAddress : 'NULL'} (Target: {target.headAddress !== null ? target.headAddress : 'NULL'})
                </span>
              </div>
            )}
            {target.tailAddress !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">TAIL Pointer:</span>
                <span className={`font-mono font-bold flex items-center gap-1 ${isTailOk ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {isTailOk ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <span className="w-3 h-3 rounded-full border border-slate-400" />}
                  {pointers.tailAddress !== null ? pointers.tailAddress : 'NULL'} (Target: {target.tailAddress !== null ? target.tailAddress : 'NULL'})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Step-by-Step State Machine Progression */}
        <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-purple-500/20 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Step-by-Step Task Progress:</span>
            </span>
            <span className="font-mono text-[10px] font-bold text-indigo-600 dark:text-purple-400">
              {isCompleted ? 'ALL STEPS COMPLETED' : `STEP ${currentStep} OF ${allSteps.length}`}
            </span>
          </div>

          <div className="space-y-1.5">
            {allSteps.map((s) => {
              const isDone = completedSteps.includes(s.stepNumber) || isCompleted;
              const isCurrent = s.stepNumber === currentStep && !isCompleted;
              return (
                <div
                  key={s.stepNumber}
                  className={`p-2 rounded-xl border transition-all flex items-start gap-2 ${
                    isDone
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
                      : isCurrent
                      ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/50 text-slate-950 dark:text-white shadow-xs'
                      : 'bg-white/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-60'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px] animate-pulse">
                        {s.stepNumber}
                      </span>
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px]">
                        {s.stepNumber}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold leading-tight ${isCurrent ? 'text-amber-950 dark:text-amber-200' : ''}`}>
                      {s.title}
                    </p>
                    <p className="text-[11px] leading-tight opacity-80 mt-0.5">
                      {s.what}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* C Code Equivalent Box */}
        <div className="mt-3 p-3 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] border border-slate-800">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1.5 font-bold uppercase tracking-wider">
            <Code2 className="w-3 h-3 text-indigo-400" />
            <span>C / C++ Pointer Equivalent:</span>
          </div>
          <code className="text-emerald-400 leading-tight block whitespace-pre-wrap">
            {task.codeEquivalent}
          </code>
        </div>
      </div>

      {/* Selected Node Inspector (if a node is clicked) */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#0B1228] border border-indigo-200 dark:border-indigo-500/30 rounded-3xl p-4 shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              <span>SELECTED NODE INSPECTOR</span>
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              ADDR: {selectedNode.address}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-3">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-purple-500/20">
              <span className="text-[9px] text-slate-400 block">DATA VALUE</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedNode.data}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-purple-500/20">
              <span className="text-[9px] text-slate-400 block">NEXT POINTER</span>
              <span className="font-bold text-indigo-600 dark:text-purple-400 text-sm">
                {selectedNode.nextAddress !== null ? selectedNode.nextAddress : 'NULL'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenChangeNext(selectedNode.address)}
              className="px-2.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 flex items-center justify-center gap-1"
            >
              <LinkIcon className="w-3 h-3" />
              <span>Edit NEXT</span>
            </button>
            <button
              onClick={() => onOpenDeleteNode(selectedNode.address)}
              className="px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 flex items-center justify-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete Node</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Traversal Step Q&A Prompt (Level 3 / Mission 7) */}
      {task.targetCondition.customValidator === 'L3_TRAVERSAL_COMPLETE' && onTraversalAnswer && (
        <div className="p-4 rounded-3xl bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/30 shadow-xs">
          <div className="flex items-center gap-2 mb-2 font-mono font-bold text-xs text-cyan-800 dark:text-cyan-300">
            <Eye className="w-4 h-4" />
            <span>TRAVERSAL QUESTION:</span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-200 mb-3 font-medium">
            {pointers.currentAddress === null
              ? 'HEAD contains which address to start traversal?'
              : `CURRENT is at Node ${pointers.currentAddress}. What address should CURRENT move to next?`}
          </p>

          <div className="flex flex-wrap gap-2">
            {nodes.map((n) => (
              <button
                key={n.address}
                onClick={() => onTraversalAnswer(String(n.address))}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#0E1736] border border-cyan-300 dark:border-cyan-500/40 text-xs font-mono font-bold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 shadow-xs"
              >
                {n.address} [Data: {n.data}]
              </button>
            ))}
            <button
              onClick={() => onTraversalAnswer('NULL')}
              className="px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950 border border-rose-300 dark:border-rose-500/40 text-xs font-mono font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-200 shadow-xs"
            >
              NULL (End of List)
            </button>
          </div>
        </div>
      )}

      {/* Search Step Q&A Prompt (Level 4 Task 4 / Mission 6) */}
      {searchStepPrompt && onSearchAnswer && (
        <div className="p-4 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 shadow-xs">
          <div className="flex items-center gap-2 mb-1.5 font-mono font-bold text-xs text-emerald-800 dark:text-emerald-300">
            <Search className="w-4 h-4" />
            <span>LINEAR SEARCH STEP:</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-200 mb-3">
            CURRENT Node contains <strong>DATA = {searchStepPrompt.currentData}</strong>. Does this node match target <strong>{searchStepPrompt.targetData}</strong>?
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSearchAnswer(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-600/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>YES (Match Found)</span>
            </button>
            <button
              onClick={() => onSearchAnswer(false)}
              className="px-4 py-2 rounded-xl bg-slate-600 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md"
            >
              <span>NO (Advance Next)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Validation Feedback Banner */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-4 rounded-3xl border ${
            feedback.type === 'success'
              ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
              : feedback.type === 'warning'
              ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-200'
              : 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-500/40 text-rose-900 dark:text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm mb-1">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.title}</span>
          </div>
          <p className="text-xs leading-relaxed font-medium mb-1">{feedback.message}</p>
          {feedback.explanation && (
            <p className="text-[11px] opacity-85 italic">{feedback.explanation}</p>
          )}
        </motion.div>
      )}

      {/* Primary Action Button: CHECK ANSWER / NEXT TASK */}
      <div className="mt-1">
        {isCompleted ? (
          <button
            onClick={onNextTask}
            className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
          >
            <span>{hasNextTask ? 'Continue to Next Task' : 'Complete Level!'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            id="sll-check-answer-btn"
            onClick={onCheckAnswer}
            className="w-full py-3.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>CHECK ANSWER</span>
          </button>
        )}
      </div>
    </div>
  );
};
