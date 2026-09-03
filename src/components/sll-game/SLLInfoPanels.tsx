import React from 'react';
import {
  Target,
  Sliders,
  BookOpen,
  HelpCircle,
  Plus,
  ArrowRight,
  Trash2,
  CheckCircle2,
  Sparkles,
  Link as LinkIcon,
  Layers,
  ArrowDown,
  Info,
  Cpu,
  Code2,
} from 'lucide-react';
import { SLLNode, SLLPointerState, SLLTaskDef } from '../../types/sllGame';

interface SLLInfoPanelsProps {
  task: SLLTaskDef;
  nodes: SLLNode[];
  pointers: SLLPointerState;
  onOpenCreateNode: () => void;
  onOpenChangeNext: () => void;
  onOpenSetHead: () => void;
  onOpenSetTail: () => void;
  onOpenDeleteNode: () => void;
  isSettingHeadMode?: boolean;
  isSettingTailMode?: boolean;
  onToggleSetHeadMode?: () => void;
  onToggleSetTailMode?: () => void;
}

export const SLLInfoPanels: React.FC<SLLInfoPanelsProps> = ({
  task,
  nodes,
  pointers,
  onOpenCreateNode,
  onOpenChangeNext,
  onOpenSetHead,
  onOpenSetTail,
  onOpenDeleteNode,
  isSettingHeadMode = false,
  isSettingTailMode = false,
  onToggleSetHeadMode,
  onToggleSetTailMode,
}) => {
  // Count reachable nodes from HEAD
  let reachableCount = 0;
  const visited = new Set<number>();
  let curr = pointers.headAddress;
  while (curr !== null && !visited.has(curr)) {
    visited.add(curr);
    reachableCount++;
    const n = nodes.find((node) => node.address === curr);
    curr = n ? n.nextAddress : null;
  }
  const unlinkedCount = nodes.length - reachableCount;

  return (
    <div
      id="sll-four-information-panels"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-sans text-slate-900 dark:text-white"
    >
      {/* 1. CURRENT TASK */}
      <div className="flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/25 shadow-xs">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-purple-500/20">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-purple-950/60 border border-indigo-200 dark:border-purple-500/30 flex items-center justify-center text-indigo-600 dark:text-purple-400">
                <Target className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                1. Current Objective
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-purple-950/80 text-indigo-700 dark:text-purple-300">
              Task #{task.taskIndex}
            </span>
          </div>

          <div className="mt-2.5">
            <h4 className="text-xs sm:text-sm font-bold text-indigo-900 dark:text-purple-100 line-clamp-1">
              {task.title}
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed line-clamp-3">
              {task.objective}
            </p>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE CONTROLS SHORTCUTS */}
      <div className="flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/25 shadow-xs">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-purple-500/20">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Sliders className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                2. Pointer Tools
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Direct Actions</span>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-1.5">
            <button
              id="info-tool-create-node"
              onClick={onOpenCreateNode}
              className="px-2 py-1.5 rounded-xl bg-indigo-50 dark:bg-purple-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-purple-300 text-[11px] font-mono font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>+ Node</span>
            </button>
            <button
              id="info-tool-change-next"
              onClick={onOpenChangeNext}
              className="px-2 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-700 dark:text-purple-300 text-[11px] font-mono font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <LinkIcon className="w-3 h-3" />
              <span>NEXT</span>
            </button>
            <button
              id="info-tool-set-head"
              onClick={onToggleSetHeadMode || onOpenSetHead}
              className={`px-2 py-1.5 rounded-xl text-[11px] font-mono font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                isSettingHeadMode
                  ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-400/50 animate-pulse'
                  : 'bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300'
              }`}
              title="Click a node in the workspace to set HEAD"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isSettingHeadMode ? 'bg-white' : 'bg-indigo-500'}`} />
              <span>{isSettingHeadMode ? 'Pick Node...' : 'HEAD'}</span>
            </button>
            <button
              id="info-tool-set-tail"
              onClick={onToggleSetTailMode || onOpenSetTail}
              className={`px-2 py-1.5 rounded-xl text-[11px] font-mono font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                isSettingTailMode
                  ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-400/50 animate-pulse'
                  : 'bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-700 dark:text-amber-300'
              }`}
              title="Click a node in the workspace to set TAIL"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isSettingTailMode ? 'bg-white' : 'bg-amber-500'}`} />
              <span>{isSettingTailMode ? 'Pick Node...' : 'TAIL'}</span>
            </button>
          </div>
          <p className="mt-1.5 text-[9px] font-sans text-slate-400 dark:text-slate-500 text-center">
            💡 Or click any node directly to set HEAD/TAIL
          </p>
        </div>
      </div>

      {/* 3. CONCEPT & POINTER RULE */}
      <div className="flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/25 shadow-xs">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-purple-500/20">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                3. Pointer Rule
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 font-bold">O(1) / O(N)</span>
          </div>

          <div className="mt-2.5">
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium line-clamp-3">
              {task.conceptExplanation}
            </p>
          </div>
        </div>
      </div>

      {/* 4. RAM HEAP STATUS */}
      <div className="flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/25 shadow-xs">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-purple-500/20">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                4. RAM Memory State
              </span>
            </div>
            <span className="text-[10px] font-mono text-cyan-600 font-bold">Heap State</span>
          </div>

          <div className="mt-2.5 space-y-1 text-[11px] font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Chain Length:</span>
              <span className="font-bold text-indigo-600 dark:text-purple-300">{reachableCount} node(s)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Unlinked / Isolated:</span>
              <span className={`font-bold ${unlinkedCount > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                {unlinkedCount} node(s)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">HEAD ➔ TAIL:</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">
                {pointers.headAddress !== null ? pointers.headAddress : 'NULL'} ➔ {pointers.tailAddress !== null ? pointers.tailAddress : 'NULL'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
