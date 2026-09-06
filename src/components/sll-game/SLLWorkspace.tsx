import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Database,
  Sparkles,
  Link as LinkIcon,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  Layers,
  ArrowDown,
  ArrowUp,
  Cpu,
  Edit3,
  Trash2,
  AlertCircle,
  PlusCircle,
  X,
} from 'lucide-react';
import { SLLNode, SLLPointerState } from '../../types/sllGame';

interface SLLWorkspaceProps {
  nodes: SLLNode[];
  pointers: SLLPointerState;
  stagedNodes: SLLNode[];
  traversalOutput: number[];
  searchTarget: number | null;
  searchResult: 'found' | 'not_found' | 'searching' | 'idle';
  selectedAddress: number | null;
  onSelectNode: (address: number) => void;
  onOpenChangeNext: (address: number) => void;
  onSetHeadDirect?: (address: number) => void;
  onSetTailDirect?: (address: number) => void;
  onConnectNextDirect?: (fromAddr: number, toAddr: number | null) => void;
  onDeleteNodeDirect?: (address: number) => void;
  onInsertBetween?: (prevAddr: number | null, nextAddr: number | null) => void;
  isTraversing: boolean;
  isSearching: boolean;
  levelId: number;
  guideTargetAddress?: number | null;
  pendingConnectFrom?: number | null;
  isSettingHeadMode?: boolean;
  isSettingTailMode?: boolean;
  isDeletingNodeMode?: boolean;
  isConnectingNextMode?: boolean;
  currentStep?: number;
  totalSteps?: number;
  currentStepActionType?: string;
  currentStepInstruction?: string;
  currentStepTargetAddress?: number | null;
  wrongClickedAddress?: number | null;
  onNodeClickDirect?: (address: number) => void;
  onCancelDirectMode?: () => void;
  // Toolbar action handlers:
  onCreateNode?: () => void;
  onOpenCreateNodeModal?: () => void;
  onToggleHeadMode?: () => void;
  onToggleTailMode?: () => void;
  onToggleNextMode?: () => void;
  onToggleDeleteMode?: () => void;
  onSetNextToNull?: () => void;
}

