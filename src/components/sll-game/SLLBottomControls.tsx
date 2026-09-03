import React from 'react';
import {
  Plus,
  Link as LinkIcon,
  Trash2,
  RotateCcw,
  Undo2,
  Redo2,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  Zap,
  Gamepad2,
  Sparkles,
} from 'lucide-react';
import { AssistanceMode, SLLNode, SLLPointerState, SLLTaskDef } from '../../types/sllGame';
import { getContextualPlayAdvice } from '../../utils/sllStepAssistant';

interface SLLBottomControlsProps {
  onOpenCreateNode: () => void;
  onOpenChangeNext: () => void;
  onOpenSetHead: () => void;
  onOpenSetTail: () => void;
  onOpenDeleteNode: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onResetTask: () => void;
  onOpenHint: () => void;
  onOpenHowToPlay?: () => void;
  canUndo: boolean;
  canRedo: boolean;
  nodeCount: number;
  isSettingHeadMode?: boolean;
  isSettingTailMode?: boolean;
  pendingConnectFrom?: number | null;
  onToggleSetHeadMode?: () => void;
  onToggleSetTailMode?: () => void;
  onCancelDirectMode?: () => void;
  assistanceMode?: AssistanceMode;
  currentStep?: number;
  task?: SLLTaskDef;
  nodes?: SLLNode[];
  pointers?: SLLPointerState;
  onExecuteTeacherStep?: () => void;
}

export const SLLBottomControls: React.FC<SLLBottomControlsProps> = ({
  onOpenCreateNode,
  onOpenChangeNext,
  onOpenSetHead,
  onOpenSetTail,
  onOpenDeleteNode,
  onUndo,
  onRedo,
  onResetTask,
  onOpenHint,
  onOpenHowToPlay,
  canUndo,
  canRedo,
  nodeCount,
  isSettingHeadMode,
  isSettingTailMode,
  pendingConnectFrom,
  onToggleSetHeadMode,
  onToggleSetTailMode,
  onCancelDirectMode,
  assistanceMode = 'play',
  currentStep = 1,
  task,
  nodes = [],
  pointers = { headAddress: null, tailAddress: null, currentAddress: null, tempAddress: null, prevAddress: null },
  onExecuteTeacherStep,
}) => {
  const isAnyDirectMode = isSettingHeadMode || isSettingTailMode || pendingConnectFrom !== null;

  // Contextual advice for PLAY mode
  const playAdvice = task ? getContextualPlayAdvice(task, nodes, pointers, currentStep) : null;

  return (
    <div className="w-full flex flex-col gap-2 font-sans">
      {/* Active Direct Click / Drag Action Prompt */}
      {isAnyDirectMode && (
        <div className="w-full p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-medium text-indigo-900 dark:text-indigo-200">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping shrink-0" />
            <span>
              {isSettingHeadMode && '👉 Click any node in the workspace above to point HEAD to it.'}
              {isSettingTailMode && '👉 Click any node in the workspace above to point TAIL to it.'}
              {pendingConnectFrom !== null && `👉 Click destination node (or drop on NULL) to connect Node ${pendingConnectFrom}'s NEXT.`}
            </span>
          </div>
          {onCancelDirectMode && (
            <button
              type="button"
              onClick={onCancelDirectMode}
              className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {/* Main Controls Card */}
      <div className="w-full bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/25 rounded-3xl p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-2.5 font-sans">
        {/* Left Side: Contextual Controls in PLAY mode OR Teacher trigger in GUIDE & SOLVE */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {assistanceMode === 'guide_solve' || assistanceMode === 'guide' ? (
            /* GUIDE & SOLVE MODE: Perform one step */
            <button
              id="guide-solve-bottom-btn"
              onClick={onExecuteTeacherStep}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-xs cursor-pointer transition-all hover:scale-105"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Perform Step {currentStep}</span>
            </button>
          ) : (
            /* PLAY MODE: Contextual Tools based on what student needs right now */
            <>
              {/* If advice is create_node: show prominent create button */}
              {playAdvice?.recommendedAction === 'create_node' && (
                <button
                  id="tool-create-node"
                  onClick={onOpenCreateNode}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm cursor-pointer transition-all hover:-translate-y-0.5 animate-pulse"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Node (DATA: {playAdvice.targetData ?? 10})</span>
                </button>
              )}

              {/* If advice is connect_next: show connect button or drag guidance */}
              {playAdvice?.recommendedAction === 'connect_next' && (
                <button
                  id="tool-change-next"
                  onClick={onOpenChangeNext}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm cursor-pointer transition-all hover:-translate-y-0.5"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Connect NEXT Link</span>
                </button>
              )}

              {/* If advice is set_head: highlight set HEAD */}
              {playAdvice?.recommendedAction === 'set_head' && (
                <button
                  id="tool-set-head"
                  onClick={onToggleSetHeadMode || onOpenSetHead}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isSettingHeadMode
                      ? 'bg-cyan-600 text-white border-cyan-600 ring-2 ring-cyan-400/40'
                      : 'bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-500 shadow-sm'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>{isSettingHeadMode ? 'Click Node in Workspace...' : `Make Node ${playAdvice.targetAddress ?? ''} HEAD`}</span>
                </button>
              )}

              {/* If advice is set_tail: highlight set TAIL */}
              {playAdvice?.recommendedAction === 'set_tail' && (
                <button
                  id="tool-set-tail"
                  onClick={onToggleSetTailMode || onOpenSetTail}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isSettingTailMode
                      ? 'bg-amber-500 text-white border-amber-500 ring-2 ring-amber-400/40'
                      : 'bg-amber-500 hover:bg-amber-600 text-white border-amber-400 shadow-sm'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>{isSettingTailMode ? 'Click Node in Workspace...' : `Make Node ${playAdvice.targetAddress ?? ''} TAIL`}</span>
                </button>
              )}

              {/* If advice is delete_node: highlight delete */}
              {playAdvice?.recommendedAction === 'delete_node' && (
                <button
                  id="tool-delete-node"
                  onClick={onOpenDeleteNode}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm cursor-pointer transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Detached Node</span>
                </button>
              )}

              {/* General Fallback Buttons when not covered by single specific advice */}
              {!playAdvice || playAdvice.recommendedAction === 'check_answer' ? (
                <>
                  <button
                    id="tool-create-node-general"
                    onClick={onOpenCreateNode}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all hover:-translate-y-0.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Node</span>
                  </button>

                  <button
                    id="tool-change-next-general"
                    onClick={onOpenChangeNext}
                    disabled={nodeCount === 0}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 disabled:opacity-40 text-xs font-bold hover:bg-purple-100 transition-all cursor-pointer"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Connect NEXT</span>
                  </button>
                </>
              ) : null}
            </>
          )}
        </div>

        {/* Right Side: Undo, Redo, Reset, Hint, How to Play */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <button
            onClick={onResetTask}
            title="Reset task to initial state"
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={onOpenHint}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hint</span>
          </button>

          {onOpenHowToPlay && (
            <button
              onClick={onOpenHowToPlay}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
              title="How to Play"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">How to Play</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