export const SLLWorkspace: React.FC<SLLWorkspaceProps> = ({
  nodes,
  pointers,
  stagedNodes,
  traversalOutput,
  searchTarget,
  searchResult,
  selectedAddress,
  onSelectNode,
  onOpenChangeNext,
  onSetHeadDirect,
  onSetTailDirect,
  onConnectNextDirect,
  onDeleteNodeDirect,
  onInsertBetween,
  isTraversing,
  isSearching,
  levelId,
  guideTargetAddress,
  pendingConnectFrom = null,
  isSettingHeadMode = false,
  isSettingTailMode = false,
  isDeletingNodeMode = false,
  isConnectingNextMode = false,
  currentStep,
  totalSteps,
  currentStepActionType,
  currentStepInstruction,
  currentStepTargetAddress,
  wrongClickedAddress,
  onNodeClickDirect,
  onCancelDirectMode,
  onCreateNode,
  onOpenCreateNodeModal,
  onToggleHeadMode,
  onToggleTailMode,
  onToggleNextMode,
  onToggleDeleteMode,
  onSetNextToNull,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scaleFactor, setScaleFactor] = useState<number>(1);
  const [draggingFromAddr, setDraggingFromAddr] = useState<number | null>(null);
  const [dragOverAddr, setDragOverAddr] = useState<number | null>(null);
  const [isDragOverNull, setIsDragOverNull] = useState<boolean>(false);

  // Local mode state fallbacks if parent doesn't manage them directly
  const [localHeadMode, setLocalHeadMode] = useState<boolean>(false);
  const [localTailMode, setLocalTailMode] = useState<boolean>(false);
  const [localNextMode, setLocalNextMode] = useState<boolean>(false);
  const [localDeleteMode, setLocalDeleteMode] = useState<boolean>(false);
  const [localConnectFrom, setLocalConnectFrom] = useState<number | null>(null);

  // Effective mode booleans
  const effectiveHeadMode = isSettingHeadMode || localHeadMode;
  const effectiveTailMode = isSettingTailMode || localTailMode;
  const effectiveNextMode = isConnectingNextMode || localNextMode;
  const effectiveDeleteMode = isDeletingNodeMode || localDeleteMode;
  const effectiveConnectFrom = pendingConnectFrom !== null ? pendingConnectFrom : localConnectFrom;

  const isAnyToolActive =
    effectiveHeadMode ||
    effectiveTailMode ||
    effectiveNextMode ||
    effectiveDeleteMode ||
    effectiveConnectFrom !== null;

  // Toolbar handlers
  const handleToggleHead = () => {
    if (onToggleHeadMode) {
      onToggleHeadMode();
    } else {
      setLocalTailMode(false);
      setLocalNextMode(false);
      setLocalConnectFrom(null);
      setLocalDeleteMode(false);
      setLocalHeadMode((prev) => !prev);
    }
  };

  const handleToggleTail = () => {
    if (onToggleTailMode) {
      onToggleTailMode();
    } else {
      setLocalHeadMode(false);
      setLocalNextMode(false);
      setLocalConnectFrom(null);
      setLocalDeleteMode(false);
      setLocalTailMode((prev) => !prev);
    }
  };

  const handleToggleNext = () => {
    if (onToggleNextMode) {
      onToggleNextMode();
    } else {
      setLocalHeadMode(false);
      setLocalTailMode(false);
      setLocalDeleteMode(false);
      if (effectiveNextMode || effectiveConnectFrom !== null) {
        setLocalNextMode(false);
        setLocalConnectFrom(null);
      } else {
        setLocalNextMode(true);
        if (selectedAddress !== null) {
          setLocalConnectFrom(selectedAddress);
        } else {
          setLocalConnectFrom(null);
        }
      }
    }
  };

  const handleToggleDelete = () => {
    if (onToggleDeleteMode) {
      onToggleDeleteMode();
    } else {
      setLocalHeadMode(false);
      setLocalTailMode(false);
      setLocalNextMode(false);
      setLocalConnectFrom(null);
      setLocalDeleteMode((prev) => !prev);
    }
  };

  const handleCancelOperation = () => {
    if (onCancelDirectMode) {
      onCancelDirectMode();
    }
    setLocalHeadMode(false);
    setLocalTailMode(false);
    setLocalNextMode(false);
    setLocalConnectFrom(null);
    setLocalDeleteMode(false);
  };

  const handleCreateNodeAction = () => {
    if (onCreateNode) {
      onCreateNode();
    } else if (onOpenCreateNodeModal) {
      onOpenCreateNodeModal();
    }
  };

  // Traverse the linked list from HEAD
  const orderedNodes: SLLNode[] = [];
  const visitedAddresses = new Set<number>();
  let hasCycle = false;

  let currAddr = pointers.headAddress;
  while (currAddr !== null) {
    if (visitedAddresses.has(currAddr)) {
      hasCycle = true;
      break;
    }
    visitedAddresses.add(currAddr);
    const node = nodes.find((n) => n.address === currAddr);
    if (node) {
      orderedNodes.push(node);
      currAddr = node.nextAddress;
    } else {
      break;
    }
  }

  // All nodes not visited from HEAD are considered unlinked
  const unlinkedNodes = nodes.filter((n) => !visitedAddresses.has(n.address));

  // Determine which nodes to display in the main row
  // If HEAD is set and reachable nodes exist: show orderedNodes
  // If HEAD is NULL but nodes exist in RAM: display all nodes in RAM so the user can interact and set HEAD!
  const isAwaitingHead = orderedNodes.length === 0 && nodes.length > 0;
  const primaryStageNodes = isAwaitingHead ? nodes : orderedNodes;
  // If awaiting head, all nodes are shown in the primary row, so unlinked section is not needed
  const secondaryUnlinkedNodes = isAwaitingHead ? [] : unlinkedNodes;

  // Handle clicking on any node
  const handleNodeClick = (addr: number) => {
    if (onNodeClickDirect) {
      onNodeClickDirect(addr);
      return;
    }

    if (effectiveDeleteMode) {
      onDeleteNodeDirect && onDeleteNodeDirect(addr);
      handleCancelOperation();
    } else if (effectiveConnectFrom !== null && effectiveConnectFrom !== addr) {
      onConnectNextDirect && onConnectNextDirect(effectiveConnectFrom, addr);
      handleCancelOperation();
    } else if (effectiveNextMode && effectiveConnectFrom === null) {
      setLocalConnectFrom(addr);
    } else if (effectiveHeadMode) {
      onSetHeadDirect && onSetHeadDirect(addr);
      handleCancelOperation();
    } else if (effectiveTailMode) {
      onSetTailDirect && onSetTailDirect(addr);
      handleCancelOperation();
    } else {
      onSelectNode(addr);
    }
  };

  // Responsive scale observer
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth - 32;
      const totalCount = primaryStageNodes.length + (primaryStageNodes.length > 0 ? 1 : 0);
      if (totalCount === 0) {
        setScaleFactor(1);
        return;
      }

      const nodeWidth = totalCount >= 6 ? 110 : totalCount >= 4 ? 124 : 142;
      const gapWidth = 18;
      const requiredWidth = totalCount * (nodeWidth + gapWidth) + 80;

      if (containerWidth < requiredWidth && containerWidth > 0) {
        const factor = Math.max(0.55, Math.min(1, containerWidth / requiredWidth));
        setScaleFactor(factor);
      } else {
        setScaleFactor(1);
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [primaryStageNodes.length, secondaryUnlinkedNodes.length]);

  // Reusable node card renderer
  const renderNodeCard = (node: SLLNode, isMainRow: boolean) => {
    const isHead = pointers.headAddress === node.address;
    const isTail = pointers.tailAddress === node.address;
    const isCurrent = pointers.currentAddress === node.address;
    const isSelected = selectedAddress === node.address;
    const isSearchMatch = searchResult === 'found' && node.data === searchTarget;
    const isSourceForNext = effectiveConnectFrom === node.address;
    const isTarget = guideTargetAddress === node.address;

    return (
      <div key={node.id || node.address} className="flex items-center shrink-0 relative">
        {/* Floating HEAD Banner above node */}
        {isHead && (
          <motion.div
            initial={{ y: -6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute -top-9 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none"
          >
            <div className="px-2.5 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-mono font-bold shadow-md flex items-center gap-1 whitespace-nowrap">
              <span>HEAD</span>
              <ArrowDown className="w-3 h-3 stroke-[2.5]" />
            </div>
          </motion.div>
        )}

        {/* Floating TAIL Banner below node */}
        {isTail && (
          <motion.div
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute -bottom-9 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none"
          >
            <div className="px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-mono font-bold shadow-md flex items-center gap-1 whitespace-nowrap">
              <ArrowUp className="w-3 h-3 stroke-[2.5]" />
              <span>TAIL</span>
            </div>
          </motion.div>
        )}

        {/* Guide Target Indicator */}
        {isTarget && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: [-4, 0, -4], opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none"
          >
            <div className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-bold shadow-lg shadow-amber-500/40 flex items-center gap-1 whitespace-nowrap">
              <Sparkles className="w-3 h-3 text-slate-950" />
              <span>TARGET NODE</span>
            </div>
            <ArrowDown className="w-3.5 h-3.5 text-amber-500 font-bold stroke-[3]" />
          </motion.div>
        )}

        {/* Floating CURRENT Pointer */}
        {isCurrent && (
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute -top-11 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none"
          >
            <div className="px-2 py-0.5 rounded-full bg-cyan-500 text-white text-[9px] font-mono font-bold shadow-md shadow-cyan-500/40 flex items-center gap-1 whitespace-nowrap">
              <Eye className="w-3 h-3" />
              <span>CURRENT</span>
            </div>
            <ArrowDown className="w-3 h-3 text-cyan-500 animate-pulse stroke-[3]" />
          </motion.div>
        )}

        {/* Node Card Element */}
        <div
          id={`sll-node-${node.address}`}
          onDragOver={(e) => {
            e.preventDefault();
            if (draggingFromAddr && draggingFromAddr !== node.address) {
              setDragOverAddr(node.address);
            }
          }}
          onDragLeave={() => setDragOverAddr(null)}
          onDrop={(e) => {
            e.preventDefault();
            const from = Number(e.dataTransfer.getData('text/plain') || draggingFromAddr);
            if (from && from !== node.address) {
              onConnectNextDirect && onConnectNextDirect(from, node.address);
            }
            setDraggingFromAddr(null);
            setDragOverAddr(null);
          }}
          onClick={() => handleNodeClick(node.address)}
          className={`relative flex flex-col rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none overflow-hidden group shadow-xs ${
            effectiveDeleteMode
              ? 'border-rose-500 ring-4 ring-rose-400/40 bg-rose-50/40 dark:bg-rose-950/30 scale-[1.02]'
              : isSourceForNext
              ? 'border-purple-600 ring-4 ring-purple-500/50 bg-purple-50 dark:bg-purple-950/40 scale-105 shadow-md'
              : effectiveConnectFrom !== null && effectiveConnectFrom !== node.address
              ? 'border-emerald-500 ring-4 ring-emerald-400/50 bg-emerald-50 dark:bg-emerald-950/30 animate-pulse'
              : dragOverAddr === node.address
              ? 'border-emerald-500 ring-4 ring-emerald-400/50 bg-emerald-50 dark:bg-emerald-950/40 scale-105'
              : effectiveHeadMode
              ? 'border-cyan-500 ring-4 ring-cyan-400/40 bg-cyan-50/40 dark:bg-cyan-950/30 scale-[1.02]'
              : effectiveTailMode
              ? 'border-amber-500 ring-4 ring-amber-400/40 bg-amber-50/40 dark:bg-amber-950/30 scale-[1.02]'
              : isTarget
              ? 'border-amber-400 ring-4 ring-amber-400/40 bg-amber-50/50 dark:bg-amber-950/30 scale-105'
              : isSearchMatch
              ? 'border-emerald-500 ring-4 ring-emerald-500/30 shadow-lg bg-emerald-50 dark:bg-emerald-950/40'
              : isCurrent
              ? 'border-cyan-500 ring-4 ring-cyan-500/30 shadow-lg bg-cyan-50/50 dark:bg-cyan-950/30 scale-105'
              : isSelected
              ? 'border-indigo-600 dark:border-purple-400 ring-4 ring-indigo-500/25 shadow-md bg-indigo-50/40 dark:bg-purple-950/30'
              : 'border-slate-300 dark:border-purple-500/40 bg-white dark:bg-[#0E1736] hover:border-indigo-400 dark:hover:border-purple-400 hover:shadow-md hover:scale-[1.02]'
          }`}
          style={{ minWidth: '136px' }}
        >
          {/* Node Header: NODE | ADDR */}
          <div className="bg-slate-100 dark:bg-[#152148] px-2.5 py-1 border-b border-slate-200 dark:border-purple-500/30 flex items-center justify-between text-[10px] font-mono">
            <span className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">NODE</span>
            <span className="font-bold text-indigo-700 dark:text-purple-300 bg-white dark:bg-[#0B1228] px-1.5 py-0.2 rounded border border-slate-200 dark:border-purple-500/30">
              ADDR: {node.address}
            </span>
          </div>

          {/* Node Body with DATA, ADDRESS, NEXT */}
          <div className="p-2.5 flex flex-col gap-1.5 bg-white dark:bg-[#0E1736]">
            {/* DATA */}
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">DATA:</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800">
                {node.data}
              </span>
            </div>

            {/* ADDRESS */}
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">ADDRESS:</span>
              <span className="font-bold text-indigo-600 dark:text-purple-300 text-xs">
                {node.address}
              </span>
            </div>

            {/* NEXT */}
            <div className="flex items-center justify-between font-mono text-xs pt-1 border-t border-slate-100 dark:border-purple-500/20">
              <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                <LinkIcon className="w-2.5 h-2.5 text-purple-500" />
                <span>NEXT:</span>
              </span>
              <div className="flex items-center gap-1">
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenChangeNext(node.address);
                  }}
                  title="Click to edit NEXT pointer"
                  className={`font-bold px-1.5 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                    node.nextAddress !== null
                      ? 'bg-indigo-100 dark:bg-purple-950 text-indigo-700 dark:text-purple-300 border border-indigo-200 dark:border-purple-500/30 hover:bg-indigo-200'
                      : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 hover:bg-rose-200'
                  }`}
                >
                  {node.nextAddress !== null ? node.nextAddress : 'NULL'}
                </span>

                {/* Visible NEXT Draggable Connector Dot */}
                <div
                  draggable
                  onDragStart={(e) => {
                    e.stopPropagation();
                    e.dataTransfer.setData('text/plain', String(node.address));
                    setDraggingFromAddr(node.address);
                  }}
                  onDragEnd={() => {
                    setDraggingFromAddr(null);
                    setDragOverAddr(null);
                  }}
                  title="Drag NEXT → to destination node"
                  className="w-3.5 h-3.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-125 transition-transform shadow-xs shrink-0"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Tool Action Overlays */}
          {effectiveDeleteMode && (
            <div className="bg-rose-600 text-white text-[9px] font-mono font-bold py-1 px-1 text-center flex items-center justify-center gap-1 animate-pulse">
              <Trash2 className="w-2.5 h-2.5" />
              <span>CLICK TO DELETE</span>
            </div>
          )}
          {effectiveHeadMode && (
            <div className="bg-cyan-600 text-white text-[9px] font-mono font-bold py-1 px-1 text-center flex items-center justify-center gap-1 animate-pulse">
              <ArrowDown className="w-2.5 h-2.5" />
              <span>SELECT AS HEAD</span>
            </div>
          )}
          {effectiveTailMode && (
            <div className="bg-amber-500 text-slate-950 font-mono font-bold py-1 px-1 text-center flex items-center justify-center gap-1 animate-pulse text-[9px]">
              <ArrowUp className="w-2.5 h-2.5" />
              <span>SELECT AS TAIL</span>
            </div>
          )}
          {effectiveConnectFrom !== null && effectiveConnectFrom !== node.address && (
            <div className="bg-emerald-600 text-white text-[9px] font-mono font-bold py-1 px-1 text-center flex items-center justify-center gap-1 animate-pulse">
              <LinkIcon className="w-2.5 h-2.5" />
              <span>CONNECT NEXT HERE</span>
            </div>
          )}
          {isSourceForNext && (
            <div className="bg-purple-600 text-white text-[9px] font-mono font-bold py-1 px-1 text-center flex items-center justify-center gap-1">
              <span>SOURCE NODE</span>
            </div>
          )}
          {effectiveNextMode && effectiveConnectFrom === null && (
            <div className="bg-purple-600 text-white text-[9px] font-mono font-bold py-1 px-1 text-center flex items-center justify-center gap-1 animate-pulse">
              <span>CLICK AS SOURCE</span>
            </div>
          )}
        </div>

        {/* Arrow connector in main row */}
        {isMainRow && (
          <div className="flex items-center px-1.5 shrink-0">
            {node.nextAddress !== null ? (
              <div className="flex items-center text-indigo-500 dark:text-purple-400">
                <div className="w-4 sm:w-8 h-[2px] bg-indigo-500 dark:bg-purple-400" />
                <ArrowRight className="w-4 h-4 -ml-1.5 text-indigo-500 dark:text-purple-400 shrink-0 stroke-[2.5]" />
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOverNull(true);
                }}
                onDragLeave={() => setIsDragOverNull(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  const from = Number(e.dataTransfer.getData('text/plain') || draggingFromAddr);
                  if (from) {
                    onConnectNextDirect && onConnectNextDirect(from, null);
                  }
                  setDraggingFromAddr(null);
                  setIsDragOverNull(false);
                }}
                onClick={() => onConnectNextDirect && onConnectNextDirect(node.address, null)}
                className="flex items-center cursor-pointer group/null"
                title="NEXT points to NULL (Terminator) - Click to confirm NULL"
              >
                <div className="w-3 sm:w-6 h-[2px] bg-rose-400 dark:bg-rose-500" />
                <ArrowRight className="w-3.5 h-3.5 -ml-1 text-rose-400 dark:text-rose-500 shrink-0" />
                <div
                  className={`ml-1 px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold transition-all shadow-2xs ${
                    isDragOverNull
                      ? 'bg-rose-500 text-white ring-4 ring-rose-400/50 scale-110'
                      : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-500/40 text-rose-600 dark:text-rose-400 group-hover/null:bg-rose-100'
                  }`}
                >
                  NULL
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      id="sll-interactive-workspace"
      ref={containerRef}
      className="w-full bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/25 rounded-3xl p-4 sm:p-5 shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] relative overflow-hidden flex flex-col justify-between min-h-[360px] font-sans"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:20px_20px] opacity-40 dark:opacity-15 pointer-events-none" />

      {/* 1. TOP HEADER BAR: RAM HEAP WORKSPACE & Node Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-purple-500/20 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-purple-950/60 border border-indigo-200 dark:border-purple-500/30 flex items-center justify-center text-indigo-600 dark:text-purple-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold font-mono text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>RAM HEAP WORKSPACE</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-sans font-bold">
                {nodes.length} Node{nodes.length !== 1 ? 's' : ''} in RAM
              </span>
            </h3>
          </div>
        </div>

        {/* Direct quick hint or info indicator */}
        {isAwaitingHead && (
          <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 px-2.5 py-1 rounded-lg border border-cyan-200 dark:border-cyan-500/30">
            💡 Click [HEAD] then click a node to set list start
          </div>
        )}
      </div>

      {/* 2. POINTER TOOLS TOOLBAR - ALWAYS VISIBLE IN PLAY MODE */}
      <div className="my-2.5 p-3 rounded-2xl bg-slate-50/90 dark:bg-[#070B19]/90 border border-slate-200 dark:border-purple-500/30 shadow-xs relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-indigo-600 dark:text-purple-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>POINTER TOOLS</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:inline">
              (Interactive List Builders)
            </span>
          </div>

          {/* Cancel Operation Button when any tool mode is active */}
          {isAnyToolActive && (
            <button
              id="toolbar-cancel-btn"
              type="button"
              onClick={handleCancelOperation}
              className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/80 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-200 border border-rose-300 dark:border-rose-500/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            >
              <X className="w-3 h-3" />
              <span>CANCEL</span>
            </button>
          )}
        </div>

        {/* 5 Pointer Tools Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 1. + CREATE NODE */}
          <button
            id="toolbar-create-node-btn"
            type="button"
            onClick={handleCreateNodeAction}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
            title="Allocate a new node with data in Heap memory"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Create Node</span>
          </button>

          {/* 2. HEAD */}
          <button
            id="toolbar-head-btn"
            type="button"
            onClick={handleToggleHead}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all ${
              effectiveHeadMode
                ? 'bg-cyan-600 text-white ring-2 ring-cyan-400 ring-offset-1 scale-105'
                : 'bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40'
            }`}
            title="Select a node to set as HEAD"
          >
            <ArrowDown className="w-4 h-4 stroke-[2.5]" />
            <span>{effectiveHeadMode ? 'HEAD ACTIVE' : 'HEAD'}</span>
          </button>

          {/* 3. TAIL */}
          <button
            id="toolbar-tail-btn"
            type="button"
            onClick={handleToggleTail}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all ${
              effectiveTailMode
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400 ring-offset-1 scale-105'
                : 'bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40'
            }`}
            title="Select a node to set as TAIL"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            <span>{effectiveTailMode ? 'TAIL ACTIVE' : 'TAIL'}</span>
          </button>

          {/* 4. NEXT / CONNECT */}
          <button
            id="toolbar-next-btn"
            type="button"
            onClick={handleToggleNext}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all ${
              effectiveNextMode || effectiveConnectFrom !== null
                ? 'bg-purple-600 text-white ring-2 ring-purple-400 ring-offset-1 scale-105'
                : 'bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/40'
            }`}
            title="Connect NEXT pointer from source to destination node"
          >
            <LinkIcon className="w-4 h-4 stroke-[2.5]" />
            <span>
              {effectiveConnectFrom !== null
                ? `NEXT (FROM ${effectiveConnectFrom})`
                : effectiveNextMode
                ? 'NEXT ACTIVE'
                : 'NEXT'}
            </span>
          </button>

          {/* 5. DELETE NODE */}
          <button
            id="toolbar-delete-btn"
            type="button"
            onClick={handleToggleDelete}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all ${
              effectiveDeleteMode
                ? 'bg-rose-600 text-white ring-2 ring-rose-400 ring-offset-1 scale-105'
                : 'bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40'
            }`}
            title="Delete a node from Heap memory"
          >
            <Trash2 className="w-4 h-4" />
            <span>{effectiveDeleteMode ? 'DELETE ACTIVE' : 'Delete Node'}</span>
          </button>
        </div>

        {/* Active Tool Step Instruction Banner */}
        {isAnyToolActive && (
          <div className="mt-2.5 p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-500/40 flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-indigo-900 dark:text-indigo-200 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping shrink-0" />
              <span>
                {effectiveHeadMode && 'Select a node to set as HEAD.'}
                {effectiveTailMode && 'Select a node to set as TAIL.'}
                {effectiveNextMode && effectiveConnectFrom === null && 'Select the source node.'}
                {effectiveConnectFrom !== null && (
                  <span>
                    Select the destination node. (Source: Node <strong>{effectiveConnectFrom}</strong>)
                  </span>
                )}
                {effectiveDeleteMode && 'Select a node to delete.'}
              </span>
            </div>

            {effectiveConnectFrom !== null && (
              <button
                type="button"
                onClick={() => {
                  if (onSetNextToNull) {
                    onSetNextToNull();
                  } else if (onConnectNextDirect) {
                    onConnectNextDirect(effectiveConnectFrom, null);
                    handleCancelOperation();
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-mono font-bold cursor-pointer transition-colors shadow-2xs"
              >
                Set NEXT → NULL
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. LIVE RAM & POINTER STATE METRICS */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-purple-500/20 text-xs font-mono w-full mb-3 relative z-10">
        <div className="flex flex-wrap items-center gap-2">
          {/* Chain Length */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold shadow-2xs">
            <span className="text-slate-400 font-normal">Chain Length:</span>
            <span className="text-indigo-600 dark:text-purple-400">{orderedNodes.length} node{orderedNodes.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Unlinked */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-bold shadow-2xs ${
              unlinkedNodes.length > 0
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
            }`}
          >
            <span className="text-slate-400 font-normal">Unlinked:</span>
            <span>{unlinkedNodes.length} node{unlinkedNodes.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* HEAD Pointer */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-bold shadow-2xs transition-colors ${
              pointers.headAddress !== null
                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${pointers.headAddress !== null ? 'bg-indigo-600 dark:bg-indigo-400 animate-pulse' : 'bg-slate-400'}`} />
            <span>HEAD → {pointers.headAddress !== null ? pointers.headAddress : 'NULL'}</span>
          </div>

          {/* TAIL Pointer */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-bold shadow-2xs transition-colors ${
              pointers.tailAddress !== null
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${pointers.tailAddress !== null ? 'bg-amber-500' : 'bg-slate-400'}`} />
            <span>TAIL → {pointers.tailAddress !== null ? pointers.tailAddress : 'NULL'}</span>
          </div>

          {pointers.currentAddress !== null && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-300 font-bold animate-pulse shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>CURRENT: {pointers.currentAddress}</span>
            </div>
          )}
        </div>
      </div>

      {/* Cycle Warning Banner */}
      {hasCycle && (
        <div className="my-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-200 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Circular Loop Detected! A node pointer cycles back in memory.</span>
        </div>
      )}

      {/* 4. NODE WORKSPACE STAGE */}
      <div className="my-3 relative z-10 flex flex-col items-center justify-center min-h-[190px] w-full">
        {nodes.length === 0 ? (
          <div className="text-center py-8 px-4 border-2 border-dashed border-slate-300 dark:border-purple-500/30 rounded-2xl w-full max-w-md bg-slate-50/50 dark:bg-purple-950/20">
            <div className="w-10 h-10 mx-auto rounded-full bg-slate-200 dark:bg-purple-900/40 flex items-center justify-center text-slate-400 dark:text-purple-300 mb-2">
              <Database className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Linked List is Currently Empty (<code className="font-mono text-indigo-600 dark:text-purple-400">HEAD == NULL</code>)
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Click <strong className="text-indigo-600 dark:text-purple-300">+ Create Node</strong> above to allocate your first node in RAM.
            </p>
          </div>
        ) : (
          <div
            className="w-full flex flex-col items-center justify-center transition-transform duration-200 gap-4"
            style={{
              transform: scaleFactor < 1 ? `scale(${scaleFactor})` : undefined,
              transformOrigin: 'center center',
            }}
          >
            {/* Flex row of reachable nodes or nodes awaiting HEAD */}
            <div className="flex items-center justify-center flex-nowrap gap-1 sm:gap-2 py-4 px-1 overflow-x-auto max-w-full">
              {/* Drop Zone: Before HEAD */}
              {onInsertBetween && orderedNodes.length > 0 && (
                <button
                  type="button"
                  onClick={() => onInsertBetween(null, orderedNodes[0]?.address || null)}
                  className="opacity-40 hover:opacity-100 hover:scale-105 px-1.5 py-3 rounded-xl border border-dashed border-indigo-400 hover:border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-[9px] font-mono font-bold text-indigo-600 dark:text-purple-300 transition-all flex flex-col items-center justify-center shrink-0 cursor-pointer"
                  title="Insert before HEAD"
                >
                  <span>+</span>
                  <span className="text-[7px]">PREPEND</span>
                </button>
              )}

              <AnimatePresence mode="popLayout">
                {primaryStageNodes.map((node) => renderNodeCard(node, true))}
              </AnimatePresence>

              {/* Drop Zone: After TAIL */}
              {onInsertBetween && orderedNodes.length > 0 && (
                <button
                  type="button"
                  onClick={() => onInsertBetween(orderedNodes[orderedNodes.length - 1]?.address || null, null)}
                  className="opacity-40 hover:opacity-100 hover:scale-105 px-1.5 py-3 rounded-xl border border-dashed border-indigo-400 hover:border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-[9px] font-mono font-bold text-indigo-600 dark:text-purple-300 transition-all flex flex-col items-center justify-center shrink-0 cursor-pointer ml-1"
                  title="Insert after TAIL"
                >
                  <span>+</span>
                  <span className="text-[7px]">APPEND</span>
                </button>
              )}
            </div>

            {/* Unlinked / Isolated Nodes in RAM waiting to be linked */}
            {secondaryUnlinkedNodes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 p-3 rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20 flex flex-col items-start gap-2.5 w-full max-w-2xl"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-[10px] shadow-xs">
                      !
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">
                        Unlinked Nodes in Heap RAM (Not connected to HEAD)
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-300">
                        {secondaryUnlinkedNodes.length} node{secondaryUnlinkedNodes.length !== 1 ? 's' : ''} waiting to be linked with NEXT or set as HEAD/TAIL.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 w-full py-2">
                  {secondaryUnlinkedNodes.map((node) => renderNodeCard(node, false))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Traversal Output Buffer Stream */}
      {(levelId === 3 || levelId === 5 || traversalOutput.length > 0) && (
        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-purple-500/20 relative z-10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-purple-400" />
              <span>TRAVERSAL OUTPUT STREAM (<code className="text-indigo-600 dark:text-purple-300">CURRENT → DATA</code>)</span>
            </span>
            {isTraversing && (
              <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                <span>Traversing...</span>
              </span>
            )}
          </div>

          <div className="bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-purple-500/30 rounded-xl p-2 flex items-center gap-2 overflow-x-auto min-h-[38px]">
            {traversalOutput.length === 0 ? (
              <span className="text-xs font-mono text-slate-400 dark:text-slate-600 italic">
                Output buffer empty. Follow CURRENT pointers to stream node data.
              </span>
            ) : (
              <div className="flex items-center gap-1.5">
                {traversalOutput.map((val, idx) => (
                  <React.Fragment key={idx}>
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="px-2 py-0.5 rounded-lg bg-indigo-600 dark:bg-purple-600 text-white font-mono font-bold text-xs shadow-xs"
                    >
                      {val}
                    </motion.div>
                    <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
